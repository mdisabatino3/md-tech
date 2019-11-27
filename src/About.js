import React from 'react';
import Grid from '@material-ui/core/Grid';
import './App.css';
import { Typography } from '@material-ui/core';
import Timeline from './Timeline';
import SpringModal from './SpringModal';

const aboutStyle = {
    backgroundColor: '#121212' ,
    width: '100%',
    display: 'inline-block',
    textAlign: 'center',
}
const h1Style = {
  marginTop: '3rem',
  color: '#FFFFFFDE'
}
const pStyle = {
  marginTop: '1rem',
  marginBottom: '1.5rem',
  fontFamily: "Source Sans Pro",
}


export const About = (props) => {
  console.log("props about ",props);
  return(
    <Grid container style={aboutStyle} className="aboutContainer" justify="center" alignItems="center">
      <Typography style={h1Style} variant="h3">About Me</Typography>
      <Typography style={pStyle} variant="body1">Learn more about me by engaging with this interactive timeline created with d3.</Typography>
      <Timeline {...props} />
      <SpringModal {...props} />
    </Grid>
  );
};