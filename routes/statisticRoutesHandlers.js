const Client = require('node-rest-client').Client;
const client = new Client();

// app.get('/api/stats/teams/:team_id')
async function getStatsByTeamID(req, res){
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
    client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, async function(year){
        client.get(`https://api.sportsdata.io/v3/nfl/scores/json/Standings/${year}`, { headers: { "Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN'] } }, function (data) {
            team_stats = getStatsByTeamIDStandings(data, team_stats, req);
        });  
        client.get(`https://api.sportsdata.io/v3/nfl/scores/json/TeamSeasonStats/${year}`, { headers: { "Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN'] } }, function (data) {
            getStatsByTeamIDTeamSeasonStats(data, team_stats, req, res);   
        }); 
    });
}

function getStatsByTeamIDStandings(data, team_stats, req){
    const team = data.find(x => x.TeamID == req.params.team_id);
    team_stats.wins = team.Wins;
    team_stats.losses = team.Losses;
    return team_stats;
}

function getStatsByTeamIDTeamSeasonStats(data, team_stats, req, res){
    const team = data.find(x => x.TeamID == req.params.team_id); 
    team_stats.touchdowns = team.Touchdowns;
    team_stats.passing_attempts = team.PassingAttempts;
    team_stats.completion_percentage = team.CompletionPercentage;
    team_stats.passing_yards = team.PassingYards;
    team_stats.fumbles_forced = team.FumblesForced;
    team_stats.rushing_yards = team.RushingYards;
    team_stats.penalty_yards = team.PenaltyYards;
    team_stats.sacks = team.Sacks;

    // Returns a Team Statistics
    return res.status(201).send({team_stats});
}

exports.client = client;
exports.getStatsByTeamID = getStatsByTeamID;
exports.getStatsByTeamIDStandings = getStatsByTeamIDStandings;
exports.getStatsByTeamIDTeamSeasonStats = getStatsByTeamIDTeamSeasonStats;