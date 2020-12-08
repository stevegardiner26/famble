const {
  getUserById,
  createUser,
  getUsers,
  dailyFunding
} = require('./userRoutesHandlers');

module.exports = (app) => {
  // Get
  app.get(`/api/users/:id`, getUserById);
  app.get(`/api/users/rank/:id`, getUsers);

  app.put(`/api/users/:id/daily_fund`, dailyFunding);

  // Create
  app.post(`/api/users`, createUser);
}
