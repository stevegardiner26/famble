const mongoose = require('mongoose');
const {Schema} = mongoose;

const teamSchema = new Schema({
    team_id: {type: Number, unique: true},
    name: String,
    key: String,
    conference: String,
    division: String,
    stadium_id: Number,
    image_url:String
}, {timestamps: true})

mongoose.model('teams', teamSchema);
exports.teamModel = mongoose.model('teams', teamSchema);
