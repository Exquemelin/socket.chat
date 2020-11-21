// Obtenemos los parámetros de la línea de dirección del navegador web
var params = new URLSearchParams(window.location.search);

// Cargamos los datos del usiario y la sala en variables para poder trabajar más fácil con ellas.
var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de jQuery
// Cogemos la referencia del div donde se listan los usuarios
var divUsuarios = $('#divUsuarios');
// Cogemos la referencia del formulario que envia los mensajes
var formEnviar = $('#formEnviar');
// Cogemos la referencia de la entrada de texto del formulario
var txtMensaje = $('#txtMensaje');
// Cogemos la referencia del botón del formulario
var formButton = $('#formButton');
// Cogemos la referencia del la caja donde se muestran todos los mensajes
var divChatbox = $('#divChatbox');



// Funciones para renderizar usuario
function renderizarUsuarios(personas) {

    // Esperamos un arreglo del tipo [{},{},{},{}...]

    // Creamos una variable que llamamos html, ya que le vamos a introducir código de html
    var html = '';

    // A la variable html le vamos añadiendo código html que nos interesa luego mostrar en la página
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    // Hacemos un ciclo for para añadir la información de cada una de los objetos que nos entran por el array personas
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        // la etiqueta "data-id" la colocamos para darle un identificador a la etiqueta "a". Lo normalizado es que nuestras etiquetas se llamen "data-XXXX"
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    // Le decimos a divUsuarios que su código html ahora va a ser la variable html que hemos ido creando
    divUsuarios.html(html);

}

// Función para renderizar los mensajes en el cuadro de conversación
function renderizarMensajes(mensaje, yo) {

    // Creamos una variable que llamamos html, ya que le vamos a introducir código de html
    var html = '';

    // Creamos una variable con la hora en la que fue publicado el mensaje
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ":" + fecha.getMinutes();

    // Creamos una variable adminClass para los mensajes del Administrador, y modificamos la calse info
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {

        // cogemos el estilo 'danger' si el mensaje lo envía un administrador
        adminClass = 'danger';

    }

    // Comprobams si es el propio usuario el que manda el mensaje, o fue otro usuario
    if (yo) {

        // Este código es para renderizar el mensaje del propio usuario, para que se vea diferente
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        // A la variable html le vamos añadiendo código html que nos interesa luego mostrar en la página
        html += '<li class="anitamted fadeIn">'; // El animates fadeIN es una animación para cuando aparece el mensaje

        // Si el mensaje es del Administrador, no queremos que aparezca la imagen de usuario
        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'; // Si es una admin, el estilo será "danger", si no, será "info"
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    };

    // Le decimos a divChatbox que su código html ahora va a ser la variable html que hemos ido creando
    divChatbox.append(html);

};

// Esta función aportada por Fernando Herrera hace que la pantalla se mueva al final
function scrollBottom() {

    // Si lo necesitamos usar para otras cosas, tenemos que substituir el "divChatbox" por la etiqueta que corresponda

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


// Listeners
// Creamos un listener el divUsuarios, que escuchará cualquier click dentro de las etiquetas "a" del código html, para que nos devuelva el data-id
divUsuarios.on('click', 'a', function() {

    // añadimos a la variable id, el del anchor tag al que han hecho click
    var id = $(this).data('id');

    // Comprogamos que haya un id, y lo devolvemos por console
    if (id) {
        console.log(id);
    };

});

// formButton.addEventListener('click', function(e) {
//     e.preventDefault();
// });

// Creamos un listener para el botón del formulario de envío de mensaje
formEnviar.on('submit', formEnviar, function(e) {

    // Evita algo a la hora de realizar el posteo
    e.preventDefault();

    // Comprobamos si el mensaje está vacío.
    if (txtMensaje.val().trim().length === 0) {
        return;
    };

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val(),
    }, function(mensaje) {
        // Cuando recibamos cualquier mensaje de vuelta lo que hacemos es vaciar el cuadro de entrada con .val(''), y con el .focus() hacemos que el cursor quede activo
        txtMensaje.val('').focus();
        // Como este es el mensaje del propio usuario, ponemos "yo" a true
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

})