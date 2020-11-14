const mongoose = require('mongoose');

const { Schema } = mongoose;

const betSchema = new Schema({
  user_id: String,
  game_id: String,
  team_id: String,
  amount: Number,
}, { timestamps: true });

mongoose.model('bets', betSchema);
