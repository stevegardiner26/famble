const Client = require('node-rest-client').Client;
const mongoose = require('mongoose');
const client = new Client();

// app.get('/api/stats/teams/:team_id')
async function fetchTeamStats(req, res){
    let team_stats = {
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
    await client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, async function(year, response){
        await client.get(`https://api.sportsdata.io/v3/nfl/scores/json/Standings/${year}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function(data, response){
            data = data.find(x => x.Team === req.params.team_id);
            team_stats.wins = data.Wins;
            team_stats.losses = data.Losses;
        });  
        await client.get(`https://api.sportsdata.io/v3/nfl/scores/json/TeamSeasonStats/${year}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function(data, response){
            data = data.find(x => x.Team === req.params.team_id);
            team_stats.touchdowns = data.Touchdowns,
            team_stats.passing_attempts = data.PassingAttempts,
            team_stats.completion_percentage = data.CompletionPercentage
            team_stats.passing_yards = data.PassingYards
            team_stats.fumbles_forced = data.FumblesForced
            team_stats.rushing_yards = data.RushingYards
            team_stats.penalty_yards = data.PenaltyYards
            team_stats.sacks = data.Sacks

            // Returns a Team Statistic's
            return res.status(201).send({
                team_stats,
            });
        }); 
    });
}

exports.client = client;
exports.fetchTeamStats = fetchTeamStats;