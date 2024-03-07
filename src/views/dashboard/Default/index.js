import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './queueLength';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './counterStatus';
import TotalIncomeDarkCard from './arrivalRate';
import TotalIncomeLightCard from './totalServiced';
import EarningCard2 from './queueLengthOverTime'
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

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
          {/* <Grid item lg={6} md={6} sm={6} xs={12}>
            <TotalIncomeLightCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} >
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <TotalIncomeDarkCard isLoading={isLoading}/>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <EarningCard2 isLoading={isLoading} />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    </MainCard>
  );
};

export default Dashboard;
