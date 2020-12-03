const { 
    getTweet,
  } = require('./twitterRoutesHandlers');
  
  module.exports = (app) => {
    // Get  
    app.get(`/api/twitter/:search_term`, getTweet);
  }