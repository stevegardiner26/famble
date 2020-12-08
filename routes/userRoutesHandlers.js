
const mongoose = require('mongoose');
const User = mongoose.model('users');

// app.get(`/api/users/:id`, getUserById)
async function getUserById(req, res){
  const {id} = req.params;
  let user = await User.findById(id);
  return res.status(200).send(user);
}

// app.put(`/api/users/:id/daily_fund`, dailyFunding);
async function dailyFunding(req, res) {
  const {id} = req.params;
  let user = await User.findById(id);
  let new_amount = user.shreddit_balance;
  const currPlus24 = new Date(new Date(user.last_funding).getTime() + 60 * 60 * 24 * 1000);
  if (currPlus24 < new Date()) {
    new_amount += 500;
    let payload = {
      shreddit_balance: new_amount,
      last_funding: new Date()
    };
    await User.findByIdAndUpdate(user._id, {$set: payload});
    let rtn_user = await User.findById(id);
    return res.status(202).send({message: "Added Moneyz!", user: rtn_user});
  } else {
    return res.status(200).send({message: "Not Time Yet!"});
  }
}

// app.get(`/api/users/rank/:id`, getUsers)
async function getUsers(req, res){
  const {id} = req.params;
  let users = await User.find().sort({shreddit_balance: -1});
  let rank;
  users.forEach((user, index) => {
    if (user.id === id){
      rank = index + 1;
      return res.status(200).send({users, rank});
    }
  });
}

// app.post(`/api/users`, createUser)
async function createUser(req, res){
  let user = await User.findOne({email: req.body.email});
  if (!user) {
    user = await User.create(req.body);
  }
  return res.status(201).send({
    error: false,
    user
  });
}


exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.dailyFunding = dailyFunding;
