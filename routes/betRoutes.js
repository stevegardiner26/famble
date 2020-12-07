const {
  getBets,
  getBetsByGameID,
  postBets,
  getBetsByUserID,
  deleteBets,
  getRegBets,
  getBetByUserGameType
} = require('./betRoutesHandlers');

module.exports = (app) => {
  // Get
  app.get('/api/get_bets', getBets);
  app.get('/api/bets/users/:user_id', getBetsByUserID);
  app.get('/api/bets/:game_id', getBetsByGameID);
  app.get('/api/bets/getRegBets/:game_id', getRegBets);
  app.get('/api/bets/:user_id/:game_id/:type', getBetByUserGameType);
  // Create
  app.post('/api/bets', postBets);

  // Delete
  app.delete('/api/bets/:id', deleteBets);
};
