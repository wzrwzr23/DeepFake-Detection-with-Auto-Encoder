import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography, CardContent, Divider, TextField, Switch, Button } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';


// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
// import ArrivalAndService from './arrivalAndService';
import QueueLengthGraphSim from './queueLengthGraphSim';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format

// ==============================|| DEFAULT DASHBOARD ||============================== //
const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [vidIsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);
  const [queue1, setQueue1] = useState([]);
  const [queue2, setQueue2] = useState([]);

  const [waiting1, setWaiting1] = useState([])
  const [waiting2, setWaiting2] = useState([])

  const [allcounters, setAllCounters] = useState([]);
  const [service1, setService1] = useState([])
  const [service2, setService2] = useState([])


  const [firstRecordTime1, setFirstRecordTime1] = useState();
  const [lastRecordTime1, setLastRecordTime1] = useState();
  const [firstRecordTime2, setFirstRecordTime2] = useState();
  const [lastRecordTime2, setLastRecordTime2] = useState();
  const [firstRecordTime3, setFirstRecordTime3] = useState();
  const [lastRecordTime3, setLastRecordTime3] = useState();
  const [firstRecordTime4, setFirstRecordTime4] = useState();
  const [lastRecordTime4, setLastRecordTime4] = useState();

  // State variables for checkboxes and their initial values
  const [counter1Status, setCounter1Status] = useState(false);
  const [counter2Status, setCounter2Status] = useState(false);

  const [startDate1, setStartDate1] = useState(currentDate);
  const [endDate1, setEndDate1] = useState(currentDate);
  const [startDate2, setStartDate2] = useState(currentDate);
  const [endDate2, setEndDate2] = useState(currentDate);
  const [startDate3, setStartDate3] = useState(currentDate);
  const [endDate3, setEndDate3] = useState(currentDate);
  const [startDate4, setStartDate4] = useState(currentDate);
  const [endDate4, setEndDate4] = useState(currentDate);
  const [refreshGraph, setRefreshGraph] = useState(false); // State variable to trigger graph refresh

  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const orangeDark = theme.palette.secondary[800];


  const fetchCounters = async () => {
    try {
      //queue length
      const c11 = `http://127.0.0.1:5001/counter?counter_id=1&start_date=${startDate1}&end_date=${endDate1}`;
      const c21 = `http://127.0.0.1:5001/counter?counter_id=2&start_date=${startDate1}&end_date=${endDate1}`;
      const response1 = await fetch(c11);
      const data1 = await response1.json();
      setQueue1(data1.queue_length);

      const response2 = await fetch(c21);
      const data2 = await response2.json();
      setQueue2(data2.queue_length);

      //waiting time
      const c12 = `http://127.0.0.1:5001/counter?counter_id=1&start_date=${startDate2}&end_date=${endDate2}`;
      const c22 = `http://127.0.0.1:5001/counter?counter_id=2&start_date=${startDate2}&end_date=${endDate2}`;
      const response12 = await fetch(c12);
      const data12 = await response12.json();
      setWaiting1(data12.avg_waiting_time)

      const response22 = await fetch(c22);
      const data22 = await response22.json();
      setWaiting2(data22.avg_waiting_time)

      setFirstRecordTime1(data1.record_time[0]);
      setLastRecordTime1(data1.record_time[data1.record_time.length - 1]);
      setFirstRecordTime2(data12.record_time[0]);
      setLastRecordTime2(data12.record_time[data1.record_time.length - 1]);

      const c13 = `http://127.0.0.1:5001/arrival_rate?start_date=${startDate3}&end_date=${endDate3}`;
      const response = await fetch(c13);
      const data = await response.json();
      setAllCounters(data.arrival_rate);
      setFirstRecordTime3(data.record_time[0]);
      setLastRecordTime3(data.record_time[data.record_time.length - 1]);

      const response3 = await fetch('http://127.0.0.1:5001/cur_counter');
      const data3 = await response3.json();
      setCounter1Status(data3.status[0]);
      setCounter2Status(data3.status[1]);

      const c14 = `http://127.0.0.1:5001/service_rate?counter_id=1&start_date=${startDate4}&end_date=${endDate4}`;
      const c24 = `http://127.0.0.1:5001/service_rate?counter_id=2&start_date=${startDate4}&end_date=${endDate4}`;
      const ser_response1 = await fetch(c14);
      const ser_response2 = await fetch(c24);
      const data4 = await ser_response1.json();
      const data5 = await ser_response2.json();

      setService1(data4.service_rate);
      setService2(data5.service_rate);
      setFirstRecordTime4(data4.record_time[0]);
      setLastRecordTime4(data4.record_time[data.record_time.length - 1]);

    } catch (error) {
      console.error('Error fetching counter data:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Update refreshGraph to true every 30 seconds
      setRefreshGraph(true);
    }, 30000); // 30 seconds in milliseconds

    // Clear the interval when the component unmounts or refreshGraph changes
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once when component mounts


  useEffect(() => {
    // Check if refreshGraph is true
    if (refreshGraph) {
      // Fetch data
      fetchCounters();

      // Set refreshGraph back to false after fetching data
      // This will trigger the useEffect again only if refreshGraph is set to true in the future
      // If you want to ensure it runs only once, you might want to remove refreshGraph from the dependency array of useEffect
      // useEffect(() => {...}, []) instead of useEffect(() => {...}, [refreshGraph])
      // This depends on your specific requirements
      setRefreshGraph(false); // Assuming refreshGraph is a mutable variable
    }
  }, [refreshGraph, fetchCounters]);


  const handleStartDateChange1 = (event) => {
    const selectedStartDate = event.target.value;
    // Ensure start date is not after current date
    if (selectedStartDate > currentDate) {
      setStartDate1(currentDate);
    } else if (selectedStartDate > endDate1) {
      // Ensure start date is less than or equal to end date
      setStartDate1(endDate1);
    }
    setStartDate1(selectedStartDate);
  };

  const handleEndDateChange1 = (event) => {
    const selectedEndDate = event.target.value;
    // Ensure end date is not after current date
    if (selectedEndDate > currentDate) {
      setEndDate1(currentDate);
    } else if (selectedEndDate < startDate1) {
      // Ensure end date is greater than or equal to start date
      setEndDate1(startDate1);
    }
    setEndDate1(selectedEndDate);
  };

  const handleStartDateChange2 = (event) => {
    const selectedStartDate = event.target.value;
    // Ensure start date is not after current date
    if (selectedStartDate > currentDate) {
      setStartDate2(currentDate);
    } else if (selectedStartDate > endDate2) {
      // Ensure start date is less than or equal to end date
      setStartDate2(endDate2);
    }
    setStartDate2(selectedStartDate);
  };

  const handleEndDateChange2 = (event) => {
    const selectedEndDate = event.target.value;
    // Ensure end date is not after current date
    if (selectedEndDate > currentDate) {
      setEndDate2(currentDate);
    } else if (selectedEndDate < startDate2) {
      // Ensure end date is greater than or equal to start date
      setEndDate2(startDate2);
    }
    setEndDate2(selectedEndDate);
  };

  const handleStartDateChange3 = (event) => {
    const selectedStartDate = event.target.value;
    // Ensure start date is not after current date
    if (selectedStartDate > currentDate) {
      setStartDate3(currentDate);
    } else if (selectedStartDate > endDate3) {
      // Ensure start date is less than or equal to end date
      setStartDate3(endDate3);
    }
    setStartDate3(selectedStartDate);
  };

  const handleEndDateChange3 = (event) => {
    const selectedEndDate = event.target.value;
    // Ensure end date is not after current date
    if (selectedEndDate > currentDate) {
      setEndDate3(currentDate);
    } else if (selectedEndDate < startDate3) {
      // Ensure end date is greater than or equal to start date
      setEndDate3(startDate3);
    }
    setEndDate3(selectedEndDate);
  };

  const handleStartDateChange4 = (event) => {
    const selectedStartDate = event.target.value;
    // Ensure start date is not after current date
    if (selectedStartDate > currentDate) {
      setStartDate4(currentDate);
    } else if (selectedStartDate > endDate4) {
      // Ensure start date is less than or equal to end date
      setStartDate4(endDate4);
    }
    setStartDate4(selectedStartDate);
  };

  const handleEndDateChange4 = (event) => {
    const selectedEndDate = event.target.value;
    // Ensure end date is not after current date
    if (selectedEndDate > currentDate) {
      setEndDate4(currentDate);
    } else if (selectedEndDate < startDate4) {
      // Ensure end date is greater than or equal to start date
      setEndDate4(startDate4);
    }
    setEndDate4(selectedEndDate);
  };

  const handleDateConfirm1 = async () => {
    const c1 = `http://127.0.0.1:5001/counter?counter_id=1&start_date=${startDate1}&end_date=${endDate1}`;
    const c2 = `http://127.0.0.1:5001/counter?counter_id=2&start_date=${startDate1}&end_date=${endDate1}`;
    const response1 = await fetch(c1);
    const data1 = await response1.json();
    setQueue1(data1.queue_length)
    const response2 = await fetch(c2);
    const data2 = await response2.json();
    setQueue2(data2.queue_length)

    setFirstRecordTime1(data1.record_time[0]);
    setLastRecordTime1(data1.record_time[data1.record_time.length - 1]);
    setRefreshGraph(true); // Trigger graph refresh
  };

  const handleDateConfirm2 = async () => {
    const c1 = `http://127.0.0.1:5001/counter?counter_id=1&start_date=${startDate2}&end_date=${endDate2}`;
    const c2 = `http://127.0.0.1:5001/counter?counter_id=2&start_date=${startDate2}&end_date=${endDate2}`;
    const response1 = await fetch(c1);
    const data1 = await response1.json();
    setWaiting1(data1.avg_waiting_time);
    const response2 = await fetch(c2);
    const data2 = await response2.json();
    setWaiting2(data2.avg_waiting_time);

    setFirstRecordTime2(data1.record_time[0]);
    setLastRecordTime2(data1.record_time[data1.record_time.length - 1]);
    setRefreshGraph(true); // Trigger graph refresh
  };

  const handleDateConfirm3 = async () => {
    const c1 = `http://127.0.0.1:5001/arrival_rate?start_date=${startDate3}&end_date=${endDate3}`;
    const response1 = await fetch(c1);
    const data1 = await response1.json();
    setAllCounters(data1.arrival_rate);

    setFirstRecordTime3(data1.record_time[0]);
    setLastRecordTime3(data1.record_time[data1.record_time.length - 1]);
    setRefreshGraph(true); // Trigger graph refresh
  };

  const handleDateConfirm4 = async () => {
    const c1 = `http://127.0.0.1:5001/service_rate?counter_id=1&start_date=${startDate4}&end_date=${endDate4}`;
    const c2 = `http://127.0.0.1:5001/service_rate?counter_id=2&start_date=${startDate4}&end_date=${endDate4}`;
    const response1 = await fetch(c1);
    const data1 = await response1.json();
    setService1(data1.service_rate);
    const response2 = await fetch(c2);
    const data2 = await response2.json();
    setService2(data2.service_rate);

    setFirstRecordTime4(data1.record_time[0]);
    setLastRecordTime4(data1.record_time[data1.record_time.length - 1]);
    setRefreshGraph(true); // Trigger graph refresh
  };



  const handleCounter1Toggle = () => {
    let newCounter1Status = !counter1Status ? 1 : 0;
    setCounter1Status(newCounter1Status);
    sendCounterStatus('1', newCounter1Status);
  };

  const handleCounter2Toggle = () => {
    let newCounter2Status = !counter2Status ? 1 : 0;
    setCounter2Status(newCounter2Status);
    sendCounterStatus('2', newCounter2Status);
  };

  const sendCounterStatus = (counterId, status) => {
    const url = 'http://127.0.0.1:5001/update_counter';
    const data = { [counterId]: status };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Handle successful response here if needed
      })
      .catch(error => {
        console.error('There was a problem with the POST request:', error);
      });
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
        data: queue1
      },
      {
        name: 'Counter 2',
        data: queue2
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
        data: waiting1
      },
      {
        name: 'Counter 2',
        data: waiting2
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
        data: allcounters
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
        data: service1
      },
      {
        name: 'Counter 2',
        data: service2
      }
    ]
  };

  useEffect(() => {
    if (refreshGraph) {
      const qL = {
        ...qLength.options,
        colors: [orangeDark],
        tooltip: {
          theme: 'light'
        }
      };
      ApexCharts.exec(`support-chart`, 'updateOptions', qL);
      setRefreshGraph(false); // Reset refresh state
    }
  }, [refreshGraph]);
  useEffect(() => {
    if (refreshGraph) {
      const wT = {
        ...wTime.options,
        colors: [orangeDark],
        tooltip: {
          theme: 'light'
        }
      };
      ApexCharts.exec(`support-chart`, 'updateOptions', wT);
      setRefreshGraph(false); // Reset refresh state
    }
  }, [refreshGraph]);

  useEffect(() => {
    if (refreshGraph) {
      const aR = {
        ...aRate.options,
        colors: [orangeDark],
        tooltip: {
          theme: 'light'
        }
      };
      ApexCharts.exec(`support-chart`, 'updateOptions', aR);
      setRefreshGraph(false); // Reset refresh state
    }
  }, [refreshGraph]);

  useEffect(() => {
    if (refreshGraph) {
      const sR = {
        ...sRate.options,
        colors: [orangeDark],
        tooltip: {
          theme: 'light'
        }
      };
      ApexCharts.exec(`support-chart`, 'updateOptions', sR);
      setRefreshGraph(false); // Reset refresh state
    }
  }, [refreshGraph]);


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
                                {firstRecordTime1}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime1}
                              </Typography>
                            </Grid>
                          </Grid>
                          {/* Add date inputs */}
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            {/* Add date inputs */}
                            <Grid item xs={4}>
                              <TextField
                                id="start-date"
                                label="Start Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={startDate1}
                                onChange={handleStartDateChange1}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                id="end-date"
                                label="End Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={endDate1}
                                onChange={handleEndDateChange1}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Button variant="contained" color="primary" onClick={handleDateConfirm1}>
                                Confirm
                              </Button>
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
                                {firstRecordTime2}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime2}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            {/* Add date inputs */}
                            <Grid item xs={4}>
                              <TextField
                                id="start-date"
                                label="Start Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={startDate2}
                                onChange={handleStartDateChange2}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                id="end-date"
                                label="End Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={endDate2}
                                onChange={handleEndDateChange2}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Button variant="contained" color="primary" onClick={handleDateConfirm2}>
                                Confirm
                              </Button>
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
                                    Arrival Rate Over Time (Number of People per Hour)
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Chart {...aRate} />
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {firstRecordTime3}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime3}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            {/* Add date inputs */}
                            <Grid item xs={4}>
                              <TextField
                                id="start-date"
                                label="Start Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={startDate3}
                                onChange={handleStartDateChange3}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                id="end-date"
                                label="End Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={endDate3}
                                onChange={handleEndDateChange3}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Button variant="contained" color="primary" onClick={handleDateConfirm3}>
                                Confirm
                              </Button>
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
                                    Service Rate Over Time (Number of People per Hour)
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
                                {firstRecordTime4}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {/* Display last record_time with only the time part */}
                              <Typography variant="caption" color="text.secondary">
                                {lastRecordTime4}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container justifyContent="space-between" sx={{ p: 2 }}>
                            {/* Add date inputs */}
                            <Grid item xs={4}>
                              <TextField
                                id="start-date"
                                label="Start Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={startDate4}
                                onChange={handleStartDateChange4}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                id="end-date"
                                label="End Date"
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                value={endDate4}
                                onChange={handleEndDateChange4}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Button variant="contained" color="primary" onClick={handleDateConfirm4}>
                                Confirm
                              </Button>
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
                            <Grid container alignItems="center">
                              <Grid item xs={12}>
                                <Typography variant="body2">Counter 1 Current Status:</Typography>
                                <Switch checked={counter1Status} onChange={handleCounter1Toggle} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid container alignItems="center">
                              <Grid item xs={12}>
                                <Typography variant="body2">Counter 2 Current Status:</Typography>
                                <Switch checked={counter2Status} onChange={handleCounter2Toggle} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">&nbsp;&nbsp;&nbsp;{counter1Status ? 'Open' : 'Closed'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">&nbsp;&nbsp;&nbsp;{counter2Status ? 'Open' : 'Closed'}</Typography>
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
