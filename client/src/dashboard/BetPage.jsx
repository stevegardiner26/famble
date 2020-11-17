import React from 'react';

export default function BetPage(props) {
  // eslint-disable-next-line react/destructuring-assignment
  const { homeTeam } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { awayTeam } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { homeTeamID } = props.location.game;
  // eslint-disable-next-line react/destructuring-assignment
  const { awayTeamID } = props.location.game;
  return (
    <div>
      <h3>{homeTeam}</h3>
      <h3>{awayTeam}</h3>
      <h3>{homeTeamID}</h3>
      <h3>{awayTeamID}</h3>
    </div>
  );
}
