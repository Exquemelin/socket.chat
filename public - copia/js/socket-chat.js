var socket = io();

// Obtenemos los parámetros con la información que nos tienen que proporcionar
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    // Si no tenemos el nombre lo lanzamos a la página index.html
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
};

// almacenamos los datos en un objeto
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {

        console.log('Usuarios conectados: ', resp);

    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// // Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar mensaje
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del caht
socket.on('listaPersona', function(personas) {
    console.log(personas);
})

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);

})