const { 
    getStatsByTeamId
  } = require('./statisticRoutesHandlers');
  
  module.exports = (app) => {
    // Get
    app.get('/api/bets/teams/:team_id', getStatsbyTeamId);
    
  };
  