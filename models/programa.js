var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var programaChema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    contenido: { type: String, required: [true, 'La Información del programa no puede estar vacía'] },
    fecha: { type: Array, required: false },
    colaboradores: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
    img: { type: String, required: false },
}, { collection: 'programas' });
programaChema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser único' });


module.exports = mongoose.model('Programa', programaChema);