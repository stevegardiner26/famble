/* eslint-disable no-unused-vars */
import React, {useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { useSelector, useDispatch } from 'react-redux';

import { selectUser, logout } from '../store/slices/userSlice';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import BetModal from './BetModal';
import Game from './game/Game';
import { GoogleLogout } from 'react-google-login';

import gameService from '../services/gameService';
import styles from './Dashboard.module.css';

// import gameService from '../services/gameService';
const CLIENT_ID="405646879728-34aukb2l8lsknikc11pprr5i53pt3lvo.apps.googleusercontent.com"
const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: '16px',
  },
}));
const useStyles2 = makeStyles({
  table: {
    minWidth: 650,
  },
});
const useStyles3 = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));



function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

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

function Dashboard(props) {
  const avatar = useStyles3();
  const [page, setPage] = React.useState(0);
  const [games, setGames] = useState([]);
  const classes = useStyles2();
  const [rowsPerPage, setRowsPerPage] = React.useState(9);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, games.length - page * rowsPerPage);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
   // Code to Handle Logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Code for getting the games -----------------
  // const [games, setGames] = useState(null);
  const getGames = async () => {
    const res =  await gameService.getAllGames();
    setGames(res);
  };
  
  useEffect(() => {
    if (games.length === 0) {
      getGames();
    }
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }}>
          <div className={avatar.root}>
            <Avatar alt="User" src= { user.profile_image } />
          </div>
          <br/>
          <GoogleLogout
          clientId={ CLIENT_ID }
          buttonText='Logout'
          onLogoutSuccess={ handleLogout }
          />
          <br/>
          <TableContainer component={Paper}>
          <Table className = {classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Home Team</TableCell>
              <TableCell align="center">Away Team</TableCell>
              <TableCell align="center">Date/Time</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Final Score</TableCell>
              <TableCell align="center">Bet link</TableCell>
              
            </TableRow>
          </TableHead>
            <TableBody>
            {(rowsPerPage > 0
              ? games.slice(142,games.length-1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : games
            ).map((row) => (    
                <Game info={row}/>
              ))}
              
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  rowsPerPageOptions={[9,10, 25]}
                  colSpan={3}
                  count={games.length-141}
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
        </Typography>
      </Container>
    </React.Fragment>
  );
}

export default Dashboard;
