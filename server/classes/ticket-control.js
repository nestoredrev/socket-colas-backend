const TicketControlBD = require('../models/ticket-control');


class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}


class TicketControl {


    constructor() {

        this.ultimo = 0;
        this.hoy = new Date();
        this.tickets = [];
        this.ultimos4 = [];

        getDataTicketControl().then(data => {
            if(data)
            {
                if(data.hoy.getDate() === this.hoy.getDate())
                {
                    this.ultimo = data.ultimo;
                    this.tickets = data.tickets;
                    this.ultimos4 = data.ultimos4;
                }
                else
                {
                    console.log('Dia nuevo: Reinicio');
                    this.reiniciarConteo();
                }
            }
            else
            {
                this.reiniciarConteo();
                console.log('SIN REGISTROS!!!');
            }
        })
    }

    siguienteTicket()
    {
        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        guardarTciket(this.ultimo, this.tickets).catch(err => console.log(err));
        return `Ticket ${this.ultimo}`;
    }

    reiniciarConteo()
    {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];
        guardarTciket(this.ultimo, this.tickets, this.ultimos4).catch(err => console.log(err));
    }

    getUltimoTicket()
    {
        return `Ticket ${this.ultimo}`;
    }

    getUltimos4()
    {
        return this.ultimos4;
    }

    atenderTicket(escritorio)
    {
        if(this.tickets.length === 0)
        {
            return {
                ok: false,
                message: `No hay tickets pendientes`
            }
        }
        else
        {
            let numeroTicket = this.tickets[0].numero;
            this.tickets.shift(); // eliminar el primer elemento del array y lo retorna
            let atenderTicket = new Ticket(numeroTicket, escritorio);

            this.ultimos4.unshift( atenderTicket ); // Añade un elemento al principio del array
            
            if( this.ultimos4.length > 4 )
            {
                this.ultimos4.splice(-1, 1); // borra el ultimo elemento del array
            }

            console.log('Ultimos 4');
            console.log(this.ultimos4);

            guardarTciket(this.ultimo, this.tickets, this.ultimos4).catch(err => console.log(err));

            return {
                ok: true,
                atenderTicket
            }
        }


    }
}




async function guardarTciket(ultimo, tickets, ultimos4)
{
    return await TicketControlBD.create({ ultimo, tickets, ultimos4 });   
}




async function getDataTicketControl()
{
    return await TicketControlBD.findOne({}).sort({hoy: -1}); // Decreciente
}

module.exports = {
    TicketControl
}