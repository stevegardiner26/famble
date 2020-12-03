
const mongoose = require('mongoose');
const User = mongoose.model('users');

// app.get(`/api/users/:id`, getUserById)
async function getUserById(req, res){
  const {id} = req.params;
  let user = await User.findById(id);
  return res.status(200).send(user);
}

// app.get(`/api/users`, getUsers);
async function getUsers(req, res){
  let users = await User.find().sort({shreddit_balance: -1});
  return res.status(200).send(users);
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