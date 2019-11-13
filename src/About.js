import React from 'react';
import Grid from '@material-ui/core/Grid';
import './App.css';
import { Typography } from '@material-ui/core';

const aboutStyle = {
    backgroundColor: '#121212' ,
    width: '100%',
}
const h1Style = {
  marginTop: '1.5em',
}


export const About = () => {
  return(
    <Grid container style={aboutStyle} className="aboutContainer" justify="center" alignItems="center">
      <Typography style={h1Style} variant="h1">About coming soon</Typography>
    </Grid>
  );
};