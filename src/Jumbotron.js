import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AnimatedLogo from './AnimatedLogo';

const useStyles = makeStyles(theme => ({
  jumbotron: {
    backgroundColor: '#121212' ,
    height: '560px',
    width: '100%',
  },
}));

export const Jumbotron = () => {
  const classes = useStyles();
  return(
    <Grid container className={classes.jumbotron} justify="center" alignItems="center">
      <AnimatedLogo></AnimatedLogo>
    </Grid>
  );
};