const mongoose = require('mongoose');
const {Schema} = mongoose;

const statSchema = new Schema({
    team_id: {type: Number, unique: true},
    wins: Number,
    losses: Number,
    touchdowns: Number,
    passing_attempts: Number,
    completion_percentage: Number,
    passing_yards: Number,
    fumbles_forced: Number,
    rushing_yards: Number,
    penalty_yards: Number,
    sacks: Number
}, {timestamps: true})

mongoose.model('stats', statSchema);
exports.statModel = mongoose.model('stats', statSchema);
