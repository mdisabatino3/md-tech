import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import { store } from './redux/store';
import { actions } from './redux/actions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#262626',
    color: '#ffffffde',
    fontFamily: 'Bungee, Roboto, cursive',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: '#31E89F',
  },
  toolbar: {
    minHeight: 128,
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
  },
  iconButton: {
    color: '#31E89F',
  }
}));

const StyledTypography = withStyles({
  h5: {
    fontFamily: 'Bungee, Roboto, cursive',
    marginRight: '-30px',
    display: 'inline-block',
    whiteSpace: 'inherit',
  }
})(Typography);

export const Header = () => {
  const classes = useStyles();
  return (
    <>
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            onClick={() => store.dispatch(actions.toggleDrawer(true))}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <StyledTypography className={classes.title} variant="h5" noWrap>
            Michael DiSabatino Tech
          </StyledTypography>
          <IconButton className={classes.iconButton} aria-label="search" color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton className={classes.iconButton} aria-label="display more actions" edge="end" color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};