/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import {
  Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import {
  Link, Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container, CssBaseline, Typography, Card,
  CardContent, Grid, makeStyles, Paper, List,
  ListItem, ListItemText,
} from '@material-ui/core';
import styles from './BetModal.module.css';
import betService from '../services/betService';
import { selectUser } from '../store/slices/userSlice';
import gameService from '../services/gameService';
import FullWidthTabs from './statsTab';

const useStyles = makeStyles({
  root: {
    padding: '24px',
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    padding: '20px',
  },
});
// TODO Alert User if the amount bet they placed is larger than their balance

export default function BetPage(props) {
  if (!props.location.state) {
    return (
      <Redirect to="/" />
    );
  }
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [teamID, setTeamID] = useState(null);
  const [amount, setAmount] = useState(null);
  const [bets, setBets] = useState([]);
  const [homeTeamName] = useState(props.location.state.homeTeam);
  const [awayTeam] = useState(props.location.state.awayTeam);
  const [homeTeamID] = useState(props.location.state.homeTeamID);
  const [awayTeamID] = useState(props.location.state.awayTeamID);
  const [gameID] = useState(props.location.state.gameID);
  const [homeLogo, setHomeLogo] = useState('');
  const [awayLogo, setAwayLogo] = useState('');
  const [valid, setValid] = useState(false);

  const userID = user._id;
  const fullName = user.name;
  const { balance } = user;
  useEffect(() => {
    if (valid) {
      const setBet = async () => {
        const res = await betService.createBet(userID, gameID, teamID, amount, fullName);
        if (res === []) {
          alert('Could not place bet at this time. Try again later.');
        } else {
          const betAmt = document.getElementById('betAmount');
          alert('Bet placed successfully!');
          setValid(false);
          betAmt.value = '';
        }
      };
      setBet();
    }
  }, [valid, userID, gameID, teamID, amount, fullName]);
  const changeTeamID = (teamSelectedID) => {
    setTeamID(teamSelectedID);
  };

  const changeBet = (event) => {
    const betAmount = event.target.value;
    if (betAmount <= 0 || amount > balance) {
      alert('Please enter a valid bet amount');
      event.target.value = null;
    } else {
      setAmount(betAmount);
    }
  };

  const handleBet = () => {
    if (amount !== null || amount > balance) {
      if (teamID !== null) {
        setValid(true);
      } else {
        alert('Please select a team');
      }
    } else {
      alert('Please enter a valid bet amount');
    }
  };
  const getHomeLogo = async (id) => {
    await gameService.getLogo(id).then(setHomeLogo);
  };
  const getAwayLogo = async (id) => {
    await gameService.getLogo(id).then(setAwayLogo);
  };
  const getBetsForGame = async (id) => {
    await betService.getBetsByGameId(id).then(setBets);
  };
  function BetCount() {
    const homeCount = bets.filter((obj) => obj.team_id === homeTeamID).length;

    const awayCount = bets.filter((obj) => obj.team_id === awayTeamID).length;
    return (
      <Paper className={classes.paper}>
        {`Bets placed on the ${homeTeamName}: ${homeCount}`}
        <br />
        {`
       Bets placed on the ${awayTeam}: ${awayCount}`}

      </Paper>
    );
  }
  function DisplayCurrentBet() {
    let teamName = 'this game.';
    let betAmount = 'no';
    if (bets.length === 0) {
      return (<p>No bets have been placed</p>);
    }

    // eslint-disable-next-line consistent-return
    bets.forEach((row) => {
      // eslint-disable-next-line no-console

      if (row.user_id === userID) {
        betAmount = row.amount;
        teamName = row.teamName;
      }
    });
    return (
      <ListItem alignItems="flex-start">
        <ListItemText
          secondary={(
            <>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {`You currently have ${betAmount} shreddits on ${teamName}`}
              </Typography>
            </>
    )}
        />
      </ListItem>
    );
  }
  useEffect(() => {
    getHomeLogo(homeTeamID);
    getAwayLogo(awayTeamID);
    getBetsForGame(gameID);
  }, []);

  return (
    <CssBaseline>
      <Container maxWidth="lg">
        <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }}>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {`${homeTeamName} vs ${awayTeam}`}
                      </Typography>
                      <img alt="" height="100px" src={`${homeLogo}`} />
                      <img alt="" height="100px" src={`${awayLogo}`} />
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
              <Grid item xs={12} />
              <Grid item xs={3}>

                <Paper className={classes.paper}>
                  <List style={{ overflow: 'auto', maxHeight: 300 }}>
                    {bets.map((row) => (
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={row.name}
                          secondary={(
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                              >
                                {`${row.amount} Shreddits on ${row.teamName}`}
                              </Typography>
                            </>
                       )}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={5}>

                <Paper className={classes.paper}>
                  <FullWidthTabs
                    homeTeamName={homeTeamName}
                    awayTeamName={awayTeam}
                    homeTeamID={homeTeamID}
                    awayTeamID={awayTeamID}
                  />

                </Paper>
              </Grid>
              <Grid item xs={4}>

                <Paper className={classes.paper}>
                  <DisplayCurrentBet />
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
                        <Col sm={2}>
                          <Label check>
                            <Input onClick={() => changeTeamID(homeTeamID)} type="radio" name="team" />
                            {homeTeamName}
                          </Label>
                        </Col>
                        <Col sm={2}>
                          <Label check>
                            <Input onClick={() => changeTeamID(awayTeamID)} type="radio" name="team" />
                            {awayTeam}
                          </Label>
                        </Col>
                      </FormGroup>
                    </FormGroup>
                  </Form>
                  <Button color="primary" style={{ margin: '10px' }} onClick={handleBet}>Submit Bet</Button>
                  <Link to="/dashboard">
                    <Button color="secondary">Cancel</Button>
                  </Link>
                </Paper>

              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.paper}>
                  {`Total bets placed on this game: ${bets.length}`}
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <BetCount />
              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.paper}>xs=3</Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.paper}>xs=3</Paper>
              </Grid>
            </Grid>
          </div>
        </Typography>
      </Container>
    </CssBaseline>
  );
}
