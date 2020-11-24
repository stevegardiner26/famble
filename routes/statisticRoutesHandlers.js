const Client = require('node-rest-client').Client;
const mongoose = require('mongoose');
const Stat = mongoose.model('stats');
const Team = mongoose.model('teams');
const client = new Client();

// app.get('/api/stats/teams/:team_id')
async function fetchTeamStats(req, res){
    client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (year, response) {
        client.get(`https://api.sportsdata.io/v3/nfl/scores/json/TeamSeasonStats/${year}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (data, response) {
            data.forEach(async (stat) => {
                let current_team = await Team.findOne({team_id: stat.Team});
                if(!current_team){
                    let statistics = {
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