  // using express to handle routing
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var twitter = require('./lib/twitter-api.js');
var io = require('socket.io').listen(3001);

var IMAGE_FILE_PATH = './views/image_stream.jpg'
  
var app = express();
var server = require('http').Server(app);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'stream')));
app.use(express.static(path.join(__dirname,'bower_components')));
 
app.listen(app.get('port'));

var sockets = {};
var proc;


io.on('live-stream', function (data) {
  console.log(data);
});

io.on('connection', function(socket) {
  sockets[socket.id] = socket;
  console.log(socket.id, "connected");

  io.on('disconnect', function() {
    // remove this socket object from current on-line list
    console.log("disconnected", socket.id);
    delete sockets[socket.id];
    //no more sockets, death to the stream!(power saving)
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile(IMAGE_FILE_PATH);
    }
  });

  io.on('start-stream', function() {
    startStreaming(io);
  });

  io.on('take-picture',function() {
    fs.open(IMAGE_FILE_PATH, 'r', function(err,reader){
      fs.open("./views/image_capture.jpg",'w+',function(err,writer){
        console.log(err)
        fs.write(writer, reader.toBuffer, function(err,fd){
          console.log('matt: ', err)
        });
      });
    });
  });
});

//if capturing already happening,will not re-init.Emits the last saved image
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile(IMAGE_FILE_PATH);
  }
}
 //if capturing not started, start a new child process and then spawn it.Registers a watch on the changing file. Whenever the file changes we emit a URL to all connected clients.
function startStreaming(io) {
 //_t param to avoid caching on the image
  if (app.get('watchingFile')) {
    io.sockets.emit('live-stream', 'image_stream.jpg?_t=' + (Date.now()));
    return;
  }

  var args = ["-w", "640", "-h", "480", "-o", IMAGE_FILE_PATH, "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args);
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true);
 
  fs.watchFile(IMAGE_FILE_PATH, function(current, previous) {
    io.sockets.emit('live-stream', 'image_stream.jpg?_t=' + (Date.now()));
  })
};


 

