const { 
    fetchTeamStats,
    getStatsByTeamId
  } = require('./statisticRoutesHandlers');
  
  module.exports = (app) => {
    // Get
    app.get('/api/stats/teams/fetch_stats', fetchTeamStats);
    app.get('/api/bets/teams/:team_id', getStatsbyTeamId);
    
  };
  