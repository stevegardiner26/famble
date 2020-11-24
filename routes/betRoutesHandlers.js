const mongoose = require('mongoose');
const User = mongoose.model('users');
const Bet = mongoose.model('bets');
const Game = mongoose.model('games');

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
    const bets = await Bet.find({game_id: game_id});
    return res.status(202).send({
        error: false,
        bets,
    });
}

// app.post('/api/bets', postBets);
async function postBets(req, res){
  const { game_id } = req.body;
  const bets = await Bet.find({game_id:game_id});  
  const user = await User.findById(req.body.user_id);
  for (i = 0; i < bets.length; i++){
    if(bets[i].user_id === req.body.user_id){
      if(req.body.amount > bets[i].amount){
        await Bet.findByIdAndUpdate(bets[i]._id,{
          amount: req.body.amount
        });
        await User.findByIdAndUpdate(req.body.user_id, {
          shreddit_balance: user.shreddit_balance - (req.body.amount - bets[i].amount)
        });
        updatedBet = await Bet.findById(req.params.id);
        return res.status(202).send({
          error: false,
          updatedBet,
        });
      } else{
        return res.status(500).send({
          error: true,
          msg: "Could not update because the updated amount is less than or equal to the current amount",
        });
      }
    }
  }
  const bet = await Bet.create(req.body);
  await User.findByIdAndUpdate(req.body.user_id, {
      shreddit_balance: user.shreddit_balance - req.body.amount
  });
  return res.status(201).send({
    error: false,
    bet,
  });
};
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
exports.putBets = putBets;
exports.deleteBets = deleteBets;
exports.getBetsByUserID = getBetsByUserID;