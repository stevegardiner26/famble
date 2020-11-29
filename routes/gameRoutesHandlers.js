const Client = require('node-rest-client').Client;
const mongoose = require('mongoose');
const Game = mongoose.model('games');
const Bet = mongoose.model('bets');
const User = mongoose.model('users');
const client = new Client();
let vars = {
  i: 142,
  date_cache: null
}

// app.get('/api/games', getGames) 
async function getGames(req, res){
    const games = await Game.find();
    return res.status(200).send(games);
}

// app.get('/api/games/:id', getGameById)
async function getGameById(req, res){
  const { id } = req.params;
  const game = await Game.findOne({ game_id: id })
  return res.status(200).send(game);
}
// app.get('/api/current_week', getCurrentWeekGames)
async function getCurrentWeekGames(req,res){
  var curr = new Date;
  var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  const games = await Game.find();
  const currentWeekGames = [];
  for (i = vars.i; i < games.length; i++){
    if (((games[i].start_time -firstday)/86400000).toFixed() > 7){
      break;
    }
    if (games[i].start_time >= firstday){
      currentWeekGames.push(games[i]);
    }  
  }
  return res.status(200).send(currentWeekGames);
}

// app.get('/api/fetch_weekly_scores', fetchWeeklyScores) 
async function fetchWeeklyScores(req, res){
  // Check and only allow this to execute the api call if it is 10 minutes past the last time it was called:
  let current_date = new Date();
  if (vars.date_cache != null) {
    let date_cache_dif = new Date(vars.date_cache.getTime() + 10*60000);
    if (date_cache_dif > current_date) {
      return res.status(200).send({message: "Waiting to update week...", expire_time: date_cache_dif});
    }
  }
  client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (year, response) {
    client.get("https://api.sportsdata.io/v3/nfl/scores/json/CurrentWeek", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (week, response) {
      client.get(`https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/${year}/${week}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (week, response) {
        fetchWeeklyScoresHelper(week, res);
      });
    });
  });
}

function fetchWeeklyScoresHelper(week, res) {
  week.forEach(async (game) => {
    let winner_id = null;
    if (game.Status == "Final") {          
      if (game.AwayScore > game.HomeScore) {
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
          await Bet.findByIdAndUpdate(b.id, {active: false});          
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
  vars.date_cache = new Date();
  return res.status(200).send({message: "Updated This Weeks Games!"});
}

// Fetch Games From API
// Ideally this is hit once a season to get the schedule
// app.get('/api/fetch_games', fetchGames)
async function fetchGames(req, res){
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
            status: game.Status
          };
          await Game.create(payload);
        } else {
          let payload = {
            start_time: game.Date,          
            canceled: game.Canceled,
            status: game.Status
          };
          await Game.findOneAndUpdate({game_id: game.GlobalGameID}, payload, {useFindAndModify: false});
        }
      });
    });
    return res.status(201).send({message: "Imported All Games!"});
  });
}

// app.put('/api/games/:id', updateGameById)
async function updateGameById(req, res){
  const { id } = req.params;

  const game = await Game.findByIdAndUpdate(id, req.body);

  return res.status(202).send({
    error: false, 
    game,
  });
}

// app.delete('/api/games/:id', deleteGameById)
async function deleteGameById(req, res){
  const { id } = req.params;
  const game = await Game.findByIdAndDelete(id);
  return res.status(202).send({
    error: false,
    game,
  });
}

exports.client = client;
exports.getGames = getGames;
exports.getGameById = getGameById;
exports.getCurrentWeekGames = getCurrentWeekGames;
exports.fetchWeeklyScores = fetchWeeklyScores;
exports.fetchWeeklyScoresHelper = fetchWeeklyScoresHelper;
exports.fetchGames = fetchGames;
exports.updateGameById = updateGameById;
exports.deleteGameById = deleteGameById;
exports.vars = vars;