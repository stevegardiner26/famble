const Client = require('node-rest-client').Client;
const mongoose = require('mongoose');
const Stat = mongoose.model('stats');
const Team = mongoose.model('teams');
const client = new Client();

// app.get('/api/bets/teams/:team_id', getStatsbyTeamId) 
async function getStatsByTeamID(req, res){
    return res.status(200).send({
        wins: 10,
        losses: 10,
        touchdowns: 157,
        passing_attempts: 2738,
        completion_percentage: 1.5,
        passing_yards: 1000,
        fumbles_forced: 45,
        rushing_yards: 1000,
        penalty_yards: 1000,
        sacks: 67,
    });
}

exports.client = client;
exports.fetchTeamStats = fetchTeamStats;
exports.getStatsByTeamID = getStatsByTeamID;