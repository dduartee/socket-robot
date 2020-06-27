var socket = io();
var ms = 0;

function mostrarchat() {
    
    x = document.getElementById("mostrarchat");
    if (x.style.display == "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
}
socket.on('contador', function (data) {
    document.getElementById('contador').innerHTML = data;
});

function move(obj) { // funcao com argumento do input
    socket.emit('move', obj.id); // envia informação para o socket
    socket.on('move', function (msg) {
        console.log(msg);
        document.getElementById('move').innerHTML = msg; // retorna valor
    });
}

function luz(obj) {
    socket.emit('luz', obj.id);
    socket.on('luz', function (luz) {
        document.getElementById('luz').innerHTML = luz;
    });
}

$(function () { // chat
    var mensagem = $("#mensagem");
    var user = $("#user");
    var enviar_mensagem = $("#enviar_mensagem");
    var trocar_user = $("#trocar_user");
    var chat = $("#chat");
    var status = $("#status");

    socket.on('pong', function (ms) {
        document.getElementById('latencia').innerHTML = ms;
        status.html(' '); // 1seg
    });

    enviar_mensagem.click(function () {
        socket.emit('enviar_mensagem', { mensagem: mensagem.val() });
        mensagem.val('');
        status.html(' ');
    });
    socket.on("enviar_mensagem", function (data) { // retorno de mensagem
        chat.append("<p class='mensagem'>" + data.user + ": " + data.mensagem + "</p>")
        var elem = document.getElementById('chatroom');
        elem.scrollTop = elem.scrollHeight;
    });

    trocar_user.click(function () {  // trocar de user
        socket.emit('trocar_user', { user: user.val() });
    });
    mensagem.bind("keypress", function () { // escrevendo para o socket
        socket.emit('escrevendo', { mensagem: mensagem.val() });
    });
    socket.on('escrevendo', function (data) { //retorna escrevendo para os outros sockets
        status.html("<p class='status'>" + data.user + " esta escrevendo..." + "</p>")
    });
    socket.on('trocou_user', function (data) { //trocou de user
        chat.append("<p class='mensagem'>" + data.userV + " trocou de nome para " + data.userN);
        var elem = document.getElementById('chatroom');
        elem.scrollTop = elem.scrollHeight;
    })
})
