var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env['TWITTER_API_KEY'],
    consumer_secret: process.env['TWITTER_API_SECRET'],
    access_token_key: process.env['TWITTER_ACCESS_TOKEN'],
    access_token_secret: process.env['TWITTER_ACCESS_TOKEN_SECRET'],
});

// app.get('/api/twitter/:search_term', getTweet) 
async function getTweet(req, res){
    let { search_term } = req.params;
    client.get('search/tweets', {q: search_term}, function(error, tweets) {
        return res.status(200).send({tweet: tweets.statuses[0]}); 
    });
}

exports.getTweet = getTweet;