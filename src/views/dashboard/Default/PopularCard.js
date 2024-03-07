import PropTypes from 'prop-types';

// material-ui
import { CardContent, Divider, Grid} from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Divider sx={{ my: 1.5 }} />
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <BajajAreaChartCard />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1.5 }} />
              </Grid>
            </Grid>
          </CardContent>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
