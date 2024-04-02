import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography } from '@mui/material';

import { Unity, useUnityContext } from "react-unity-webgl";

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const Unity = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <iframe
          title="Unity WebGL"
          src="/unity/index.html"  // Adjust the path as per your project structure
          width="960"
          height="600"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen"
        ></iframe>
      </Grid>
    </Card>

  );
};

export default Unity;
