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
  // data returned from server
  const [counters, setCounters] = useState({
    counter1: { queue_length: [], served_customers: [] },
    counter2: { queue_length: [], served_customers: [] },
    unsatisfied: 0
  });
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const orangeDark = theme.palette.secondary[800];
  // const anotherColor = theme.palette

  // "counter" [False, True]
  const [counter, setCounter] = useState([]);
  // "points" [60, 120, 145]
  const [points, setPoints] = useState([]); // Initial time span in minutes
  const [isLoading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [showRows, setShowRows] = useState(false);
  // "time" 180
  const [totalTime, setTotalTime] = useState(0);
  // "changes" [[True, True], [True, False], [True, True]]
  const [changes, setChanges] = useState([counter]);
  const [tempRowCount, setTempRowCount] = useState('');
  const [tempTotalTime, setTempTotalTime] = useState('');

  useEffect(() => {
    setCounter(new Array(rowCount).fill([false, false]));
    // Initialize points with a length of rowCount, filled with default values (e.g., 0 or '')
    setPoints(new Array(rowCount).fill(''));
  }, [rowCount]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    setTempRowCount(e.target.value);
  };

  const generateRows = () => {
    const rows = [];
    if (rowCount === 0) {
      // Optionally, display a message or return nothing if rowCount is 0
      return [<Typography key="no-rows" variant="body1">No rows to display.</Typography>];
    }
    for (let i = 0; i < rowCount; i++) {
      rows.push(
        <Grid container spacing={2} key={i}>
          {[0, 1].map((index) => (
            <Grid item key={index} sx={{ display: 'flex', alignItems: 'center' }}> {/* Add custom styles */}
              <Checkbox
                checked={counter[i] ? counter[i][index] : false}
                onChange={() => handleCounterToggle(i, index)}
                color="primary"
                alignItems='right'
              />
              <Typography variant="body1" sx={{ marginLeft: '6px' }}>Counter {index + 1}</Typography> {/* Add margin to align text */}
            </Grid>
          ))}
          <Grid item>
            <TextField
              label="Time of Change"
              type="number"
              value={points[i] || ''}
              onChange={(e) => handleTimeSpanChange(i, e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: '120px', height: '70px' }}
            />
          </Grid>
        </Grid>
      );
    }
    rows.push(
      <Grid item key="confirm" sx={{ marginTop: '8px' }}> {/* Add margin to the confirm button */}
        <Button variant='contained' onClick={handleConfirm}>Confirm</Button>
      </Grid>);
    return rows;
  };

  // Handler function to toggle the state of a counter
  const handleCounterToggle = (rowIndex, index) => {
    setCounter((prevCounter) => {
      const newCounter = prevCounter.map((row, i) =>
        i === rowIndex ? row.map((item, j) =>
          j === index ? !item : item) : row);
      // Update changes state to include the new counter state
      setChanges((prevChanges) => [...prevChanges, newCounter]);
      return newCounter;
    });
  };

  // Handler function to update the time span for a specific counter
  const handleTimeSpanChange = (index, value) => {
    setPoints((prevSpans) => {
      const newSpans = [...prevSpans];
      newSpans[index] = value;
      return newSpans;
    });
  };

  const handleTotalTimeSpanChange = (e) => {
    setTempTotalTime(e.target.value);
  };

  const handleFirstConfirm = () => {
    const newRowCount = parseInt(tempRowCount, 10) || 0; // Default to 0 if conversion fails or input is empty
    setRowCount(newRowCount);

    const newTotalTime = parseInt(tempTotalTime, 10) || 0; // Default to 0 if conversion fails or input is empty
    setTotalTime(newTotalTime);

    setShowRows(true);
  };

  const handleConfirm = () => {
    fetchCounters();
  };

  const fetchCounters = async () => {
    try {
      // console.log({ "counter": [false, true], "points": points, "changes": changes[changes.length-1], "time": totalTime });
      const response = await fetch('http://127.0.0.1:5001/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "counter": [false, true], "points": points, "changes": changes[changes.length - 1], "time": totalTime })
      });
      // console.log(response);
      if (!response.ok) {
        throw new Error('Failed to trigger script');
      }

      const data = await response.json(); // Read the response body only once
      // console.log(data);
      setCounters(data);
      console.log(data); // Handle response from backend

    } catch (error) {
      console.error('Error fetching counter data:', error);
    }
  };


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
          show: false
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
        name: 'Counter 1',
        data: counters.counter1.queue_length
      },
      {
        name: 'Counter 2',
        data: counters.counter2.queue_length
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
    ApexCharts.exec(`support-c/hart`, 'updateOptions', newSupportChart);
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
      <Grid container justifyContent="space-between" sx={{ p: 2 }}>
        <Grid item>
          <Typography variant="caption" color="text.secondary">
            {0}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption" color="text.secondary">
            {totalTime}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} margin={0.5}>
        <Grid item>
          <TextField
            label="Number of Change"
            type='number'
            value={tempRowCount}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: '120px' }}
          />
        </Grid>
        <Grid item>
          <TextField
            label='Total Time (Minutes)'
            type='number'
            value={tempTotalTime}
            onChange={handleTotalTimeSpanChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: '120px' }}
          />
        </Grid>
        <Grid item>
          <Button variant='contained' onClick={handleFirstConfirm}>Change Counters</Button>
        </Grid>
        <Grid container spacing={2} margin={0.1}>
          <Grid item>
            {showRows && generateRows()}
          </Grid>
        </Grid>
        <Grid container spacing={2} margin={0.5}>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              Number of Unsatisfied People: {counters.unsatisfied}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} margin={0.5}>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              Number of Counter 1 Served People: {counters.counter1.served_customers[counters.counter1.served_customers.length - 1]}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              Number of Counter 2 Served People: {counters.counter2.served_customers[counters.counter2.served_customers.length - 1]}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>

  );
};

export default QueueLengthGraphSim;
