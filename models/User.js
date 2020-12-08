const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    profile_image: String,
    auth_type: String,
    google_id: String,
    shreddit_balance: {type: Number, default: 10000},
    last_funding: {type: Date, default: new Date()},
}, {timestamps: true})


mongoose.model('users', userSchema);
exports.userModel = mongoose.model('users', userSchema);
