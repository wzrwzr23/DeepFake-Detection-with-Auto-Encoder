import math
import pandas as pd
import numpy as np
import heapq
import random
import math
from scipy import stats
from flask import Flask, request, jsonify

app = Flask(__name__)

arrival_rate = 12  # λ: 12 customers per minute

class Customer:
    def __init__(self, id, arrival_time):
        self.id = id
        self.arrival_time = arrival_time
        self.patience_time = np.random.uniform(30, 40)
        self.satisfaction = 'satisfied'
       # self.service_time = np.random.exponential(1/service_rate)   


class Counter:
    def __init__(self, id, service_rate):
        self.id = id
        self.queue = []
        self.servedcustomers = 0
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
        # create counters:
        self.counters = []  
        for i in range(len(self.counters_status)):
            if self.counters_status[i] == True:
                self.counters.append(Counter(i, self.service_rates[i]))
        

        self.customer_id = 1                         # dummy customer id
        self.current_time = 0                        # simulation current time
        self.events = []                             # event priority queue
        self.served_customers = 0                    # total served customers
        self.total_waiting_time = 0                  # total waiting time of served customers
        self.unsatisfied_customers = 0               # total number of custmers who have waiting time larger than patience time
        self.liveunsatisfied_customers = [] 
        
        self.report_data = []
        self.report_data.append({
            'current_time': self.current_time,
            'total_waiting_time': self.total_waiting_time,
            'total_arrivals': self.served_customers
        })                                        # progress tracker
        
        

    def run(self, simulation_time, simulation_rounds, statuschange_time, counters_changedstatus):
        
        opened_counters = []
        for i in range(len(self.counters_status)):
            if self.counters_status[i] == True:
                opened_counters.append('Counter '+str(i))
        original_counters = opened_counters
        
        queuelength_round = {}
        
        servedcustomers_round = {}
        
        unsatisfied_customersnum = []
        
        for round_num in range(simulation_rounds):
            # print('Start to run simulation Round {}'.format(round_num))
            
            self.customer_id = 1                         # dummy customer id
            self.current_time = 0                        # simulation current time
            self.events = []                             # event priority queue
            self.served_customers = 0                    # total served customers
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
            
            change_indicator = False

            while self.current_time < simulation_time:
                add = 0
                
                if self.current_time >= statuschange_time and change_indicator == False:
                    change_indicator = True
                    #print('Counter statuses change now!')
                    # re-create counters based on the changes counter status:
                    l_1 = counters_changedstatus
                    l_2 = self.counters_status
                    
                    #result_indices_open = [index for index, (value_1, value_2) in enumerate(zip(l_1, l_2)) if value_1 and not value_2]
                    #for i in result_indices_open:
                    #    self.counters.append(Counter(i, self.service_rates[i]))
                    
                    result_indices_close = [index for index, (value_1, value_2) in enumerate(zip(l_1, l_2)) if not value_1 and value_2]
                    open_counters = [o for o in self.counters if counters_changedstatus[o.id]]
                    for j in result_indices_close:
                        counter_id_to_remove = j
                        #open_counters = [o for o in self.counters if counters_changedstatus[o.id]]
                        closed_counter = [c for c in self.counters if c.id == counter_id_to_remove][0]
                        if open_counters:
                            # Distribute customers evenly among open counters
                            customers_to_distribute = closed_counter.queue
                            num_open_counters = len(open_counters)
                            customers_per_counter = len(customers_to_distribute) // num_open_counters

                            for i, open_counter in enumerate(open_counters):
                                start_index = i * customers_per_counter
                                end_index = start_index + customers_per_counter
                                customers_to_move = customers_to_distribute[start_index:end_index]
                                open_counter.queue.extend(customers_to_move)
                                
                                for changequeue_customer in customers_to_move:
                                    heapq.heappush(self.events, (self.current_time+add, 'arrival', changequeue_customer, open_counter))
                                    add += 1

                            # Update the queue of the closed counter
                            closed_counter.queue = []
                    self.counters = [counter for counter in self.counters if counter.id not in result_indices_close]
                    
                    result_indices_open = [index for index, (value_1, value_2) in enumerate(zip(l_1, l_2)) if value_1 and not value_2]
                    for i in result_indices_open:
                        self.counters.append(Counter(i, self.service_rates[i]))
                        
                    self.counters = sorted(self.counters, key=lambda counter: counter.id)
                    #print(self.counters)

                self.current_time, event_type, customer, counter = heapq.heappop(self.events)  # find next event

                if event_type == 'arrival':
                    self.handle_arrival(customer, counter)

                elif event_type == 'departure':
                    self.handle_departure(customer, counter)
            
            if len(self.counters) == 2:
                # print('Overall list information of this entire round:')
                if len(self.counters[0].live_data['queue_length']) < len(self.counters[1].live_data['queue_length']):
                    queuelength_difference = len(self.counters[1].live_data['queue_length']) - len(self.counters[0].live_data['queue_length'])
                    self.counters[0].live_data['queue_length'] = [0] * queuelength_difference + self.counters[0].live_data['queue_length']
                    
                    servelength_difference = len(self.counters[1].live_data['served_customers']) - len(self.counters[0].live_data['served_customers'])
                    self.counters[0].live_data['served_customers'] = [0] * servelength_difference + self.counters[0].live_data['served_customers']
                    
                elif len(self.counters[0].live_data['queue_length']) > len(self.counters[1].live_data['queue_length']):
                    queuelength_difference = len(self.counters[0].live_data['queue_length']) - len(self.counters[1].live_data['queue_length'])
                    self.counters[1].live_data['queue_length'] = [0] * queuelength_difference + self.counters[1].live_data['queue_length']
                    
                    servelength_difference = len(self.counters[0].live_data['served_customers']) - len(self.counters[1].live_data['served_customers'])
                    self.counters[1].live_data['served_customers'] = [0] * servelength_difference + self.counters[1].live_data['served_customers']
                
            # for each_counter in self.counters:
            #     print('Counter {}:'.format(each_counter.id))
            #     print(each_counter.live_data)
            # print('Unsatisfied Customers:')
            # print(self.liveunsatisfied_customers)
            # print('_______________________________________________________________________________')
            
            counterlengths = []
            for counter in self.counters:
                counterlengths.append(len(counter.queue))
            #print(counterlengths)
            queuelength_round[round_num] = counterlengths
            
            served_customersnum = []
            for counter in self.counters:
                served_customersnum.append(counter.servedcustomers)
            #print(served_customersnum)
            servedcustomers_round[round_num] = served_customersnum
            
            unsatisfied_customersnum.append(self.unsatisfied_customers)

        return self.generate_report(simulation_time, statuschange_time, queuelength_round, servedcustomers_round, simulation_rounds, original_counters, counters_changedstatus, unsatisfied_customersnum)

    def schedule_next_arrival(self):
        next_arrival_time = self.current_time + np.random.exponential(1 / self.arrival_rate)
        customer = Customer(self.customer_id, next_arrival_time)  # instantiation of a new customer
        self.customer_id += 1
        shortest_queue_counters = [counter for counter in self.counters if len(counter.queue) == min(len(counter.queue) for counter in self.counters)]
        shortest_queue_counter = random.choice(shortest_queue_counters)  # randomly choose one of the counters with the shortest queue
        heapq.heappush(self.events, (next_arrival_time, 'arrival', customer, shortest_queue_counter))  # schedule a future arrival

    def handle_arrival(self, customer, counter):
        #counter.queuelength_record.append(len(counter.queue))
        if len(counter.queue) == 0:  # Immediately start service when the counter is available and no queue present
            self.start_service(customer, counter)
        else:  # add the customer to the counter's queue and schedule potential abandonment
            counter.queue.append(customer)

        self.schedule_next_arrival()  # schedule next arrival

    def start_service(self, customer, counter):
        if customer not in counter.queue:
            counter.queue.append(customer)
        #print(self.current_time - customer.arrival_time)
        if self.current_time - customer.arrival_time > customer.patience_time:
            customer.satisfaction = 'unsatisfied'
        self.total_waiting_time += (self.current_time - customer.arrival_time)  # update total waiting time
        customerservice_time = np.random.exponential(1/counter.service_rate) 
        heapq.heappush(self.events, (self.current_time + customerservice_time, 'departure', customer, counter))  # schedule a future departure (end service)

    def handle_departure(self, customer, counter):
        departure_time = self.current_time
        self.served_customers += 1  # update served customer count
        counter.servedcustomers += 1  # update served customer count for each counter
        if customer.satisfaction == 'unsatisfied':
            self.unsatisfied_customers += 1
        if customer in counter.queue:
            counter.queue.remove(customer)
        self.report_data.append({
            'current_time': self.current_time,
            'total_waiting_time': self.total_waiting_time,
            'total_arrivals': self.served_customers
        })
        # self.live_data = {'queue_length':[], 'served_customers':[]}
        #print('Customer {} left.'.format(customer.id))
        for certain_counter in self.counters:
            #print('Counter {}:'.format(certain_counter.id), "Served Customers: {}".format(certain_counter.servedcustomers), "Queue Length: {}".format(len(certain_counter.queue)))
            certain_counter.live_data['queue_length'].append(len(certain_counter.queue))  
            certain_counter.live_data['served_customers'].append(certain_counter.servedcustomers)
        #print("Unsatisfied Customers: {}".format(self.unsatisfied_customers))
        self.liveunsatisfied_customers.append(self.unsatisfied_customers)
        #print('_______________________________________________________________________________')
        
        
        if counter.queue:
            next_customer = counter.queue.pop(0)  # FCFS
            self.start_service(next_customer, counter)


    def generate_report(self, simulation_time, statuschange_time, queuelength_round, servedcustomers_round, simulation_rounds, original_counters, counters_changedstatus, unsatisfied_customersnum):
        avg_wait_time = self.total_waiting_time / (self.served_customers) if self.served_customers > 0 else 0
        
        queuelist_length = len(queuelength_round[0])
        sums = [0] * queuelist_length
        for key, lst in queuelength_round.items():
            for i, value in enumerate(lst):
                sums[i] += value
        counter_queueaverages = [total / len(queuelength_round) for total in sums] 
        
        # servedlist_length is the number of opened counters
        servedlist_length = len(servedcustomers_round[0])
        sums = [0] * servedlist_length
        for key, lst in servedcustomers_round.items():
            for i, value in enumerate(lst):
                sums[i] += value
        counter_servedaverages = [total / len(servedcustomers_round) for total in sums] 
        
        unsatisfied_averages = sum(unsatisfied_customersnum)/len(unsatisfied_customersnum)
        avg_totalservedcustomers = sum(counter_servedaverages)
        unsatisfied_rate = unsatisfied_averages/avg_totalservedcustomers
        
        
        self.report_data = pd.DataFrame(self.report_data)
        
        opened_counters = []
        for i in range(len(counters_changedstatus)):
            if counters_changedstatus[i] == True:
                opened_counters.append('Counter '+str(i))
        
        result = {
            'Simulation Time': simulation_time,
            'Change of Counter Status Time': statuschange_time,
            'Number of Simulation Rounds': simulation_rounds,
            'Original Opened Counters': original_counters,
            'Current Opened Counters': opened_counters,
            'Expected Served Customers Per Counter': counter_servedaverages,
            #'Average Waiting Time (seconds)': avg_wait_time * 60,
            #'number_total = number_served': self.served_customers,
            'Expected Queue Length Per Counter': counter_queueaverages,
            'Expected Total Served Customers': avg_totalservedcustomers,
            'Expected Unsatisfied Customers': unsatisfied_averages,
            'Expected Unsatisfied Rate': unsatisfied_rate,
    
        }
        
        # for key, value in result.items():
        #     print(f'{key}: {value}')

# ===========================================
            
@app.route('/simulation', methods=['POST'])
def trigger_script():
    request_data = request.json
    simulation = CallCenterSimulation(counters_status=request_data["counter"])
    # Only open more counters since at first open as few counter as we need to decrease waste of manpower:
    simulation.run(int(request_data["time"]), 10, 90, request_data["counter"])
    # For simplicity, let's just print a message
    print("simulation script triggered!")
    return jsonify({"output": simulation.counters[0].live_data})

if __name__ == "__main__":
    app.run(debug=True)
