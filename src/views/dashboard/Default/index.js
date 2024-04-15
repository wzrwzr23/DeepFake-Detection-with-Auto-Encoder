import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography, CardContent, Divider, TextField, Switch, Button } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import InputFileUpload from './upload';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const theme = useTheme();

  return (
    <MainCard title="Video Upload">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <>
                {isLoading ? (
                  <SkeletonPopularCard />
                ) : (
                  <>
                    <CardContent>
                      <Grid container spacing={gridSpacing}>
                        <Grid item xs={5.1} sx={{ pt: '16px !important' }}>
                          <Card sx={{ bgcolor: 'secondary.light' }}>
                            <InputFileUpload/>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {/* Add space for model output */}
                    <CardContent>
                      <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sx={{ pt: '16px !important' }}>
                          <Card sx={{ bgcolor: 'secondary.light' }}>
                            {/* Add your model output component here */}
                            <Typography variant="h6" color="textPrimary">
                              Model Output
                            </Typography>
                            {/* Add your model output content here */}
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </>
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
