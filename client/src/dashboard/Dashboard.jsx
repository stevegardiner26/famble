/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  CssBaseline, Container, TableContainer, Table, TableBody, TableCell,
  TableHead, TableRow, Paper, IconButton,
  TableFooter, TablePagination,
}
  from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Game from './game/Game';
import gameService from '../services/gameService';
import NavBar from '../components/NavBar';

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
    marginLeft: '16px',
  },
});
const useStyles2 = makeStyles({
  table: {
    minWidth: 650,
  },
});

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

function Dashboard() {
  const [page, setPage] = React.useState(0);
  const [games, setGames] = useState([]);
  const classes = useStyles2();
  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, games.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Code for getting the games -----------------
  const getGames = async () => {
    await gameService.getWeeklyGames().then(setGames);
  };

  useEffect(() => {
    if (games.length === 0) {
      getGames();
    }
  });

  return (
    // eslint-disable-next-line react/jsx-fragments
    <React.Fragment>
      <NavBar pageName="Dashboard" />
      <CssBaseline />
      <Container maxWidth="md">
        <TableContainer style={{ marginTop: '30px', marginBottom: '40px' }} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Home Team</TableCell>
                <TableCell align="center">Away Team</TableCell>
                <TableCell align="center">Date/Time</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Bet link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? games.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : games
              ).map((row) => (
                <Game key={row.game_id} info={row} />
              ))}

            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[9, 10, 25]}
                  colSpan={3}
                  count={games.length}
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
      </Container>
    </React.Fragment>
  );
}

export default Dashboard;
