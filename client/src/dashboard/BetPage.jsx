/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import {
  Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import {
  Link,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import styles from './BetModal.module.css';
import betService from '../services/betService';
import { selectUser } from '../store/slices/userSlice';
import gameService from '../services/gameService';

export default function BetPage(props) {
  const user = useSelector(selectUser);
  const [teamID, setTeamID] = useState(null);
  const [amount, setAmount] = useState(null);
  const [homeLogo, setHomeLogo] = useState('');
  const [awayLogo, setAwayLogo] = useState('');
  const [valid, setValid] = useState(false);
  // eslint-disable-next-line react/destructuring-assignment
  const { homeTeam } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { awayTeam } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { homeTeamID } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { awayTeamID } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { gameID } = props.location.game;
  const userID = user._id;
  useEffect(() => {
    if (valid) {
      const setBet = async () => {
        const res = await betService.createBet(userID, gameID, teamID, amount);
        if (res === []) {
          alert('Could not place bet at this time. Try again later.');
        } else {
          alert('Bet placed successfully!');
          setValid(false);
        }
      };
      setBet();
    }
  }, [valid, userID, gameID, teamID, amount]);
  const changeTeamID = (teamSelectedID) => {
    setTeamID(teamSelectedID);
  };

  const changeBet = (event) => {
    const betAmount = event.target.value;
    if (betAmount <= 0) {
      alert('Please enter a valid bet amount');
      event.target.value = null;
    } else {
      setAmount(betAmount);
    }
  };

  const handleBet = () => {
    if (amount !== null) {
      if (teamID !== null) {
        setValid(true);
      } else {
        alert('Please select a team');
      }
    } else {
      alert('Please enter a bet amount');
    }
  };
  const getHomeLogo = async (id) => {
    await gameService.getLogo(id).then(setHomeLogo);
  };
  const getAwayLogo = async (id) => {
    await gameService.getLogo(id).then(setAwayLogo);
  };
  useEffect(() => {
    getHomeLogo(homeTeamID);
    getAwayLogo(awayTeamID);
  });
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }}>
          <h3>{`${homeTeam} vs ${awayTeam}`}</h3>
          <img alt="" src={`${homeLogo}`} />
          <img alt="" src={`${awayLogo}`} />
          <Form className={styles.bet_form}>
            <FormGroup row>
              <Label for="betAmount" sm={3}>Bet Amount:</Label>
              <Col sm={9}>
                <Input type="number" name="betAmount" id="betAmount" onChange={changeBet} placeholder="Enter Bet Amount" />
              </Col>
            </FormGroup>
            <FormGroup tag="fieldset" row>
              <Label sm={4}>Select a Team:</Label>
              <FormGroup check>
                <Col sm={4}>
                  <Label check>
                    <Input onClick={() => changeTeamID(homeTeamID)} type="radio" name="team" />
                    {homeTeam}
                  </Label>
                </Col>
              </FormGroup>
              <FormGroup check>
                <Col sm={4}>
                  <Label check>
                    <Input onClick={() => changeTeamID(awayTeamID)} type="radio" name="team" />
                    {awayTeam}
                  </Label>
                </Col>
              </FormGroup>
            </FormGroup>
          </Form>
          <Button color="primary" onClick={handleBet}>Submit Bet</Button>
          <Link to="/dashboard">
            <Button color="secondary">Cancel</Button>
          </Link>
        </Typography>
      </Container>
    </>
  );
}
