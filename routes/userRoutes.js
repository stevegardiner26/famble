const { 
  getUserById,
  createUser,
  getUsers
} = require('./userRoutesHandlers');

module.exports = (app) => {
  // Get  
  app.get(`/api/users/:id`, getUserById);
  app.get(`/api/users`, getUsers);

  // Create
  app.post(`/api/users`, createUser); 
}