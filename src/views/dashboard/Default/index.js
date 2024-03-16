import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
// import WaitAndLength from './waitAndLength';
import WaitAndLength from './waitAndLength';
import SimulationQueue from './queueLengthSim';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ArrivalAndService from './arrivalAndService';
import TotalGrowthBarChart from './TotalGrowthBarChart'
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <MainCard title="Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <WaitAndLength isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SimulationQueue isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ArrivalAndService isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={12}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Dashboard;
