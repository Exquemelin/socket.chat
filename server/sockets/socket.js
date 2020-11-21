const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

// Creamos una variable del tipo Usuarios para ir manejando los conectados en la sala
const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        // Comprobamos si viene el nombre. En caso contrario lanzamos un mensaje de error por el callback
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        };

        // Con el metodo "join" del client unimos al cliente a una sala en concreto
        client.join(data.sala);

        // Necesitamos el id, pero lo podemos obtener del client directamente, ya que es único para cada conexión, el nombre lo sacamos del data
        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // // Obtenemos todas las personas conectadas, incluyendo ya la reción conectada, y lo emitimos a todas las personas conectadas
        // client.broadcast.emit('listaPersona', usuarios.getPersonas());

        // Obtenemos todas las personas conectadas, incluyendo ya la reción conectada, y lo emitimos a todas las personas conectadas
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        // Devolvemos en el callback el array de personas, que son las que están conectadas
        callback(usuarios.getPersonasPorSala(data.sala));

    });

    // Escuchamos un mensaje que envie un cliente para emitirlo a todas las personas que estén en su misma sala
    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        // Mandamos el mensaje a todos los clientes, pero le decimos a qué sala pertenecen los que tienen que escuchar
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    })

    client.on('disconnect', () => {

        // Obtenemos el id del client que se ha desconectado y y lo mandamos a usuarios para que ejecute la función, 
        //la borre del listado y nos devuelva la persona borrada
        let personaBorrada = usuarios.borrarPersona(client.id);

        // Emitimos un evento para todos los clientes conectados
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } abandonó el chat`));

        // Obtenemos todas las personas conectadas, excluyendo ya la reción desconectada, y lo emitimos a todas las personas conectadas
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));


    })

    // Mensajes privados
    client.on('mensajePrivado', (data) => {

        // Obtenemos la información de la persona que está enviando el mensaje
        let persona = usuarios.getPersona(client.id);

        // Mandamos el mensaje a todos lo usuarios. Pero con to() le decimos el id que lo tiene que escuchar
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});