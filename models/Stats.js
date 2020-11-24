const mongoose = require('mongoose');

const { Schema } = mongoose;

const statsSchema = new Schema({
    team_id: String,
    wins: Number,
    losses: Number,
    touchdowns: Number,
    passing_attempts: Number,
    completion_percentage: Number,
    passing_yards: Number,
    fumbles_forced: Number,
    rushing_yards: Number,
    penalty_yards: Number,
    sacks: Number,
}, { timestamps: true });

mongoose.model('stats', statsSchema);
exports.statsModel = mongoose.model('stats', statsSchema);
exports.registerStatsModel = function() {
    try {
      mongoose.model('stats', statsSchema);
    } catch (error) {
      // console.log(error)
    }
}