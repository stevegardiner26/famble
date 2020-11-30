/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import BetModal from './BetModal';
import betService from '../services/betService';

function BotBet(props) {
  const [betStats, setBetStats] = useState({ total_amount: 0, total_count: 0 });
  const [awayBetStats, setAwayBetStats] = useState({ total_amount: 0, total_count: 0, percent: 0 });
  const [homeBetStats, setHomeBetStats] = useState({ total_amount: 0, total_count: 0, percent: 0 });

  const {
    gameID, awayTeam, homeTeam, homeTeamID, awayTeamID,
  } = props.location.state;

  useEffect(() => {
    betService.getBetsByGameId(gameID).then((data) => {
      const { bets } = data;
      let trailingAmount = 0;
      let trailingCount = 0;
      let awayBetCount = 0;
      let homeBetCount = 0;
      let homeBetAmount = 0;
      let awayBetAmount = 0;

      bets.forEach((b) => {
        if (b.type === 'bot') {
          trailingAmount += b.amount;
          trailingCount += 1;
          if (b.team_id === awayTeam.team_id) {
            awayBetCount += 1;
            awayBetAmount += b.amount;
          } else if (b.team_id === homeTeam.team_id) {
            homeBetCount += 1;
            homeBetAmount += b.amount;
          }
        }
      });

      setAwayBetStats({ total_amount: awayBetAmount, total_count: awayBetCount });
      setHomeBetStats({ total_amount: homeBetAmount, total_count: homeBetCount });
      setBetStats({ total_amount: trailingAmount, total_count: trailingCount });
    });
  });

  return (
    <div>
      <Container maxWidth="md" style={{ background: 'white', textAlign: 'center' }}>
        <h1>Bet Against the Bot</h1>
        <div className="row">
          <div className="col-md">
            <strong>Home Team</strong>
            {currentGame.status === 'Final' && homeTeam.team_id === currentGame.winner && (
              <p>Winner!</p>
            )}
            <img src={homeTeam.image_url} width="50" height="50" />
            <p>{homeTeam.name}</p>
            <p>11 - 0 - 12</p>
            {currentGame.home_odds < currentGame.away_odds && (
              <h3>The Bot&apos;s Pick!</h3>
            )}
          </div>
          <div className="col-md">
            <p>Bot Image</p>
            <h1>VS</h1>
            <span>{currentGame.start_time.toString()}</span>
            <br />
            <br />
            <BetModal gameID={currentGame.id} team1={{ name: `${homeTeam.name}`, id: `${homeTeam.team_id}` }} team2={{ name: `${awayTeam.name}`, id: `${awayTeam.team_id}` }} type="bot" />
          </div>
          <div className="col-md">
            <strong>Away Team</strong>
            {currentGame.status === 'Final' && awayTeam.team_id === currentGame.winner && (
              <p>Winner!</p>
            )}
            <img src={awayTeam.image_url} width="50" height="50" />
            <p>{awayTeam.name}</p>
            <p>11 - 0 - 12</p>
            {currentGame.away_odds < currentGame.home_odds && (
              <h3>The Bot&apos;s Pick!</h3>
            )}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md">
            <p>Total Money Bet: ${homeBetStats.total_amount} ({(homeBetStats.total_amount / betStats.total_amount) * 100}%)</p>
            <p>Number of Bets: {homeBetStats.total_count} bets ({(homeBetStats.total_count / betStats.total_count) * 100}%)</p>
          </div>
          <div className="col-md">
            <h2>Current Betting Stats</h2>
            <p>Total Bets: {betStats.total_count} bets</p>
            <p>Total Money Bet: ${betStats.total_amount}</p>
          </div>
          <div className="col-md">
            <p>Total Money Bet: ${awayBetStats.total_amount} ({(awayBetStats.total_amount / betStats.total_amount) * 100}%)</p>
            <p>Number of Bets: {awayBetStats.total_count} bets ({(awayBetStats.total_count / betStats.total_count) * 100}%)</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default BotBet;
