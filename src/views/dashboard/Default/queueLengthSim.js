import PropTypes from 'prop-types';

// material-ui
import { CardContent, Divider, Grid} from '@mui/material';

// project imports
import QueueLengthGraphSim from './queueLengthGraphSim';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const SimulationQueue = ({ isLoading }) => {
  return (
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
  );
};

SimulationQueue.propTypes = {
  isLoading: PropTypes.bool
};

export default SimulationQueue;
