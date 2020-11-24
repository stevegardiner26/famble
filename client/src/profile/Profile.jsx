/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
}
  from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styles from './Profile.module.css';
// import betService from '../services/betService';
import { selectUser } from '../store/slices/userSlice';
import Logout from '../components/Logout';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '30ch',
    backgroundColor: '#cfe8fc',
    borderRadius: '25px',
  },
  inline: {
    display: 'inline',
  },
}));

function Profile() {
  const user = useSelector(selectUser);
  // const userID = user._id;
  const list = useStyles();

  useEffect(() => {
    // const getBet = async () => {
    //   const res = await betService.getBetsByUserId(userID);

    // };
    // getBet();
  });

  return (
    <div className={styles.page} style={{ paddingTop: '15px', paddingBottom: '10px' }}>
      <List className={list.root}>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={user.profile_image} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={`Balance: ${user.shreddit_balance} Shreddits`} />
        </ListItem>
      </List>
      <Logout />
    </div>
  );
}

export default Profile;
