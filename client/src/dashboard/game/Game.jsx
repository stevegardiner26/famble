/* eslint-disable camelcase */
import TableCell from '@material-ui/core/TableCell';
import React, { useState, useEffect } from 'react';
import TableRow from '@material-ui/core/TableRow';

import {
  Link,
} from 'react-router-dom';
import gameService from '../../services/gameService';

function Game({ info }) {
  const [homeTeamName, setHome] = useState('');
  const [awayTeamName, setAway] = useState('');

  const getHomeTeam = async (id) => {
    const res = await gameService.getTeam(id).then(setHome);
  };
  const getAwayTeam = async (id) => {
    const res = await gameService.getTeam(id).then(setAway);
  };

  const { home_team_id } = info;
  const { away_team_id } = info;
  const { start_time } = info;
  const { game_id } = info;
  const { status } = info;

  useEffect(() => {
    getHomeTeam(home_team_id);
    getAwayTeam(away_team_id);
  });

  return (
    <TableRow key={game_id}>
      <TableCell align="center">
        {homeTeamName}
      </TableCell>
      <TableCell align="center">
        {awayTeamName}
      </TableCell>
      <TableCell align="center">{start_time}</TableCell>
      <TableCell align="center">{status}</TableCell>
      <TableCell align="center">
        {/*
        <BetModal
          gameID={game_id}
          team1={{ name: `${homeTeamName}`, id: `${home_team_id}` }}
          team2={{ name: `${awayTeamName}`, id: `${away_team_id}` }}
        />
        */}
        <Link to={{
          pathname: `/betpage/${game_id}`,
          state: {
            gameID: `${game_id}`,
            homeTeamID: `${home_team_id}`,
            awayTeamID: `${away_team_id}`,
            homeTeam: `${homeTeamName}`,
            awayTeam: `${awayTeamName}`,
          },
        }}
        >
          Place a Bet!

        </Link>
      </TableCell>
    </TableRow>
  );
}
export default Game;
