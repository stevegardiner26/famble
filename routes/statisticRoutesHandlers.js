const Client = require('node-rest-client').Client;
const client = new Client();
const mongoose = require('mongoose');
const Stat = mongoose.model('stats');

// app.get('/api/stats/teams/:team_id')
async function getStatsByTeamID(req, res){
    const team_id = parseInt(req.params.team_id);
    let team_stats = {
        team_id: team_id, 
        wins: null,
        losses: null,
        touchdowns: null,
        passing_attempts: null,
        completion_percentage: null,
        passing_yards: null,
        fumbles_forced: null,
        rushing_yards: null,
        penalty_yards: null,
        sacks: null,
    };
    const teamStats = await Stat.findOne({team_id: team_id});
    if(teamStats){
        return res.status(201).send({teamStats}); 
    }
    else{
        client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, async function(year){
            client.get(`https://api.sportsdata.io/v3/nfl/scores/json/Standings/${year}`, { headers: { "Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN'] } }, function (data) {
                team_stats = getStatsByTeamIDStandings(data, team_stats);
            });  
            client.get(`https://api.sportsdata.io/v3/nfl/scores/json/TeamSeasonStats/${year}`, { headers: { "Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN'] } }, async function (data) {
                await getStatsByTeamIDTeamSeasonStats(data, team_stats, res);   
            }); 
        });    
    }
    return;
}

function getStatsByTeamIDStandings(data, team_stats){
    const team = data.find(x => x.TeamID === team_stats.team_id);
    team_stats.wins = team.Wins;
    team_stats.losses = team.Losses;
    return team_stats;
}

async function getStatsByTeamIDTeamSeasonStats(data, team_stats, res){
    const team = data.find(x => x.TeamID === team_stats.team_id); 
    team_stats.touchdowns = team.Touchdowns;
    team_stats.passing_attempts = team.PassingAttempts;
    team_stats.completion_percentage = team.CompletionPercentage;
    team_stats.passing_yards = team.PassingYards;
    team_stats.fumbles_forced = team.FumblesForced;
    team_stats.rushing_yards = team.RushingYards;
    team_stats.penalty_yards = team.PenaltyYards;
    team_stats.sacks = team.Sacks;
    
    await Stat.create(team_stats);

    const teamStats = team_stats;
    // Returns a Team Statistics
    return res.status(201).send({teamStats});
}

exports.client = client;
exports.getStatsByTeamID = getStatsByTeamID;
exports.getStatsByTeamIDStandings = getStatsByTeamIDStandings;
exports.getStatsByTeamIDTeamSeasonStats = getStatsByTeamIDTeamSeasonStats;