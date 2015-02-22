var fs = require('fs');
var twitterAPI = require('node-twitter-api');

// creating a new instance of client using BOT's twitter account  
//Inputs: 
var client = new twitterAPI({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET
});

/*POSTING DATA TO STATUSES/UPDATE 
twitter.[namespace]([type], 
                    [params],
                    [accessToken],
                    [acesssTokenSecret],
                    [callback]);

params#1 -  Media Key: An array with the path to the image file 
params#2 - Status Key: status to update on Twitter 
accessToken/accessTokenSecret: provided by Twitter API 
callback -  
        on error: responds back with error message  
      on success: responds back with success message*/ 
client.statuses("update_with_media", {
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
