import PropTypes from 'prop-types';
import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

// material-ui
import { CardContent, Divider, Grid} from '@mui/material';

// project imports
// import QueueLengthGraph from './queueLengthGraph';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
// import WaitingTimeGraph from './waitingTimeGraph';
const WaitingTimeGraph = Loadable(lazy(() => import('./waitingTimeGraph')));
const QueueLengthGraph = Loadable(lazy(() => import('./queueLengthGraph')));

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const WaitAndLength = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <QueueLengthGraph />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1.5 }} />
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                {/* <WaitingTimeGraph /> */}
              </Grid>
            </Grid>
          </CardContent>
      )}
    </>
  );
};

WaitAndLength.propTypes = {
  isLoading: PropTypes.bool
};

export default WaitAndLength;
