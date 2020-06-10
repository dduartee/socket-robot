var socket = io();

function move(obj) { // funcao com argumento do input
    socket.emit('move', obj.id); // envia informação para o socket
    //console.log(obj.alt);
    socket.on('move', function (msg) {
        document.getElementById('saida').innerHTML = msg; // retorna valor
    });
    
}

socket.on('contador', function (data) {
    //console.log(data);
    document.getElementById('contador').innerHTML = data;
});