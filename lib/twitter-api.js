var twitterAPI = require('node-twitter-api');

var client = new twitterAPI({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET
});

exports.PostWithMedia = function(path, Message){
  client.statuses("update_with_media", {
      media: [path],
      status: Message
    },
  process.env.TWITTER_ACCESS_TOKEN_KEY,
  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  function(err, data, response) {
    if (err) {
      console.log(process.env.TWITTER_CONSUMER_KEY);
      console.log('error in status update', err);
    } else {
      console.log('Your status has been updated!');
    }
  });
}