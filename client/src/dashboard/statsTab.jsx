/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import {
  Tab, Table, TableRow, TableCell, TableBody,
  TableHead,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import statService from '../services/statService';
import StatCell from './StatCell';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  grid: {
    position: 'absolute',
    width: 'fit-content',
    backgroundColor: theme.palette.background.paper,
    fontSize: '25px',
    color: theme.palette.text.secondary,
    '& hr': {
      margin: theme.spacing(0, 0.5),
    },
  },
}));

export default function SimpleTabs(props) {
  const { homeTeamID } = props;
  const { awayTeamID } = props;
  const { homeTeamName } = props;
  const { awayTeamName } = props;
  const [homeStats, setHomeStat] = useState([]);
  const [awayStats, setAwayStat] = useState([]);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getHomeStats = async (id) => {
    await statService.getTeamStats(id).then((response) => {
      setHomeStat(response.teamStats);
    });
  };
  const getAwayStats = async (id) => {
    await statService.getTeamStats(id).then((response) => {
      setAwayStat(response.teamStats);
    });
  };
  useEffect(() => {
    getHomeStats(homeTeamID);
    getAwayStats(awayTeamID);
  }, []);
  return (

    <div className={classes.root}>
      <AppBar position="static">
        <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Records" {...a11yProps(0)} />
          <Tab label="Offense/Defense Stats" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>

        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">{homeTeamName}</TableCell>
              <TableCell align="right" />
              <TableCell align="center">Team Stats</TableCell>
              <TableCell align="right" />
              <TableCell align="left">{awayTeamName}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            <StatCell homeStat={homeStats.wins} stat="Wins" awayStat={awayStats.wins} />
            <StatCell homeStat={homeStats.losses} stat="Losses" awayStat={awayStats.losses} />
            <StatCell homeStat={homeStats.touchdowns} stat="Touchdowns" awayStat={awayStats.touchdowns} />
            <StatCell homeStat={homeStats.penalty_yards} stat="Penalty Yards" awayStat={awayStats.penalty_yards} />

          </TableBody>
        </Table>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">{homeTeamName}</TableCell>
              <TableCell align="right" />
              <TableCell align="center">Team Stats</TableCell>
              <TableCell align="right" />
              <TableCell align="left">{awayTeamName}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StatCell homeStat={homeStats.passing_attempts} stat="Passing Attempts" awayStat={awayStats.passing_attempts} />
            <StatCell homeStat={homeStats.completion_percentage} stat="Completion Percentage" awayStat={awayStats.completion_percentage} />
            <StatCell homeStat={homeStats.passing_yards} stat="Passing Yards" awayStat={awayStats.passing_yards} />
            <StatCell homeStat={homeStats.rushing_yards} stat="Rushing Yards" awayStat={awayStats.rushing_yards} />
            <StatCell homeStat={homeStats.fumbles_forced} stat="Fumbles Forced" awayStat={awayStats.fumbles_forced} />

          </TableBody>
        </Table>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}
