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

// app.get('/api/stats/teams/fetch_stats', fetchStats)
async function fetchTeamStats(req, res){
    client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (year, response) {
        client.get(`https://api.sportsdata.io/v3/nfl/scores/json/TeamSeasonStats/${year}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (data, response) {
            data.forEach(async (stat) => {
                let current_team = await Team.findOne({team_id: stat.Team});
                if(!current_team){
                    let statistics = {
                        team_id: stat.Team,
                        touchdowns: stat.Touchdowns,
                        passing_attempts: stat.PassingAttempts,
                        completion_percentage: stat.CompletionPercentage,
                        passing_yards: stat.PassingYards,
                        fumbles_forced: stat.FumblesForced,
                        rushing_yards: stat.RushingYards,
                        penalty_yards: stat.PenaltyYards,
                        sacks: stat.Sacks,
                    };
                    await Stat.create(statistics);
                }
            });
            return res.status(201).send({
                message: "Imported All Team Stats!",
            });
        });
    });
}
exports.client = client;
exports.fetchTeamStats = fetchTeamStats;
exports.getStatsByTeamID = getStatsByTeamID;