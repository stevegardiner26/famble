/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import {
  Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import styles from './BetModal.module.css';
import betService from '../services/betService';
import { selectUser } from '../store/slices/userSlice';

export default function BetPage(props) {
  // eslint-disable-next-line react/destructuring-assignment
  const { homeTeam } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { awayTeam } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { homeTeamID } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { awayTeamID } = props.location.game;
  useEffect(() => {
    if (valid) {
      const setBet = async () => {
        const res = await betService.createBet(userID, gameID, teamID, amount);
        if (res === []) {
          alert('Could not place bet at this time. Try again later.');
        } else {
          alert('Bet placed successfully!');
          setValid(false);
          setModal(!modal);
        }
      };
      setBet();
    }
  }, [valid, userID, gameID, teamID, amount]);

  return (
    <div>
      <h3>{homeTeam}</h3>
      <h3>{awayTeam}</h3>
      <h3>{homeTeamID}</h3>
      <h3>{awayTeamID}</h3>
    </div>
  );
}
