import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography, Checkbox, TextField, Button } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const QueueLengthGraphSim = () => {
  const [counters, setCounters] = useState([]);
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const orangeDark = theme.palette.secondary[800];

  const [counterStates, setCounterStates] = useState([false, false]); // Initial states for 5 counters
  const [timeSpan, setTimeSpan] = useState(0); // Initial time span in minutes
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);
  // Handler function to toggle the state of a counter
  const handleCounterToggle = (index) => {
    setCounterStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };
  // Handler function to update the time span
  const handleTimeSpanChange = (event) => {
    setTimeSpan(event.target.value);
  };

  const handleConfirm = () => {
    // Add logic to handle confirmed counters and time span
    console.log("Confirmed counters:", counterStates);
    console.log("Time span:", timeSpan);
    fetchCounters();

  };

  const fetchCounters = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Optionally, pass any data needed by the script
        body: JSON.stringify({ "counter": counterStates, "time": timeSpan })
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger script');
      }
  
      const data = await response.json(); // Read the response body only once
      // console.log(data.output.queue_length); // Handle response from backend
  
      setCounters(data.output);
    } catch (error) {
      console.error('Error fetching counter data:', error);
    }
  };

  useEffect(() => {
    handleConfirm();

    // // Fetch data every second
    // const intervalId = setInterval(fetchCounters, 1000);

    // // Cleanup interval on component unmount
    // return () => clearInterval(intervalId);
  }, []);


  const chartData = {
    type: 'area',
    height: 200,
    options: {
      chart: {
        id: 'support-chart',
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 1
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: true
        },
        y: {
          title: 'num of people '
        },
        marker: {
          show: false
        }
      }
    },
    series: [
      {
        // data: [0, 15, 10, 50, 30, 40, 25]
        data: counters.queue_length
      }

    ]
  };


  useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: {
        theme: 'light'
      }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', newSupportChart);
  }, [navType, orangeDark]);

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                Simulated Queue Length Over Time
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Chart {...chartData} />
      <Grid container spacing={2}>
        {/* Checkbox for each counter */}
        {[0, 1].map((index) => (
          <Grid item key={index}>
            <Checkbox
              checked={counterStates[index]}
              onChange={() => handleCounterToggle(index)}
              color="primary"
            />
            Counter {index + 1}
          </Grid>
        ))}
        {/* Text field for time span */}
        <Grid item>
          <TextField
            label="Time Span (minutes)"
            type="number"
            value={timeSpan}
            onChange={handleTimeSpanChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: '120px' }} // Customize width here
          />
        </Grid>
        {/* Button to confirm counters and time span */}
        <Grid item>
          <Button variant="contained" onClick={handleConfirm}>Confirm</Button>
        </Grid>
      </Grid>
    </Card>

  );
};

export default QueueLengthGraphSim;