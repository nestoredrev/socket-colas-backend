const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    // Responder al Cliente
    client.broadcast.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });


    client.on('disconnect', () => {
        console.log('El usuario se ha desconectado');
    });


    // Escuhar el cliente
    client.on('nuevoTicket', (mensaje, callback) => {
        
        let siguiente = ticketControl.siguienteTicket();
        callback(siguiente);

    });


    client.on('atenderTicket', (escritorio, callback) => {

        if(!escritorio)
        {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            })
        }

        let atenderTicket = ticketControl.atenderTicket(escritorio);
        callback(atenderTicket);

        // Actualizar / notificar cambios en los ultimos 4en la pantalla principal
        client.broadcast.emit('estadoActual', {
            actual: ticketControl.getUltimoTicket(),
            ultimos4: ticketControl.getUltimos4()
        });


    })

});