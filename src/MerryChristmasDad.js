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
  marginLeft: '5rem',
  marginRight: '5rem',
  marginBottom: '1.5rem',
  fontFamily: "Source Sans Pro",
}


export const MerryChristmasDad = (props) => {
  console.log("props about ", props);
  return (
    <Grid container style={aboutStyle} className="aboutContainer" justify="center" alignItems="center">
      <Typography style={h1Style} variant="h3">Merry Christmas Dad!</Typography>
      <Typography style={pStyle} variant="body1">To our Father, the current Patriarch of the DiSabatino 
        Family name, the God Father of the Delaware Landscaping Mafia. Your 3 sons have procured for 
        you a present that will outshine the brightest of Christmas trees. There will be ballads sung in 
        days of new to pay credence to the days of old... 

        days when legends were made... 

        where BEASTS were born.</Typography>
      <ReactPlayer url='https://www.youtube.com/watch?v=CjSDA1NIIDY' width='100%' height='700px'/>
    </Grid>
  );
};