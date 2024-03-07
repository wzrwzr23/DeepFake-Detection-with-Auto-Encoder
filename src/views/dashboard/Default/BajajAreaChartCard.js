import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const BajajAreaChartCard = () => {
  const [counters, setCounters] = useState([]);
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const orangeDark = theme.palette.secondary[800];

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await fetch('/api/counters');
        const data = await response.json();
        setCounters(data);
      } catch (error) {
        console.error('Error fetching counter data:', error);
      }
    };
    fetchCounters();
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
        // data: [0, 15, 10, 50, 30, 40, 25]
        data: counters.slice(0, 10).map((counter) => (
          counter.avg_processing_time
        ))
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
    </Card>
    
  );
};

export default BajajAreaChartCard;
