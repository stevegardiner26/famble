/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TableCell, TableRow } from '@material-ui/core/TableCell';
import React, { useState, useEffect } from 'react';

function User(props) {
  const { info } = props;
  const { index } = props;
  const { name } = info;
  // const { profile_image } = info;
  const { shreddit_balance } = info;

  return (
    <TableRow>
      <TableCell align="center">{index}</TableCell>
      <TableCell align="center">Profile image</TableCell>
      <TableCell align="center">{name}</TableCell>
      <TableCell align="center">{shreddit_balance}</TableCell>
    </TableRow>
  );
}
export default User;
