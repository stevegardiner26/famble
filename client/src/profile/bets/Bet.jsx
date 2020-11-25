/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import TableCell from '@material-ui/core/TableCell';
import React, { useState, useEffect } from 'react';
import TableRow from '@material-ui/core/TableRow';
import {
  Link,
} from 'react-router-dom';
import gameService from '../../services/gameService';

function Game({ info }) {
  const [teamName, setTeamName] = useState('');
  const [homeTeamID, setHomeTeamID] = useState('');
  const [awayTeamID, setAwayTeamID] = useState('');
  const [homeTeamName, setHome] = useState('');
  const [awayTeamName, setAway] = useState('');
  const [status, setStatus] = useState('');
  const { game_id } = info;
  const { team_id } = info;
  const { updatedAt } = info;
  const { amount } = info;

  const getHomeTeam = async (id) => {
    const res = await gameService.getTeam(id).then(setHome);
  };
  const getAwayTeam = async (id) => {
    const res = await gameService.getTeam(id).then(setAway);
  };

  const getTeamName = async (id) => {
    await gameService.getTeam(id).then(setTeamName);
  };

  const getGame = async (id) => {
    await gameService.getGameById(id).then((res) => {
      setStatus(res.status);
      setAwayTeamID(res.away_team_id);
      setHomeTeamID(res.home_team_id);
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getHomeTeam(homeTeamID);
      getAwayTeam(awayTeamID);
    }
    return function cleanup() {
      mounted = false;
    };
  }, [homeTeamID, awayTeamID]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getTeamName(team_id);
      getGame(game_id);
    }
    return function cleanup() {
      mounted = false;
    };
  });

  return (
    <TableRow key={game_id}>
      <TableCell align="center">{updatedAt}</TableCell>
      <TableCell align="center">{teamName}</TableCell>
      <TableCell align="center">{amount}</TableCell>
      <TableCell align="center">{status}</TableCell>
      <TableCell align="center">
        <Link to={{
          pathname: `/betpage/${game_id}`,
          state: {
            gameID: `${game_id}`,
            homeTeamID: `${homeTeamID}`,
            awayTeamID: `${awayTeamID}`,
            homeTeam: `${homeTeamName}`,
            awayTeam: `${awayTeamName}`,
          },
        }}
        >
          Update/View Bet

        </Link>
      </TableCell>
    </TableRow>
  );
}
export default Game;
