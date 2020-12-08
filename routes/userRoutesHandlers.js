
const mongoose = require('mongoose');
const User = mongoose.model('users');

// app.get(`/api/users/:id`, getUserById)
async function getUserById(req, res){
  const {id} = req.params;
  let user = await User.findById(id);
  return res.status(200).send(user);
}

async function dailyFunding(req, res) {
  const {id} = req.params;
  let user = await User.findById(id);
  let new_amount = user.amount;

  if ((new Date(new Date(user.last_funding).getTime() + 60 * 60 * 24 * 1000)) < new Date()) {
    new_amount += 500;
    let payload = {
      amount: new_amount,
      last_funding: new Date()
    };
    await User.update(payload);
    return res.status(200).send({message: "Added Moneyz!"});
  } else {
    return res.status(500).send({message: "Not Time Yet!"});
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
