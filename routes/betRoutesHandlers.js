const mongoose = require('mongoose');
const User = mongoose.model('users');
const Bet = mongoose.model('bets');
const Team = mongoose.model('teams');
const Game = mongoose.model('games');
const helpers = {
  postBetsHelper
}

// app.get('/api/get_bets', getBets);
async function getBets(req, res){
    const bets = await Bet.find();
    return res.status(200).send(bets);
}

// app.get('/api/bets/users/:user_id', getBetsByUserID) 
async function getBetsByUserID(req, res){
    const { user_id } = req.params;
    const bets = await Bet.find({user_id: user_id});
    return res.status(200).send({
      error: false,
      bets,
    });
}

// app.get('/api/bets/:game_id', getBetsByGameID);
async function getBetsByGameID(req, res){
    const { game_id } = req.params;
    console.log(game_id)
    const bets = await Bet.find();
    console.log(bets);
    return res.status(202).send({
        error: false,
        bets,
    });
}

// app.post('/api/bets', postBets);
async function postBets(req, res){
  const { game_id } = req.body;
  const body = req.body;
  const bets = await Bet.find({game_id: game_id});  
  const user = await User.findById(req.body.user_id);
  const response = await helpers.postBetsHelper(body,bets,user);

  if (response){
    return res.status(response.status).send(response.data);
  }
  const { team_id } = req.body;
  const team = await Team.find({team_id:team_id});
  const game = await Game.find({game_id: game_id});
  if (new Date(game.start_time) < new Date()) {
    return res.status(500).send({
      error: true,
      message: 'The Game Has Already Started, the Bet Could Not be Placed.'
    });
  }
  req.body.teamName = team[0].name;
  req.body.game_id = game_id;
  const bet = await Bet.create(req.body);
  await User.findByIdAndUpdate(req.body.user_id, {
      shreddit_balance: user.shreddit_balance - req.body.amount
  });
  return res.status(201).send({
    error: false,
    bet,
  });
};

async function postBetsHelper(body, bets, user){
  for (i = 0; i < bets.length; i++){
    if(bets[i].user_id === body.user_id && bets[i].team_id === body.team_id){
      if(body.amount > bets[i].amount){
        await Bet.findByIdAndUpdate(bets[i]._id,{
          amount: body.amount
        });
        await User.findByIdAndUpdate(body.user_id, {
          shreddit_balance: user.shreddit_balance - (body.amount - bets[i].amount)
        });
        return {
          status: 201,
          data: {
            error: false,
          }
        };
        
      } 
      else{
        return {
          status: 500,
          data: {
            error: true,
            msg: "Could not update because the updated amount is less than or equal to the current amount",
          }
        };
      }
    }
    else{
      return {
        status: 500,
        data: {
          error: true,
          msg: "You are trying to change the team you are betting on, you are locked in after placing your bet",
        }
      };
    }
  }
}

// app.delete('/api/bets/:id', deleteBets);
async function deleteBets(req, res){
    const { id } = req.params;
    const bet = await Bet.findByIdAndDelete(id);
    return res.status(202).send({
        error: false,
        bet,
    });
}
  
exports.getBets = getBets;
exports.getBetsByGameID = getBetsByGameID;
exports.postBets = postBets;
exports.postBetsHelper = postBetsHelper;
exports.helpers = helpers;
exports.deleteBets = deleteBets;
exports.getBetsByUserID = getBetsByUserID;