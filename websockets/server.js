// using express to handle routing
var express = require('express');
var app = express();
var imageFile = './stream/image_stream.jpg'

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

// make stream folder act like static folder
app.use('/', express.static(path.join(__dirname, 'stream')));
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
    // remove this socket object from current online list
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
 //start server
http.listen(3000, function() {
  console.log('listening on *:3000');
});
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
 //_t param to aviod caching on the image
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
  