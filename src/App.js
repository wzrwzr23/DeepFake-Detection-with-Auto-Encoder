// src/App.js

import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [passengers, setPassengers] = useState([]);
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await fetch('/api/passengers');
        const data = await response.json();
        setPassengers(data);
      } catch (error) {
        console.error('Error fetching passenger data:', error);
      }
    };

    const fetchCounters = async () => {
      try {
        const response = await fetch('/api/counters');
        const data = await response.json();
        setCounters(data);
      } catch (error) {
        console.error('Error fetching counter data:', error);
      }
    };

    fetchPassengers();
    fetchCounters();
  }, []);

  return (
    <div>
      <h1>Passenger Data</h1>
      <table>
        <thead>
          <tr>
            <th>Enter Queue Time</th>
            <th>Enter Counter Time</th>
            <th>Leave Counter Time</th>
            <th>Queuing Time</th>
            <th>Processing Time</th>
            <th>Counter ID</th>
            <th>UID</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.uid}>
              <td>{passenger.time_enter_queue}</td>
              <td>{passenger.time_enter_counter}</td>
              <td>{passenger.time_leave_counter}</td>
              <td>{passenger.queuing_time}</td>
              <td>{passenger.processing_time}</td>
              <td>{passenger.counter_id}</td>
              <td>{passenger.uid}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Counter Data</h1>
      <table>
        <thead>
          <tr>
            <th>Counter ID</th>
            <th>Average Processing Time</th>
            <th>Queue Length</th>
            <th>Record Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {counters.map((counter) => (
            <tr key={counter.counter_id}>
              <td>{counter.counter_id}</td>
              <td>{counter.avg_processing_time}</td>
              <td>{counter.queue_length}</td>
              <td>{counter.record_time}</td>
              <td>{counter.status ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
