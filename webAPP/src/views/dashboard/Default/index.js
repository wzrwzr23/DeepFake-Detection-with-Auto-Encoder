import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography, CardContent } from '@mui/material';
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
          <InputFileUpload />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Dashboard;
