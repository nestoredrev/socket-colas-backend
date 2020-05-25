const mongoose          = require('mongoose');
const uniqueValidator   = require('mongoose-unique-validator');
const Schema            = mongoose.Schema;


const ticketControlSchema = new Schema({
    ultimo: {
        type: Number,
        required: true,
        default: 0
    },
    hoy: {
        type: Date,
        default: new Date()
    },
    tickets: [
        { 
            numero: { type: Number }, 
            escritorio: { type: Number} 
        }
    ],
    ultimos4: [
        { 
            numero: { type: Number }, 
            escritorio: { type: Number} 
        }
    ]
});


ticketControlSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico. ---{TYPE}--- ---{VALUE}--- ' });
module.exports = mongoose.model('TicketControl', ticketControlSchema);