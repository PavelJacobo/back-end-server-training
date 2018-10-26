var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var noticiaChema = new Schema({
    titulo: { type: String, required: [true, 'El nombre es necesario'] },
    resume: { type: String, required: [true, 'El resumen es necesario'] },
    contenido: { type: String, required: [true, 'El contenido es necesario'] },
    tags: { type: [String], required: [true, 'debe añadir al menos un tag'] },
    categoria: { type: String, required: false },
    img: { type: String, required: false },
    author: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    date: { type: Date, required: false }
}, { collection: 'noticias' });

noticiaChema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser único' });


module.exports = mongoose.model('Noticia', noticiaChema);