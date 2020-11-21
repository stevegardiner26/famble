var Client = require('node-rest-client').Client;
const mongoose = require('mongoose');
const Game = mongoose.model('games');

var client = new Client();

module.exports = (app) => {
  // Get
  app.get('/api/games', async (req, res) => {
    const games = await Game.find();
    
    return res.status(200).send(games);
  });

  app.get('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const game = await Game.findOne({ game_id: id })
    return res.status(200).send(game);
  });

  var date_cache = null;
  app.get('/api/fetch_weekly_scores', async (req, res) => {
    // Check and only allow this to execute the api call if it is 10 minutes past the last time it was called:
    let current_date = new Date();
    if (date_cache != null) {
      let date_cache_dif = new Date(date_cache.getTime() + 10*60000);
      if (date_cache_dif > current_date) {
        return res.status(200).send({message: "Waiting to update week...", expire_time: date_cache_dif});
      }
    }
    client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (year, response) {
      client.get("https://api.sportsdata.io/v3/nfl/scores/json/CurrentWeek", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (week, response) {
        client.get(`https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/${year}/${week}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (week, response) {
          week.forEach(async (game) => {
            let winner_id = null;
            if (game.status == "Final") {          
              if (game.away_score > game.home_score) {
                winner_id = game.GlobalAwayTeamID;
              } else {
                winner_id = game.GlobalHomeTeamID;
              }

              let bets = Bet.find({game_id: game.GlobalGameID});
              if (bets.length > 1) {
                bets.forEach(async (b) => {
                  if (b.team_id == winner_id) {
                    const user = await User.findById(b.user_id);
                    await User.findByIdAndUpdate(b.user_id, {
                        shreddit_balance: (user.shreddit_balance + (2 * b.amount))
                    });
                  }
                  await Bet.findByIdAndDelete(b.id);          
                });
              }
            }
            let payload = {
              canceled: game.Canceled,
              status: game.Status,
              away_score: game.AwayScore,
              home_score: game.HomeScore,
              winner: winner_id,
              in_progress: game.IsInProgress,
              end_time: game.GameEndDateTime
            };
            await Game.findOneAndUpdate({game_id: game.GlobalGameID}, payload, {useFindAndModify: false});
          });
          date_cache = new Date();
          return res.status(200).send({message: "Updated This Weeks Games!"});
        });
      });
    });
  });

  // Fetch Games From API
  // Ideally this is hit once a season to get the schedule
  app.get('/api/fetch_games', async (req, res) => {
    // Remove all games to prepare for the new game date

    client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (year, response) {
      client.get(`https://api.sportsdata.io/v3/nfl/scores/json/Schedules/${year}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (data, response) {
        // parsed response body as js object
        data.forEach(async (game) => {
          let current_game = await Game.findOne({game_id: game.GlobalGameID});
          if (!current_game) {
            let payload = {
              game_id: game.GlobalGameID,
              sport_type: "NFL",
              start_time: game.Date,
              away_team_id: game.GlobalAwayTeamID,
              home_team_id: game.GlobalHomeTeamID,
              canceled: game.Canceled,
              status: game.Status,
              score_id: game.ScoreID,
            };
            await Game.create(payload);
          } else {
            let payload = {
              start_time: game.Date,
              canceled: game.Canceled,
              status: game.Status,
              score_id: game.ScoreID,
            };
            await Game.findOneAndUpdate({game_id: game.GlobalGameID}, payload, {useFindAndModify: false});
          }
        });
      });
      return res.status(201).send({message: "Imported All Games!"});
    });
  });

  // Get Odds for Game
  app.get('/api/games/odds/:id', async (req, res) => {
    const { id } = req.params;
    var game = await Game.findOne({ game_id: id });
    
    if (!game.home_odds || !game.away_odds) {
      await client.get(`https://api.sportsdata.io/v3/nfl/odds/json/GameOddsLineMovement/${game.score_id}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, async function (data, response) {
        var away_odds = data[0].PregameOdds[0].AwayMoneyLine;
        var home_odds = data[0].PregameOdds[0].HomeMoneyLine;

        var index = 1;
        while (away_odds == null && home_odds == null) {
          away_odds = data[0].PregameOdds[index].AwayMoneyLine;
          home_odds = data[0].PregameOdds[index].HomeMoneyLine;
          index++;
        }

        let payload = {
          away_odds: away_odds,
          home_odds: home_odds,
        }
          
        await Game.findOneAndUpdate({game_id: id}, payload, {useFindAndModify: false});
        return res.status(200).send({
          error: false,
          away_team_odds: away_odds,
          home_team_odds: home_odds,
        })
      });
    } else {
      return res.status(200).send({
        error: false,
        away_team_odds: game.away_odds,
        home_team_odds: game.home_odds,
      })
    }
  });

  // Update
  app.put('/api/games/:id', async (req, res) => {
    const { id } = req.params;

    const game = await Game.findByIdAndUpdate(id, req.body);

    return res.status(202).send({
      error: false, 
      game,
    });
  });

  // Delete
  app.delete('/api/games/:id', async (req, res) => {
    const { id } = req.params;

    const game = await Game.findByIdAndDelete(id);

    return res.status(202).send({
      error: false,
      game,
    });
  });
};
