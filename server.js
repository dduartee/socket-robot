var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
  app.use(express.static(path.join(__dirname, 'public')));
});

io.on('connection', function(socket){
    socket.on('move', function(msg){
        io.emit('move', msg);
        socket.broadcast.emit('move', msg); 
        console.log('move: ' + msg);
    });

});

http.listen(3001, function(){
  console.log('Rodando em localhost:3001');
});