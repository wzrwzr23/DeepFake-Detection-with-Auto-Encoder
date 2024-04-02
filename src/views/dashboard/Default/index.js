import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography, CardContent, Divider, Checkbox } from '@mui/material';
import Switch from '@mui/material/Switch';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';


// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
// import ArrivalAndService from './arrivalAndService';
import QueueLengthGraphSim from './queueLengthGraphSim';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  const [counter1, setCounter1] = useState([]);
  const [counter2, setCounter2] = useState([]);
  const [allcounters, setAllCounters] = useState([]);

  const [firstRecordTime, setFirstRecordTime] = useState();
  const [lastRecordTime, setLastRecordTime] = useState();

  // State variables for checkboxes and their initial values
  const [counter1Status, setCounter1Status] = useState(false);
  const [counter2Status, setCounter2Status] = useState(false);

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
      setLastRecordTime(data1.record_time[0].slice(11, 16));
      setFirstRecordTime(data1.record_time[data1.record_time.length - 1].slice(11, 16));
      const response = await fetch('http://127.0.0.1:5001/arrival_rate');
      const data = await response.json();
      setAllCounters(data);
      const response3 = await fetch('http://127.0.0.1:5001/cur_counter');
      const data3 = await response3.json();
      setCounter1Status(data3.status[0]);
      setCounter2Status(data3.status[1]);
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

  // Toggle functions for checkboxes
  const handleCounter1Toggle = () => {
    setCounter1Status(!counter1Status);
    // Update counter status in the database
    // You may need to implement a function to update the status in the backend
  };

  const handleCounter2Toggle = () => {
    setCounter2Status(!counter2Status);
    // Update counter status in the database
    // You may need to implement a function to update the status in the backend
  };

  const qLength = {
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

  const wTime = {
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
        data: counter1.avg_waiting_time
      },
      {
        name: 'Counter 2',
        data: counter2.avg_waiting_time
      }
    ]
  };
  const aRate = {
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
        name: 'Arrival Rate',
        data: allcounters.arrival_rate
      }
    ]
  };
  const sRate = {
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
        data: counter1.service_rate
      },
      {
        name: 'Counter 2',
        data: counter2.service_rate
      }
    ]
  };

  useEffect(() => {
    const qL = {
      ...qLength.options,
      colors: [orangeDark],
      tooltip: {
        theme: 'light'
      }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', qL);
  }, [navType, orangeDark]);
  useEffect(() => {
    const wT = {
      ...wTime.options,
      colors: [orangeDark],
      tooltip: {
        theme: 'light'
      }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', wT);
  }, [navType, orangeDark]);
  useEffect(() => {
    const aR = {
      ...aRate.options,
      colors: [orangeDark],
      tooltip: {
        theme: 'light'
      }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', aR);
  }, [navType, orangeDark]);
  useEffect(() => {
    const sR = {
      ...sRate.options,
      colors: [orangeDark],
      tooltip: {
        theme: 'light'
      }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', sR);
  }, [navType, orangeDark]);

  return (
    <MainCard title="Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <>
                {isLoading ? (
                  <SkeletonPopularCard />
                ) : (
                  <CardContent>
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12} sx={{ pt: '16px !important' }}>
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
                          <Chart {...qLength} />
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {firstRecordTime}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1.5 }} />
                      </Grid>
                      <Grid item xs={12} sx={{ pt: '16px !important' }}>
                        <Card sx={{ bgcolor: 'secondary.light' }}>
                          <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
                            <Grid item xs={12}>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                  <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                                    Average Waiting Time Over Time (Minutes)
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Chart {...wTime} />
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {firstRecordTime}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                )}
              </>
            </Grid>
            <Grid item xs={12} md={6}>
              <>
                {isLoading ? (
                  <SkeletonPopularCard />
                ) : (
                  <CardContent>
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12} sx={{ pt: '16px !important' }}>
                        <Card sx={{ bgcolor: 'secondary.light' }}>
                          <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
                            <Grid item xs={12}>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                  <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                                    Arrival Rate Over Time (Number of People per Minute)
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Chart {...aRate} />
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {firstRecordTime}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1.5 }} />
                      </Grid>
                      <Grid item xs={12} sx={{ pt: '16px !important' }}>
                        <Card sx={{ bgcolor: 'secondary.light' }}>
                          <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
                            <Grid item xs={12}>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                  <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                                    Service Rate Over Time (Number of People per Minute)
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Chart {...sRate} />
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            <Grid item>
                              {/* Display first record_time with only the time part */}
                              <Typography variant="caption" color="text.secondary">
                                {firstRecordTime}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {/* Display last record_time with only the time part */}
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                )}
              </>
            </Grid>


            <Grid item xs={12} md={12}>
              {isLoading ? (
                <SkeletonPopularCard />
              ) : (
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ paddingTop: '16px !important' }}>
                      <Card sx={{ bgcolor: 'secondary.light' }}>
                        <Grid container sx={{ padding: 2, paddingBottom: 0, color: '#fff' }}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                              Counter Status
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">Current Counter 1: {counter1Status ? 'Open' : 'Closed'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">Current Counter 2: {counter2Status ? 'Open' : 'Closed'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container alignItems="center">
                              <Grid item xs={12}>
                                <Typography variant="body2">Update Counter 1 Current Status:</Typography>
                                <Switch checked={counter1Status} onChange={handleCounter1Toggle} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container alignItems="center">
                              <Grid item xs={12}>
                                <Typography variant="body2">Update Counter 2 Current Status:</Typography>
                                <Switch checked={counter2Status} onChange={handleCounter2Toggle} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              )}
            </Grid>





            <Grid item xs={12} md={12}>
              <>
                {isLoading ? (
                  <SkeletonPopularCard />
                ) : (
                  <CardContent>
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12} sx={{ pt: '16px !important' }}>
                        <QueueLengthGraphSim />
                      </Grid>
                    </Grid>
                  </CardContent>
                )}
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Dashboard;
