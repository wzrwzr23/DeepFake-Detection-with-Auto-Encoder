import UnityComponent from 'views/dashboard/Default/unity';
import VideoStreamCanvas from 'views/dashboard/Default/video';
import { Grid, CardContent } from '@mui/material';
import { gridSpacing } from 'store/constant';


// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <div>
    <Grid item xs={12} md={12}>
      <>
        <CardContent>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <VideoStreamCanvas streamUrl='https://capstone-flask.azurewebsites.net/frame' />
            </Grid>
          </Grid>
        </CardContent>
      </>
    </Grid>
    <Grid item xs={12} md={12}>
      <>
        <CardContent>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              {/* <UnityComponent /> */}
            </Grid>
          </Grid>
        </CardContent>
      </>
    </Grid>
  </div>
);

export default SamplePage;