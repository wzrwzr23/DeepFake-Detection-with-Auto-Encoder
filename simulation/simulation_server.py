import math
import pandas as pd
import numpy as np
import heapq
import random
import math
from scipy import stats
from flask import Flask, request, jsonify

app = Flask(__name__)

arrival_rate = 12  

class Customer:
    def __init__(self, id, arrival_time):
        self.id = id
        self.arrival_time = arrival_time
        self.patience_time = np.random.uniform(30, 40)
        self.satisfaction = 'satisfied'
       # self.service_time = np.random.exponential(1/service_rate)   


class Counter:
    def __init__(self, id, service_rate, served_customers=0):
        self.id = id
        self.queue = []
        self.servedcustomers = served_customers
        self.service_rate = service_rate      # assign expected service time
        self.live_data = {'queue_length':[], 'served_customers':[]}
        #self.queuelength_record = []               # customer queue length record

# Can both open and close counters during simulation:
class CallCenterSimulation:
    def __init__(self, arrival_rate=12, service_rates=[6/1, 8/1], counters_status = [False, False]):

        self.arrival_rate = arrival_rate             # arrival rate per minute
        self.service_rates = service_rates             # service rate
        self.num_counters = len(counters_status)             # number of counters
        self.counters_status = counters_status
        # create open counters:
        self.counters = []  
        for i in range(len(self.counters_status)):
            if self.counters_status[i] == True:
                self.counters.append(Counter(i, self.service_rates[i]))
        
        # create all counters:
        self.allcounters = []
        for i in range(len(self.counters_status)):
            self.allcounters.append(Counter(i, self.service_rates[i]))
        

        self.customer_id = 1                         # dummy customer id
        self.current_time = 0                        # simulation current time
        self.events = []                             # event priority queue
        self.served_customers = 0                    # total served customers
        self.counter_servedcustomers = [0, 0]        # total served customers per counter
        self.total_waiting_time = 0                  # total waiting time of served customers
        self.unsatisfied_customers = 0               # total number of custmers who have waiting time larger than patience time
        self.liveunsatisfied_customers = [] 
        
        self.report_data = []
        self.report_data.append({
            'current_time': self.current_time,
            'total_waiting_time': self.total_waiting_time,
            'total_arrivals': self.served_customers
        })                                        # progress tracker
        
        

    def run(self, simulation_time, statuschange_time, counters_changedstatus):
        
        opened_counters = []
        for i in range(len(self.counters_status)):
            if self.counters_status[i] == True:
                opened_counters.append('Counter '+str(i))
        original_counters = opened_counters
        
        
        unsatisfied_customersnum = []
        

        self.customer_id = 1                         # dummy customer id
        self.current_time = 0                        # simulation current time
        self.events = []                             # event priority queue
        self.served_customers = 0                    # total served customers
        self.counter_servedcustomers = [0, 0]        # total served customers per counter
        self.total_waiting_time = 0                  # total waiting time of served customers
        self.unsatisfied_customers = 0               # total number of custmers who have waiting time larger than patience time
        self.liveunsatisfied_customers = [] 

        self.report_data = []
        self.report_data.append({
            'current_time': self.current_time,
            'total_waiting_time': self.total_waiting_time,
            'total_arrivals': self.served_customers
        })                                        # progress tracker

        # create counters:
        self.counters = []  
        for i in range(len(self.counters_status)):
            if self.counters_status[i] == True:
                self.counters.append(Counter(i, self.service_rates[i]))

        self.schedule_next_arrival()  # schedule the first arrival

        change_indicator = 0

        allclosed_counters = [ac for ac in self.allcounters if self.counters_status[ac.id]==False]

        while self.current_time < simulation_time:
            add = 0

            if change_indicator < len(statuschange_time):
                if self.current_time >= statuschange_time[change_indicator]:
                    # Inserting the number of served customers for Counter 0 and 1 at index 0 and 1:
                    for k in self.counters:
                        if k.id == 0:
                            number_0 = k.servedcustomers
                            self.counter_servedcustomers[0] = number_0
                        if k.id == 1:
                            number_1 = k.servedcustomers
                            self.counter_servedcustomers[1] = number_1
                    #print('Counter statuses change now!')
                    # re-create counters based on the changes counter status:
                    if change_indicator == 0:                     
                        l_1 = counters_changedstatus[change_indicator]
                        l_2 = self.counters_status
                    else:
                        l_1 = counters_changedstatus[change_indicator]
                        l_2 = counters_changedstatus[change_indicator-1]

                    #result_indices_open = [index for index, (value_1, value_2) in enumerate(zip(l_1, l_2)) if value_1 and not value_2]
                    #for i in result_indices_open:
                    #    self.counters.append(Counter(i, self.service_rates[i]))

                    result_indices_close = [index for index, (value_1, value_2) in enumerate(zip(l_1, l_2)) if not value_1 and value_2]

                    allclosed_counters = [ac for ac in self.allcounters if counters_changedstatus[change_indicator][ac.id]==False]
                    open_counters = [o for o in self.allcounters if counters_changedstatus[change_indicator][o.id]==True]
                    #print(result_indices_close)
                    if len(result_indices_close) != 0:                        
                        for j in result_indices_close:
                            counter_id_to_remove = j
                            closed_counter = [c for c in self.counters if c.id == counter_id_to_remove][0]
                            if open_counters:
                                #print([o.id for o in open_counters])
                                # Distribute customers evenly among open counters
                                customers_to_distribute = closed_counter.queue
                                num_open_counters = len(open_counters)
                                customers_per_counter = len(customers_to_distribute) // num_open_counters
                                
                                #print(len(open_counters))
                                for i, open_counter in enumerate(open_counters):
                                    start_index = i * customers_per_counter
                                    end_index = start_index + customers_per_counter
                                    customers_to_move = customers_to_distribute[start_index:end_index]
                                    #print(len(customers_to_move))

                                    for changequeue_customer in customers_to_move:
                                        heapq.heappush(self.events, (self.current_time+add, 'arrival_noschedule', changequeue_customer, open_counter))
                                        add += 1e-13

                                # Update the queue of the closed counter
                                closed_counter.queue = []
                    if len(result_indices_close) != 0:
                        self.counters = [counter for counter in self.counters if counter.id not in result_indices_close]
                    #self.counters = []
                    result_indices_open = [index for index, (value_1, value_2) in enumerate(zip(l_1, l_2)) if value_1 and not value_2]
                    for i in result_indices_open:
                        self.counters.append(Counter(i, self.service_rates[i], self.counter_servedcustomers[i]))

                    self.counters = sorted(self.counters, key=lambda counter: counter.id)
                    #print(self.counters)
                    change_indicator += 1

            self.current_time, event_type, customer, counter = heapq.heappop(self.events)  # find next event

            if event_type == 'arrival':
                self.handle_arrival(customer, counter)
                
            elif event_type == 'arrival_noschedule':
                self.handle_arrival(customer, counter, schedule = False)

            elif event_type == 'departure':
                self.handle_departure(customer, counter, allclosed_counters)


        # for each_counter in self.allcounters:
        #     print('Counter {}:'.format(each_counter.id))
        #     print(each_counter.live_data)
        # print('Unsatisfied Customers:')
        # print(self.liveunsatisfied_customers)
        # print('_______________________________________________________________________________')

        counterlengths = []
        for counter in self.counters:
            counterlengths.append(len(counter.queue))


        served_customersnum = []
        for counter in self.counters:
            served_customersnum.append(counter.servedcustomers)
            

        unsatisfied_customersnum.append(self.unsatisfied_customers)

        return self.generate_report(simulation_time, statuschange_time, original_counters, counters_changedstatus[change_indicator-1], unsatisfied_customersnum)

    def schedule_next_arrival(self):
        next_arrival_time = self.current_time + np.random.exponential(1 / self.arrival_rate)
        customer = Customer(self.customer_id, next_arrival_time)  # instantiation of a new customer
        self.customer_id += 1
        shortest_queue_counters = [counter for counter in self.counters if len(counter.queue) == min(len(counter.queue) for counter in self.counters)]
        shortest_queue_counter = random.choice(shortest_queue_counters)  # randomly choose one of the counters with the shortest queue
        heapq.heappush(self.events, (next_arrival_time, 'arrival', customer, shortest_queue_counter))  # schedule a future arrival

    def handle_arrival(self, customer, counter, schedule = True):
        #counter.queuelength_record.append(len(counter.queue))
        if len(counter.queue) == 0:  # Immediately start service when the counter is available and no queue present
            self.start_service(customer, counter)
        else:  
            counter.queue.append(customer)
            identity = counter.id
            if schedule == True:
                for i in self.allcounters:
                    if i.id == identity:
                        i.queue.append(customer)
        if schedule == True:
            self.schedule_next_arrival()  # schedule next arrival

    def start_service(self, customer, counter):
        if customer not in counter.queue:
            counter.queue.append(customer)
            identity = counter.id
            for i in self.allcounters:
                if i.id == identity:
                    i.queue.append(customer)
        #print(self.current_time - customer.arrival_time)
        if self.current_time - customer.arrival_time > customer.patience_time:
            customer.satisfaction = 'unsatisfied'
        self.total_waiting_time += (self.current_time - customer.arrival_time)  # update total waiting time
        # if counter.service_rate == 0:
        #     customerservice_time = 0
        # else:
        customerservice_time = np.random.exponential(1/counter.service_rate) 
        heapq.heappush(self.events, (self.current_time + customerservice_time, 'departure', customer, counter))  # schedule a future departure (end service)

    def handle_departure(self, customer, counter, allclosed_counters):
        departure_time = self.current_time
        self.served_customers += 1  # update served customer count
        counter.servedcustomers += 1  # update served customer count for each counter
        identity = counter.id
        for i in self.allcounters:
            if i.id == identity:
                i.servedcustomers += 1
        if customer.satisfaction == 'unsatisfied':
            self.unsatisfied_customers += 1
        if customer in counter.queue:
            counter.queue.remove(customer)
            identity = counter.id
            for i in self.allcounters:
                if i.id == identity:
                    i.queue.remove(customer)
        self.report_data.append({
            'current_time': self.current_time,
            'total_waiting_time': self.total_waiting_time,
            'total_arrivals': self.served_customers
        })
        # self.live_data = {'queue_length':[], 'served_customers':[]}
        #print('Customer {} left.'.format(customer.id))
        for certain_counter in self.allcounters:
            if certain_counter.id in [i.id for i in self.counters]:
                certain_counter.live_data['queue_length'].append(len(certain_counter.queue))  
                certain_counter.live_data['served_customers'].append(certain_counter.servedcustomers)
            else:
                certain_counter.live_data['queue_length'].append(0)  
                certain_counter.live_data['served_customers'].append(self.counter_servedcustomers[certain_counter.id])
        
        #print("Unsatisfied Customers: {}".format(self.unsatisfied_customers))
        self.liveunsatisfied_customers.append(self.unsatisfied_customers)
        #print('_______________________________________________________________________________')
        
        
        if counter.queue:
            next_customer = counter.queue.pop(0)  # FCFS
            identity = counter.id
            for i in self.allcounters:
                if i.id == identity:
                    i.queue.pop(0)
            self.start_service(next_customer, counter)


    def generate_report(self, simulation_time, statuschange_time, original_counters, finalcounters_changedstatus, unsatisfied_customersnum):
        avg_wait_time = self.total_waiting_time / (self.served_customers) if self.served_customers > 0 else 0
        

        
        
        self.report_data = pd.DataFrame(self.report_data)
        
        opened_counters = []
        for i in range(len(finalcounters_changedstatus)):
            if finalcounters_changedstatus[i] == True:
                opened_counters.append('Counter '+str(i))
        
        result = {
            'Simulation Time': simulation_time,
            'Change of Counter Status Time': statuschange_time,           
            'Original Opened Counters': original_counters,
            'Final Opened Counters': opened_counters,
    
        }
        
        # for key, value in result.items():
        #     print(f'{key}: {value}')


