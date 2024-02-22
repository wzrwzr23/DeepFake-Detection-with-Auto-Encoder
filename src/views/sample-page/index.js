// material-ui
import { useEffect, useState } from 'react';
import { Grid, Checkbox, TextField } from '@mui/material';
import pic from 'assets/images/charts/current.png'
// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => {
  // const [isLoading, setLoading] = useState(true);
  const [counterStates, setCounterStates] = useState([false, false, false, false, false]); // Initial states for 5 counters
  const [timeSpan, setTimeSpan] = useState(0); // Initial time span in minutes
  // useEffect(() => {
  //   setLoading(false);
  // }, []);
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
  return (
  <MainCard title="Simulation">
    <img src={pic} alt="My Image" style={{width: '100%', height: 'auto' }}/>

    <Grid container spacing={2}>
        {/* Checkbox for each counter */}
        {[0, 1, 2, 3, 4].map((index) => (
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
          />
        </Grid>
      </Grid>
  </MainCard>
  
);};

export default SamplePage;
