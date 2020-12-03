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
  const [teamName, setTeamName] = useState(null);
  const [homeTeamID, setHomeTeamID] = useState(null);
  const [awayTeamID, setAwayTeamID] = useState(null);
  const [homeTeamName, setHome] = useState(null);
  const [awayTeamName, setAway] = useState(null);
  const [status, setStatus] = useState(null);
  const { game_id } = info;
  const { team_id } = info;
  const { updatedAt } = info;
  const { amount } = info;

  const getHomeTeam = async (id) => {
    const res = await gameService.getTeam(id).then((response) => {
      setHome(response);
    });
  };
  const getAwayTeam = async (id) => {
    const res = await gameService.getTeam(id).then((response) => {
      setAway(response);
    });
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
    getTeamName(team_id);
    getGame(game_id);
    if (homeTeamID) {
      getHomeTeam(homeTeamID);
    }
    if (awayTeamID) {
      getAwayTeam(awayTeamID);
    }
  }, [homeTeamID, awayTeamID, team_id, game_id]);

  function LinkStatus() {
    if (status !== 'Final' && status !== 'F/OT') {
      if (homeTeamName && awayTeamName) {
        return (
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
            Update Bet
          </Link>
        );
      }
      return (
        <span>
          Loading...
        </span>
      );
    }
    return (
      <span>
        Can no longer update bet
      </span>
    );
  }

  return (
    <TableRow key={game_id}>
      <TableCell align="center">{updatedAt}</TableCell>
      <TableCell align="center">{teamName}</TableCell>
      <TableCell align="center">{amount}</TableCell>
      <TableCell align="center">{status}</TableCell>
      <TableCell align="center">
        <LinkStatus />
      </TableCell>
    </TableRow>
  );
}
export default Game;
