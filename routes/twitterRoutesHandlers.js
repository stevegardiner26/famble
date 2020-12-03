

// app.get('/api/twitter/:search_term', getTweet) 
async function getTweet(req, res){
    let { search_term } = req.params;
    let tweet = search_term;
    return res.status(200).send(tweet);
}

exports.getTweet = getTweet;