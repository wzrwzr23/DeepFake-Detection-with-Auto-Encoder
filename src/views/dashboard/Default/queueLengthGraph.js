import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const QueueLengthGraph = () => {
  const [counter1, setCounter1] = useState([]);
  const [counter2, setCounter2] = useState([]);

  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const orangeDark = theme.palette.secondary[800];
  const fetchCounters = async () => {
    try {
      const response1 = await fetch('http://127.0.0.1:5001/counter?counter_id=1');
      const data1 = await response1.json();
      setCounter1(data1);
      const response2 = await fetch('http://127.0.0.1:5001/counter?counter_id=2');
      const data2 = await response2.json();
      setCounter2(data2);
    } catch (error) {
      console.error('Error fetching counter data:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchCounters();
    // // Fetch data every second
    // const intervalId = setInterval(fetchCounters, 1000);

    // // Cleanup interval on component unmount
    // return () => clearInterval(intervalId);
  }, []);

  // const firstRecordTime = counter1.record_time[0].slice(11, 16);
  // const lastRecordTime = counter1.record_time[counter1.record_time.length - 1].slice(11, 16);

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
          title: 'Ticket '
        },
        marker: {
          show: false
        }
      }
    },
    series: [
      {
        name: 'Counter 1',
        data: counter1.queue_length
      },
      {
        name: 'Counter 2',
        data: counter2.queue_length
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
                Queue Length Over Time
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Chart {...chartData} />
      <Grid container justifyContent="space-between" sx={{ p: 2 }}>
        <Grid item>
          {/* Display first record_time with only the time part */}
          <Typography variant="caption" color="text.secondary">
            {/* {firstRecordTime} */}
          </Typography>
        </Grid>
        <Grid item>
          {/* Display last record_time with only the time part */}
          <Typography variant="caption" color="text.secondary">
            {/* {lastRecordTime} */}
          </Typography>
        </Grid>
      </Grid>
    </Card>

  );
};

export default QueueLengthGraph;
