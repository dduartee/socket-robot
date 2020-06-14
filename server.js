var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {pingInterval:500});
var rpio = require('rpio');
var contador = 0;


//abre pinos
rpio.open(40, rpio.OUTPUT, rpio.LOW);
rpio.open(38, rpio.OUTPUT, rpio.LOW);
rpio.open(37, rpio.OUTPUT, rpio.LOW);
rpio.open(36, rpio.OUTPUT, rpio.LOW);
rpio.open(35, rpio.OUTPUT, rpio.LOW);


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  app.use(express.static(path.join(__dirname, 'public')));
});

io.on('connection', function (socket) {
    contador++;//adiciona usuarios
    console.log(contador);
    socket.emit('contador', contador);
    socket.broadcast.emit('contador', contador);
  
  socket.on('move', function (msg) {
    switch (msg) {
      case 'esquerda':
        rpio.write(40, rpio.HIGH);//s1
        rpio.write(38, rpio.LOW);//s2
        rpio.write(37, rpio.HIGH);//s3
        rpio.write(36, rpio.LOW);//s4
        io.emit('move', 'Girando para a esquerda');
        console.log("Girando para a esquerda");
        break;
      case 'direita':
        rpio.write(40, rpio.LOW);//s1
        rpio.write(38, rpio.HIGH);//s2
        rpio.write(37, rpio.LOW);//s3
        rpio.write(36, rpio.HIGH);//s4
        io.emit('move', 'Girando para a direita');
        console.log("Girando para a direita");

        break;
      case 're':
        rpio.write(40, rpio.LOW);//s1
        rpio.write(38, rpio.HIGH);//s2
        rpio.write(37, rpio.HIGH);//s3
        rpio.write(36, rpio.LOW);//s4
        io.emit('move', 'Andando para trás');
        console.log("Andando para trás");
        break;
      case 'frente':
        rpio.write(40, rpio.HIGH);//s1
        rpio.write(38, rpio.LOW);//s2
        rpio.write(37, rpio.LOW);//s3
        rpio.write(36, rpio.HIGH);//s4
        io.emit('move', 'Andando para frente');
        console.log("Andando para frente");
        break;
      case 'panico':
        rpio.write(40, rpio.LOW);//s1
        rpio.write(38, rpio.LOW);//s2
        rpio.write(37, rpio.LOW);//s3
        rpio.write(36, rpio.LOW);//s4
        io.emit('move', 'Parando');
        console.log("[+] Parando");
        break;
      case 'lpd':
        rpio.write(35, rpio.LOW);//s1
        io.emit('move', 'Desligando luz');
        console.log("Desligando luz");
        break;
      case 'lpl':
        rpio.write(35, rpio.HIGH);//s4
        io.emit('move', 'Ligando luz');
        console.log("Ligando luz");
        break;
      default:
        io.emit('move', 'erro no socket...');
        console.log('error!');
        break;
    }
    
  });

  socket.on('disconnect', function() {
    contador--;//diminui usuarios
    //console.log(contador);
    socket.emit('contador', contador);
    socket.broadcast.emit('contador', contador);
  });
});

http.listen(3001, function () {
  console.log('Rodando em localhost:3001');
});
