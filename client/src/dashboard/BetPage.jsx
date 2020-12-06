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
import BetForm from './form/BetForm';
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
  const [previousBet, setPrev] = useState(false);
  const [valid, setValid] = useState(false);

  const userID = user._id;
  const fullName = user.name;
  const balance = user.shreddit_balance;
  useEffect(() => {
    if (valid) {
      const setBet = async () => {
        const res = await betService.createBet(userID, gameID, teamID, amount, fullName, 'default');
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
    // eslint-disable-next-line no-console
    console.log(balance);
    const betAmount = event.target.value;
    if (betAmount <= 0 || amount > balance) {
      alert('Please enter a valid bet amount');
      event.target.value = null;
    } else {
      setAmount(betAmount);
    }
  };
  const handleBet = () => {
    // eslint-disable-next-line no-console
    console.log(balance);
    if (amount !== null && amount < balance) {
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
    await betService.getRegBets(id).then((response) => {
      setBets(response.bets);
    });
    // eslint-disable-next-line no-console
    console.log(bets.bets);
  };
  function BetCount() {
    if (bets.length > 0) {
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
    return (
      <Paper className={classes.paper}>
        <br />
        No bets have been placed yet

      </Paper>
    );
  }
  function DisplayBets() {
    if (bets.length > 0) {
      return (
        bets.map((row) => (
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
        ))
      );
    }
    return (
      <p>No bets have been placed yet</p>

    );
  }

  function DisplayCurrentBet() {
    let teamName = 'this game.';
    let betAmount = 'no';
    if (bets.length > 0) {
      // eslint-disable-next-line consistent-return

      bets.forEach((row) => {
      // eslint-disable-next-line no-console

        if (row.user_id === userID) {
          betAmount = row.amount;
          teamName = row.teamName;
          setTeamID(row.team_id);
          setPrev(true);
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
    return (<p>No bets have been placed</p>);
  }
  useEffect(() => {
    getHomeLogo(homeTeamID);
    getAwayLogo(awayTeamID);
  }, []);
  useEffect(() => {
    getBetsForGame(gameID);
  }, [valid]);

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
                      <Container maxWidth="md" style={{ background: 'white', textAlign: 'center' }}>

                        <div className="row">
                          <div className="col-md">
                            <strong>Home Team</strong>
                            <br />

                            <img src={`${homeLogo}`} alt="Home Team Logo" width="50" height="50" />
                            <p>{homeTeamName}</p>

                          </div>
                          <div className="col-md" style={{ marginTop: '50px' }}>

                            <h1>VS</h1>
                          </div>
                          <div className="col-md">
                            <strong>Away Team</strong>
                            <br />

                            <img src={awayLogo} alt="Away Team Logo" width="50" height="50" />
                            <p>{awayTeam}</p>
                          </div>
                        </div>
                      </Container>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
              <Grid item xs={12} />
              <Grid item xs={3}>

                <Paper className={classes.paper}>
                  <List style={{ overflow: 'auto', maxHeight: 300 }}>
                    <DisplayBets />
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
                  <BetForm
                    homeTeamID={homeTeamID}
                    awayTeamID={awayTeamID}
                    balance={balance}
                    homeTeamName={homeTeamName}
                    awayTeamName={awayTeam}
                  />

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
                <Paper className={classes.paper}>
                  <Link to={{ pathname: `/betpage/bot-bet/${gameID}` }}>
                    Bet Against the Bot
                  </Link>
                </Paper>
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
