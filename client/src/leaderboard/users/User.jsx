/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { TableCell, TableRow, ListItemAvatar } from '@material-ui/core';
import React from 'react';

function User(props) {
  const { info } = props;
  const { index } = props;
  const { name } = info;
  const { profile_image } = info;
  const { shreddit_balance } = info;

  const numberWithCommas = (x) => {
    if (x) {
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }
    return null;
  };

  return (
    <TableRow>
      <TableCell align="center">{index}</TableCell>
      <TableCell align="center">
        <ListItemAvatar>
          <div style={{ marginLeft: 'auto', marginRight: 'auto' }} className="MuiAvatar-root MuiAvatar-circle">
            <img alt="User" src={profile_image} className="MuiAvatar-img" referrerPolicy="no-referrer" />
          </div>
        </ListItemAvatar>
      </TableCell>
      <TableCell align="center">{name}</TableCell>
      <TableCell align="center">{`${numberWithCommas(shreddit_balance)}`}</TableCell>
    </TableRow>
  );
}
export default User;
