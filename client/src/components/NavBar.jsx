/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  ListItemAvatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Drawer,
} from '@material-ui/core';
import {
  Dashboard, AccountBox, Assessment, ExitToApp,
} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout, selectUser } from '../store/slices/userSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  MuiIconButtonRoot: {
    borderRadius: '0%',
  },
  list: {
    width: 250,
  },
}));

function NavBar(props) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [redirectProfile, setRedirectProf] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [redirectDash, setRedirectDash] = useState(false);
  const { pageName } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [drawer, setDrawer] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(logout());
    setRedirectHome(true);
  };

  const handleProfile = () => (setRedirectProf(true));
  const handleDash = () => (setRedirectDash(true));

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(!drawer);
  };

  const list = (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        <ListItem button key="Dashboard" onClick={handleDash}>
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button key="Leaderboard">
          <ListItemIcon><Assessment /></ListItemIcon>
          <ListItemText primary="Leaderboard" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="Profile" onClick={handleProfile}>
          <ListItemIcon><AccountBox /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button key="Logout" onClick={handleLogout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      {(redirectProfile) ? <Redirect to="/profile" /> : null}
      {(redirectHome) ? <Redirect to="/" /> : null}
      {(redirectDash) ? <Redirect to="/dashboard" /> : null}
      <AppBar style={{ backgroundColor: '#000' }} position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
            <Drawer
              anchor="left"
              open={drawer}
              onClose={toggleDrawer}
            >
              {list}
            </Drawer>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {pageName}
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              className={classes.MuiIconButtonRoot}
            >
              <ListItemAvatar>
                <div className="MuiAvatar-root MuiAvatar-circle">
                  <img alt="User" src={user.profile_image} className="MuiAvatar-img" referrerPolicy="no-referrer" />
                </div>
              </ListItemAvatar>
              <h6 style={{ paddingTop: '6px' }}>
                {user.name}
                <br />
                {`${user.shreddit_balance} Shredits`}
              </h6>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              getContentAnchorEl={null}
              keepMounted
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
              style={{ top: '50px' }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
