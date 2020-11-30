import React from 'react';
import {
  TableRow, TableCell,
} from '@material-ui/core';

export default function BetPage(props) {
  const { homeStat } = props;
  const { awayStat } = props;
  const { stat } = props;

  return (
    <TableRow>
      <TableCell align="right">
        {homeStat}
      </TableCell>
      <TableCell align="right" />
      <TableCell align="center">{stat}</TableCell>
      <TableCell align="left" />
      <TableCell align="left">
        {awayStat}
      </TableCell>
    </TableRow>
  );
}
