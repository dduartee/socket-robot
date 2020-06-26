const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  pingInterval: 500
});
var contador = 0;

const rpio = require('rpio');


//abre reles
rpio.open(40, rpio.OUTPUT, rpio.LOW);
rpio.open(38, rpio.OUTPUT, rpio.LOW);
rpio.open(37, rpio.OUTPUT, rpio.LOW);
rpio.open(36, rpio.OUTPUT, rpio.LOW);
rpio.open(35, rpio.OUTPUT, rpio.LOW);


app.get('/', function (req, res) { //inicialização da pagina
  res.sendFile(__dirname + '/public/index.html');
  app.use(express.static(path.join(__dirname, 'public')));
});

io.on('connection', function (socket) {
  contador++; //aumenta contador de usuarios
  console.log('[+] ' + socket.id + ' entrou');
  io.emit('contador', contador);

  //FUNÇÕES PARA OS EVENTOS
  function frente() { //FUNÇÃO FRENTE
    rpio.write(40, rpio.HIGH); //s1
    rpio.write(38, rpio.LOW); //s2
    rpio.write(37, rpio.LOW); //s3
    rpio.write(36, rpio.HIGH); //s4
    return ('Andando para frente');
  }

  function re() { //FUNÇÃO RE
    rpio.write(40, rpio.LOW); //s1
    rpio.write(38, rpio.HIGH); //s2
    rpio.write(37, rpio.HIGH); //s3
    rpio.write(36, rpio.LOW); //s4
    return ('Andando para trás');
  }

  function esquerda() { //FUNÇÃO ESQUERDA
    rpio.write(40, rpio.HIGH); //s1
    rpio.write(38, rpio.LOW); //s2
    rpio.write(37, rpio.HIGH); //s3
    rpio.write(36, rpio.LOW); //s4
    return ('Girando para a esquerda');
  }

  function direita() { //FUNÇÃO DIREITA
    rpio.write(40, rpio.LOW); //s1
    rpio.write(38, rpio.HIGH); //s2
    rpio.write(37, rpio.LOW); //s3
    rpio.write(36, rpio.HIGH); //s4
    return ('Girando para a direita');
  }

  function panico() { //FUNÇÃO PANICO
    rpio.write(40, rpio.LOW); //s1
    rpio.write(38, rpio.LOW); //s2
    rpio.write(37, rpio.LOW); //s3
    rpio.write(36, rpio.LOW); //s4
    return ('Parando');
  }

  function lpd() { //FUNÇÃO LPD
    rpio.write(35, rpio.LOW);
    return ('Desligando luz');
  }

  function lpl() { //FUNÇÃO LPL
    rpio.write(35, rpio.HIGH);
    return ('Ligando luz');
  }

  socket.on('move', function (msg) { // evento MOVE
    switch (msg) {
      case 'frente':
        io.emit('move', frente()); // EMITE O RETORNO DA FUNÇÃO
        console.log("[!] Andando para frente");
        break;
      case 're':
        io.emit('move', re());
        console.log("[!] Andando para trás");
        break;
      case 'esquerda':
        io.emit('move', esquerda());
        console.log("[!] Girando para a esquerda");
        break;
      case 'direita':
        io.emit('move', direita());
        console.log("[!] Girando para a direita");
        break;
      case 'panico':
        io.emit('move', panico());
        console.log("[!] Parando");
        break;
      default:
        panico();
        socket.emit('move', 'erro no socket'); //socket.emit para somente o socket que enviou
        console.log('[X] erro no socket, parando comandos MOVE');
        break;
    }
  });

  socket.on('luz', function (estado) { //evento luz
    if (estado === 'lpl') {
      io.emit('luz', lpl());
      console.log('[!] Ligando luz');
    }
    else if (estado === 'lpd') {
      io.emit('luz', lpd());
      console.log('[!] Desligando luz');
    }
    else {
      rpio.write(35, rpio.LOW);
      socket.emit('luz', 'erro no socket'); //socket.emit para somente o socket que enviou
      console.log('[X] erro no socket LUZ');
    }
  });

  socket.on('disconnect', function () {
    contador--; //diminui contador de usuarios
    console.log('[-] ' + socket.id + ' saiu');
    io.emit('contador', contador);
  });
});

http.listen(3001, function () { //inicia servidor na porta 3001
  console.log('Rodando em localhost:3001');
});
