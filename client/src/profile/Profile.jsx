import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Profile.module.css';
// SERVICES
import betService from '../services/betService';
import { selectUser } from '../store/slices/userSlice';

function Profile(props) {
  const user = useSelector(selectUser);

  useEffect(() => {
    const setBet = async () => {
      const res = await betService.createBet(userID, gameID, teamID, amount);
    };
    setBet();
  });
  
  return(
    <div>

    </div>
  );
}

export default Profile;