# Example usage:
# simulation = CallCenterSimulation(counters_status=[False, True])
# simulation.run(180, [60, 120, 145], [[True, True], [True, False], [True, True]])
#report_df = simulation.report_data

# ===========================================

import pyodbc

connstr = 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:capssqlserverdemo.database.windows.net,1433;Database=sqldb;Uid=Zhuoran;Pwd=aA!12345;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
conn = pyodbc.connect(connstr)
cursor = conn.cursor()

def get_current_counter():
    # Fetch all latest counter info
    select_cmd = f"SELECT status, arrival_rate, service_rate, counter_id FROM [dbo].[current_counter] ORDER BY counter_id ASC"
    cursor.execute(select_cmd)
    results = cursor.fetchall() # Fetch the results
    counter_info = {}
    counter_info["service_rate"] = []
    counter_info["arrival_rate"] = 1
    counter_info["status"] = []

    for row in results: # iterate each counter
        status, arrival_rate, service_rate, counter_id = row
        counter_info["service_rate"].append(service_rate)
        counter_info["arrival_rate"] = arrival_rate
        counter_info["status"].append(True if int(status) == 1 else False)
    return counter_info

counter_info = get_current_counter()

@app.route('/simulation', methods=['POST'])
def trigger_script():
    request_data = request.json
    simulation = CallCenterSimulation(12, [6/1, 8/1], counter_info["status"])
    points = []
    for i in request_data["points"]:
        points.append(int(i))
    simulation.run(int(request_data["time"]), points, request_data["changes"])
    # { "counter": counter, "points": points, "changes": changes, "time": totalTime}
    print("simulation script triggered!")
    # print(int(request_data["time"]), request_data["points"], request_data["changes"])
    # print({"counter1": simulation.allcounters[0].live_data, "counter2": simulation.allcounters[1].live_data})
    return jsonify({"counter1": simulation.allcounters[0].live_data, "counter2": simulation.allcounters[1].live_data})

@app.after_request  
def after(response):
    # print(response.headers)
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

if __name__ == "__main__":
    app.run(host='localhost', debug=True)
