var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var eventoSchema = new Schema({
    title: { type: String, required: [true, 'El nombre del evento es necesario'] },
    start: { type: String, required: [true, 'El inicio del evento es necesario'] },
    end: { type: String, required: [true, 'El fin del evento es necesario'] },
    _userId: { type: String, required: [true, 'El id de Usuario no está validado'] },
    dow: { type: Array, required: false },
    color: { type: String, required: false },
    url: { type: String, required: false }
}, { collection: 'ocupacionlocal' });

eventoSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser único' });


module.exports = mongoose.model('Evento', eventoSchema);