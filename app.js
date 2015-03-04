// using express to handle routing
var express = require('express');
var app = express();
var twitterAPI = require('node-twitter-api');
var imageFile = './stream/image_stream.jpg'
// creating a new instance of client using BOT's twitter account  
//Inputs: 
var client = new twitterAPI({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET
});
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require(__dirname + '/../routes/index');
// http server for loading html pages
var http = require('http').Server(app);
// socket.io for handling websockets
var io = require('socket.io')(http)
var path = require('path');
//file share
var fs = require('fs');
//cache spawn method
var spawn = require('child_process').spawn;
//global proc var to store the spawned process
var proc;

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
// client.statuses("update_with_media", {
//          media: ['./images/google.png'],
//         status: "my picture stream"
//     },
//     process.env.TWITTER_ACCESS_TOKEN_KEY,
//     process.env.TWITTER_ACCESS_TOKEN_SECRET,
//     function(err, data, response) {
//         if (err) {
//           console.log('error in status update', err);
//         } else {
//           console.log('Your status has been updated!', response);
//         }
// });
// view engine setup
//set to run on port 3000
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// app.use('/', routes);

// make stream folder act like static folder
// app.use('/', express.
  // static(path.join(__dirname, 'stream')));
// default route for index
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
//global object to store all connected sockets
var sockets = {};

// event handler for when a client connects 
io.on('connection', function(socket) {
  sockets[socket.id] = socket;
  console.log(socket.id, "connected");

  socket.on('disconnect', function() {
    // remove this socket object from current on-line list
    console.log("disconnected", socket.id);
    delete sockets[socket.id];
    //no more sockets, death to the stream!(power saving)
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile(imageFile);
    }
  });

  socket.on('start-stream', function() {
    startStreaming(io);
  });

  socket.on('take-picture',function() {
    fs.open(imageFile, 'r', function(err,reader){
      fs.open("./stream/image_capture.jpg",'w+',function(err,writer){
        console.log(err)
        fs.write(writer, reader.toBuffer, function(err,fd){
          console.log('matt: ', err)
        });
      });
    });
  });
});

app.listen(app.get('port'));
module.exports = app;

//if capturing already happening,will not re-init.Emits the last saved image
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile(imageFile);
  }
}
 //if capturing not started, start a new child process and then spawn it.Registers a watch on the changing file. Whenever the file changes we emit a URL to all connected clients.
function startStreaming(io) {
 //_t param to avoid caching on the image
  if (app.get('watchingFile')) {
    io.sockets.emit('live-stream', 'image_stream.jpg?_t=' + (Date.now()));
    return;
  }
 
  var args = ["-w", "640", "-h", "480", "-o", imageFile, "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args);
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true);
 
  fs.watchFile(imageFile, function(current, previous) {
    io.sockets.emit('live-stream', 'image_stream.jpg?_t=' + (Date.now()));
  })
 
}
  