/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TableContainer, Table, TableBody, TableCell,
  TableHead, List, ListItem, ListItemText, ListItemAvatar, TableRow, Paper, Avatar, IconButton,
  TableFooter, TablePagination,
}
  from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import styles from './Profile.module.css';
import betService from '../services/betService';
import { selectUser } from '../store/slices/userSlice';
import Logout from '../components/Logout';
import Bet from './bets/Bet';

const useStyles = makeStyles(() => ({
  root: {
    flexShrink: 0,
    marginLeft: '16px',
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    count, page, rowsPerPage, onChangePage,
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

function Profile() {
  const user = useSelector(selectUser);
  const [bets, setBets] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const userID = user._id;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getBet = async () => {
    await betService.getBetsByUserId(userID).then((res) => {
      if (res.error === false) {
        setBets(res.bets);
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getBet();
    }
    return function cleanup() {
      mounted = false;
    };
  });

  return (
    <div className={styles.page}>
      <div className={styles.profile_info}>
        <List className={styles.root}>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={user.profile_image} />
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={`Balance: ${user.shreddit_balance} Shreddits`} />
          </ListItem>
        </List>
        <Logout />
      </div>
      <TableContainer className={styles.tableContainer} component={Paper}>
        <Table className={styles.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={styles.title} align="center" colSpan={5}>Bet History</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Date Placed:</TableCell>
              <TableCell align="center">Team/Bot:</TableCell>
              <TableCell align="center">Amount Bet:</TableCell>
              <TableCell align="center">Game Status:</TableCell>
              {/* <TableCell align="center" /> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? bets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : bets
            ).map((row) => (
              <Bet info={row} />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[9, 10, 25]}
                colSpan={3}
                count={bets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Profile;
