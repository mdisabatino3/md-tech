import React from 'react';
import Grid from '@material-ui/core/Grid';
import './App.css';
import { Typography } from '@material-ui/core';
import ReactPlayer from 'react-player';

const aboutStyle = {
  backgroundColor: '#121212',
  width: '100%',
  textAlign: 'center',
}
const h1Style = {
  marginTop: '3rem',
  color: '#FFFFFFDE'
}
const pStyle = {
  marginTop: '1rem',
  marginBottom: '1.5rem',
  marginLeft: '5rem',
  marginRight: '5rem',
  fontFamily: "Source Sans Pro",
}


export const MerryChristmasGabby = (props) => {
  console.log("props about ", props);
  return (
    <Grid container style={aboutStyle} className="aboutContainer" justify="center" alignItems="center">
      <Typography style={h1Style} variant="h3">Merry Christmas Gabby!</Typography>
      <Typography style={pStyle} variant="body1">
      To our dearest sister Gabby,

      due to you being difficult to shop for and your historical disapproval of our gifts to you, 
      we have decided to move forward this year with giving you a gift that can’t be wrapped under the tree. 
      The gift that truly keeps on giving all year long is the gift of an experience...

      An experience that will one day be a memory...

      A memory that will be cherished for all days to come...

      We present to you...
      </Typography>
      <ReactPlayer url='https://www.youtube.com/watch?v=oGohmV6PsGY' width='100%' height='700px' />
    </Grid>
  );


};