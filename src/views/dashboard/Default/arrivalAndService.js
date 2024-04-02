import PropTypes from 'prop-types';
import Loadable from 'ui-component/Loadable';
import { lazy } from 'react';

// material-ui
import { CardContent, Divider, Grid} from '@mui/material';

// project imports
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
// import ArrivalRate from './arrivalRate';
// import ServiceRate from './serviceRate';
const ArrivalRate = Loadable(lazy(() => import('./arrivalRate')));
const ServiceRate = Loadable(lazy(() => import('./serviceRate')));

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const ArrivalAndService = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <ArrivalRate />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1.5 }} />
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <ServiceRate />
              </Grid>
            </Grid>
          </CardContent>
      )}
    </>
  );
};

ArrivalAndService.propTypes = {
  isLoading: PropTypes.bool
};

export default ArrivalAndService;
