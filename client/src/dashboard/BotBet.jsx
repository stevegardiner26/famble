/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import BetModal from './BetModal';
import betService from '../services/betService';
import gameService from '../services/gameService';

function BotBet(props) {
  const [betStats, setBetStats] = useState({ total_amount: 0, total_count: 0 });
  const [awayBetStats, setAwayBetStats] = useState({ total_amount: 0, total_count: 0, percent: 0 });
  const [homeBetStats, setHomeBetStats] = useState({ total_amount: 0, total_count: 0, percent: 0 });
  const [currentGame, setCurrentGame] = useState({
    home_odds: 0, away_odds: 0, status: '', id: 0, winner: 0, start_time: '',
  });
  const {
    gameID, awayTeam, homeTeam, homeTeamID, awayTeamID,
    homeTeamLogo, awayTeamLogo,
  } = props.location.state;

  useEffect(() => {
    gameService.getGameById(gameID).then((game) => {
      setCurrentGame({
        home_odds: game.home_odds,
        away_odds: game.away_odds,
        status: game.status,
        id: game.id,
        winner: game.winner,
        start_time: game.start_time,
      });
    });
    betService.getBetsByGameId(gameID).then((data) => {
      let trailingAmount = 0;
      let trailingCount = 0;
      let awayBetCount = 0;
      let homeBetCount = 0;
      let homeBetAmount = 0;
      let awayBetAmount = 0;

      data.forEach((b) => {
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
  }, []);

  return (
    <div>
      <Container maxWidth="md" style={{ background: 'white', textAlign: 'center' }}>
        <h1>Bet Against the Bot</h1>
        <div className="row">
          <div className="col-md">
            <strong>Home Team</strong>
            {currentGame.status === 'Final' && homeTeamID === currentGame.winner && (
              <p>Winner!</p>
            )}
            <img src={`${homeTeamLogo}`} alt="" />
            <p>{homeTeam}</p>
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
            <BetModal gameID={currentGame.id} team1={{ name: `${homeTeam}`, id: `${homeTeamID}` }} team2={{ name: `${awayTeam}`, id: `${awayTeamID}` }} type="bot" />
          </div>
          <div className="col-md">
            <img src={`${awayTeamLogo}`} alt="" />
            {currentGame.status === 'Final' && awayTeamID === currentGame.winner && (
              <p>Winner!</p>
            )}
            <p>{awayTeam}</p>
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
