import { useEffect, useState } from 'react';

// material-ui
import { Grid, CardContent } from '@mui/material';

// project imports
// import WaitAndLength from './waitAndLength';
import WaitAndLength from './waitAndLength';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import ArrivalAndService from './arrivalAndService';
import QueueLengthGraphSim from './queueLengthGraphSim';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';


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
              <ArrivalAndService isLoading={isLoading} />
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
