const mongoose = require('mongoose');

const { Schema } = mongoose;

const betSchema = new Schema({
  user_id: String,
  game_id: String,
  team_id: Number,
  name: String,
  teamName: String,
  amount: Number,
  active: {type: Boolean, default: true},
  type: String, // Ideally this value is either "default" or "bot"
}, { timestamps: true });

mongoose.model('bets', betSchema);
exports.betModel = mongoose.model('bets', betSchema);