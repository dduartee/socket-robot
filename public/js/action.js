var socket = io();
var ms = 0;

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
socket.on('contador', function (data) {
    document.getElementById('contador').innerHTML = data;
});

socket.on('pong', function(ms) {
    document.getElementById('latencia').innerHTML = ms;
});
