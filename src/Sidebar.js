import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { store } from './redux/store';
import { actions } from './redux/actions';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import LaunchIcon from '@material-ui/icons/Launch';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
// import Link from '@material-ui/core/Link';
import { Link } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  list: {
    backgroundColor: '#262626',
    color: '#31E89F',
    width: 250,
  },
  icon: {
    color: '#31E89F',
  },
  listItem: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
    }
  },
  link: {
    margin: theme.spacing(1),
    color: '#ffffffde',
    fontFamily: 'Bungee, Roboto, cursive',
    fontWeight: 'lighter',
    fontSize: '1em',
    paddingLeft: '0.5em',
    display: 'inline-block',
  },
  listHeading: {
    margin: theme.spacing(1),
    color: '#ffffffde',
    fontFamily: 'Bungee, Roboto, cursive',
    fontWeight: 'lighter',
    fontSize: '1.3em',
    paddingLeft: '0.5em',
    display: 'inline-block',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',

    }
  }

}));

const StyledListItemText = withStyles({
  primary: {
    color: '#ffffffde',
    fontFamily: 'Bungee, Roboto, cursive',
  },
})(ListItemText);

const StyledDrawer = withStyles({
  paperAnchorLeft: {
    backgroundColor: '#262626',
  }
})(Drawer);

export const SideBar = (props) => {
  const { drawerOpen } = props;
  const classes = useStyles();
  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography onClick={showContactCard(true)}  className={classes.listHeading} variant="h6">Michael DiSabatino Tech</Typography>
      <List>
          <ListItem component={Link} to={"/"} onClick={console.log("clicked home")} className={classes.listItem} button key={"home"}>
            <ListItemIcon><LaunchIcon className={classes.icon} /></ListItemIcon>
            <StyledListItemText primary={"home"} />
          </ListItem>
          {/* <ListItem component={Link} to={"/merryChristmasGabby"} onClick={console.log("clicked merry christmas gabby")} className={classes.listItem} button key={"gabby"}>
            <ListItemIcon><LaunchIcon className={classes.icon} /></ListItemIcon>
            <StyledListItemText primary={"merry christmas gabby"} />
          </ListItem>
          <ListItem component={Link} to={"/merryChristmasDad"} onClick={console.log("clicked merry christmas dad")} className={classes.listItem} button key={"dad"}>
            <ListItemIcon><LaunchIcon className={classes.icon} /></ListItemIcon>
            <StyledListItemText primary={"merry christmas dad"} />
          </ListItem> */}
          <ListItem component={Link} to={"/about"} onClick={console.log("clicked about")} className={classes.listItem} button key={"about"}>
            <ListItemIcon><LaunchIcon className={classes.icon} /></ListItemIcon>
            <StyledListItemText primary={"about"} />
          </ListItem>
          <ListItem onClick={showContactCard(true)} className={classes.listItem} button key={"contact"}>
            <ListItemIcon><LaunchIcon className={classes.icon} /></ListItemIcon>
            <StyledListItemText primary={"contact"} />
          </ListItem>
      </List>
    </div>
  );
  return (
    <>
      <StyledDrawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {sideList('left')}
      </StyledDrawer>
    </>
  );
}

const toggleDrawer = (open) => event => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }

  store.dispatch(actions.toggleDrawer(open));
};

const showContactCard = (showContactCard) => event => {
  event.preventDefault();

  store.dispatch(actions.showContactCard(showContactCard));
};