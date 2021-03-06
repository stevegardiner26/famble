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
  const curr = new Date;
  curr.setUTCHours(0,0,0,0);
  const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  const lastday = new Date(curr.setDate(firstday.getDate() + 10))
  const games = await Game.find({$and: [
    {start_time:{$gte: firstday, $lt: lastday}},
    {status: {$in: ['Scheduled', 'InProgress']}}
  ]}).sort({start_time: 1});
  return res.status(200).send(games);
}

// app.get('/api/games/odds/:id', fetchOddsByGame);
async function fetchOddsByGame(req, res) {
  const id = parseInt(req.params.id, 10);
  var game = await Game.findOne({ game_id: id });

  if (!game.home_odds || !game.away_odds) {
    client.get(`https://api.sportsdata.io/v3/nfl/odds/json/GameOddsLineMovement/${game.score_id}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, async function (data) {
      fetchOddsByGameHelper(data, res, id);
    });
  }
  else {
    return res.status(200).send({
      error: false,
      away_odds: game.away_odds,
      home_odds: game.home_odds,
    })
  }
}

async function fetchOddsByGameHelper(data, res, id){
  if(data[0].PregameOdds.length > 0) {
    let away_odds = null; 
    let home_odds = null; 

    let index = 0;
    do{
      away_odds = data[0].PregameOdds[index].AwayMoneyLine;
      home_odds = data[0].PregameOdds[index].HomeMoneyLine;
      index++;
    } while (away_odds == null && home_odds == null)

    let payload = {
      away_odds: away_odds,
      home_odds: home_odds,
    }

    await Game.findOneAndUpdate({game_id: id}, {$set: payload}, {useFindAndModify: false});
    return res.status(200).send({
      error: false,
      away_odds: away_odds,
      home_odds: home_odds,
    })
  }
  else{
    return res.status(200).send({
    error: true
    })
  }
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
  client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (year) {
    client.get("https://api.sportsdata.io/v3/nfl/scores/json/CurrentWeek", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (week) {
      client.get(`https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/${year}/${week}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (week) {
        fetchWeeklyScoresHelper(week, res);
      });
    });
  });
}

function fetchWeeklyScoresHelper(week, res) {
  week.forEach(async (game) => {
    let winner_id = null;
    if (game.Status == "Final") {

      let gameDB = Game.findOne({game_id: game.GlobalGameID});
      let chosen_odds;

      if (game.AwayScore > game.HomeScore) {
        winner_id = game.GlobalAwayTeamID;
        chosen_odds = gameDB.away_odds;
      }
      else {
        winner_id = game.GlobalHomeTeamID;
        chosen_odds = gameDB.home_odds;
      }

      let bets = Bet.find({game_id: game.GlobalGameID});
      if (bets.length > 1) {
        let d_bets = bets.filter((bet) => bet.type === "default");
        let total_winner_bets = 0, total_loser_bets = 0;
        d_bets.forEach((dbet) => {
          if (dbet.team_id == winner_id) {
            total_winner_bets += dbet.amount;
          } else {
            total_loser_bets += dbet.amount;
          }
        });
        bets.forEach((b) => {
          const user = User.findById(b.user_id);
          if (b.team_id == winner_id) {
            if (b.type == "default") {
              let winnings;
              if (b.amount === total_winner_bets) {
                winnings = b.amount;
              } else {
                let percentage_of_winnings = b.amount / total_winner_bets;
                winnings = Math.round((total_loser_bets * percentage_of_winnings) + b.amount);
              }
              User.findByIdAndUpdate(b.user_id, {
                  shreddit_balance: (user.shreddit_balance + winnings)
              });
            }
            else if (b.type == "bot") {
              let winnings;
              if (chosen_odds < 0) {
                winnings = b.amount * ((chosen_odds * -1) / 100);
              }
              else {
                winnings = b.amount * (chosen_odds / 100) + b.amount;
              }
              User.findByIdAndUpdate(b.user_id, {
                shreddit_balance: (user.shreddit_balance + winnings)
              });
            }
          }
          Bet.findByIdAndUpdate(b.id, {active: false});
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
  client.get("https://api.sportsdata.io/v3/nfl/scores/json/UpcomingSeason", {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (year) {
    client.get(`https://api.sportsdata.io/v3/nfl/scores/json/Schedules/${year}`, {headers: {"Ocp-Apim-Subscription-Key": process.env['NFL_API_TOKEN']}}, function (data) {
      fetchGamesHelper(data, res);
    });
  });
}

function fetchGamesHelper(data, res) {
  data.forEach(async (game) => {
    let current_game = await Game.findOne({game_id: game.GlobalGameID});
    let date = game.Date;
    if(date){
      date += '-05:00';
    }
    if (!current_game) {
      let payload = {
        game_id: game.GlobalGameID,
        sport_type: "NFL",
        start_time: date,
        away_team_id: game.GlobalAwayTeamID,
        home_team_id: game.GlobalHomeTeamID,
        canceled: game.Canceled,
        status: game.Status,
        score_id: game.ScoreID,
      };
      await Game.create(payload);
    }
    else {
      let payload = {
        start_time: date,
        canceled: game.Canceled,
        status: game.Status,
        score_id: game.ScoreID,
      };
      await Game.findOneAndUpdate({game_id: game.GlobalGameID}, payload, {useFindAndModify: false});
    }
  });
  return res.status(201).send({message: "Imported All Games!"});
}

// app.put('/api/games/:id', updateGameById)
async function updateGameById(req, res){
  const { id } = req.params;

  const game = await Game.findOneAndUpdate({game_id: id}, req.body);

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
exports.fetchGamesHelper = fetchGamesHelper;
exports.updateGameById = updateGameById;
exports.deleteGameById = deleteGameById;
exports.vars = vars;
exports.fetchOddsByGame = fetchOddsByGame;
exports.fetchOddsByGameHelper = fetchOddsByGameHelper;
