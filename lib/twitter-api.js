var twitterAPI = require('node-twitter-api');

var client = new twitterAPI({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET
});

exports.PostWithMedia = function(){client.statuses("update_with_media", {
        media: ['./images/google.png'],
        status: "my picture stream"
      },
      process.env.TWITTER_ACCESS_TOKEN_KEY,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
      function(err, data, response) {
          if (err) {
            console.log('error in status update', err);
          } else {
            console.log('Your status has been updated!', response);
          }
  });
}