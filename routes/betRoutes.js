const mongoose = require('mongoose');
const User = mongoose.model('users')
const Bet = mongoose.model('bets');
const Game = mongoose.model('games');

module.exports = (app) => {
  // Get every single bet
  app.get('/api/get_bets', async (req, res) => {
    const bets = await Bet.find();
    return res.status(200).send(bets);
  });

  // Get bets by User ID
  app.get('/api/bets/users/:user_id', async (req, res) => {
    const { user_id } = req.params;

    const bets = await Bet.find({user_id: user_id});

    return res.status(200).send({
      error: false,
      bets,
    });
  });

  // Get bets by Game ID
  app.get('/api/bets/games/:game_id', async (req, res) => {
    const { game_id } = req.params;

    const bets = await Bet.find({game_id: game_id});

    return res.status(202).send({
      error: false,
      bets,
    });
  });

  // Create
  // TODO check bet amount if it's more than their current balance
  app.post('/api/make_bet', async (req, res) => {
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
  });
  /*
  // Update Amount as long as the Updated Amount is greater than the previous Amount
  app.put('/api/bets/:id', async (req, res) => {
    let bet = await Bet.findById(req.params.id);
    const user = await User.findById(req.body.user_id);
    if(req.body.updatedAmount > bet.amount){
      await Bet.findByIdAndUpdate(req.params.id,{
        amount: req.body.updatedAmount
      });
      await User.findByIdAndUpdate(req.body.user_id, {
        shreddit_balance: user.shreddit_balance - (req.body.updatedAmount - bet.amount)
      });
      updatedBet = await Bet.findById(req.params.id);
      return res.status(202).send({
        error: false,
        updatedBet,
      });
    }else{
      return res.status(202).send({
        error: true,
        msg: "Could not update because the updated amount is the less than or equal to the current amount",
      });
    }
  });
  */
};