import React from 'react';
import Grid from '@material-ui/core/Grid';
import AnimatedLogo from './AnimatedLogo';
import './App.css';

const jumbotronStyle = {
    backgroundColor: '#121212' ,
    width: '100%',
}


export const Jumbotron = () => {
  return(
    <Grid container style={jumbotronStyle} className="jumbotron" justify="center" alignItems="center">
      <AnimatedLogo></AnimatedLogo>
    </Grid>
  );
};