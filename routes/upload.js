var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

// default options
app.use(fileUpload());

var Usuario = require('../models/usuario');
var Programa = require('../models/programa');
var Noticia = require('../models/noticia');


// Actualizar Imagen
app.put('/:tipocoleccion/:id', (req, res, next) => {

    var tipocoleccion = req.params.tipocoleccion;
    var id = req.params.id;

    console.log('Collección', tipocoleccion);
    console.log('ID', id);

    // tipos de colección válidos

    var tiposDeColeccionValidos = ['programa', 'noticia', 'usuario'];

    if (tiposDeColeccionValidos.indexOf(tipocoleccion) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Colección no válida para este tipo de acción',
            error: { message: 'La colección indicada no es válida' }
        });
    }

    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'Archivo No seleccionado',
            error: { message: 'Imagen no seleccionada, es necesario seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var splitDeArchivo = archivo.name.split('.');
    extensionArchivo = splitDeArchivo[splitDeArchivo.length - 1];
    console.log('Extensión del archivo', extensionArchivo);
    // Solo aceptamos éstas extensiones
    var extensionesValidas = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'PNG', 'JPEG', 'JPG', 'GIF', 'PDF'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión No Valida',
            error: { message: 'Los formatos válidos son ' + extensionesValidas.join(', ') }
        });
    } else {


        //nombre personalizado del archivo
        var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

        // mover el archivo del temporal a un path
        var path = `./uploads/${ tipocoleccion }/${ nombreArchivo }`;
        archivo.mv(path, err => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover el archivo',
                    error: err
                });
            }
            subirPorTipo(tipocoleccion, id, nombreArchivo, res);

        });


    }
});


function subirPorTipo(tipocoleccion, id, nombreArchivo, res) {

    if (tipocoleccion == 'usuario') {
        Usuario.findById(id, 'nombre email role img', (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, usuario no encontrado',
                    error: err
                });
            }
            var pathViejo = './uploads/usuario/' + usuario.img;
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al subir el archivo',
                            error: err
                        });
                    }

                });
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario',
                        error: err
                    });
                }
             return  res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipocoleccion == 'noticia') {

        Noticia.findById(id, (err, noticia) => {
            if (!noticia) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, noticia no encontrada',
                    error: err
                });
            }
            var pathViejo = './uploads/noticia/' + noticia.img;
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al subir el archivo',
                            error: err
                        });
                    }

                });
            }

            noticia.img = nombreArchivo;

            noticia.save((err, noticiaActualizada) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de noticia actualizada',
                    noticia: noticiaActualizada
                });
            });
        });
    }
    if (tipocoleccion == 'programa') {


        Programa.findById(id, (err, programa) => {
            if (!programa) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, programa no encontrado',
                    error: err
                });
            }
            var pathViejo = './uploads/programa/' + programa.img;
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al subir el archivo',
                            error: err
                        });
                    }

                });
            }

            programa.img = nombreArchivo;

            programa.save((err, programaActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de programa actualizada',
                    programa: programaActualizado
                });
            });
        });
    }

}

// subir por primera vez la imagen
app.post('/imagen', (req, res, next) => {

    let tipo = req.query['tipo'];
    // console.log(req.files);
    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'Archivo No seleccionado',
            error: { message: 'Imagen no seleccionada, es necesario seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var splitDeArchivo = archivo.name.split('.');
    extensionArchivo = splitDeArchivo[splitDeArchivo.length - 1];
    console.log('Extensión del archivo', extensionArchivo);
    // Solo aceptamos éstas extensiones
    var extensionesValidas = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'PNG', 'JPEG', 'JPG', 'GIF', 'PDF'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
       return res.status(400).json({
            ok: false,
            mensaje: 'Extensión No Valida',
            error: { message: 'Los formatos válidos son ' + extensionesValidas.join(', ') }
        });
    }

    //nombre personalizado del archivo
    var nombreArchivo = `${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // nombre si es pdf

    if (extensionArchivo === 'pdf') {
        if (req.files.desde && req.files.hasta) {
            // var inicioagenda = req.files.desde.name.toLowerCase().replace(/ /g,'').trim();
            // var finagenda = req.files.hasta.name.toLowerCase().replace(/ /g,'').trim();
            const inicioagenda = getDateFormat(req.files.desde.name);
            const finagenda = getDateFormat(req.files.hasta.name);
            nombreArchivo = `redonda.${inicioagenda}_${finagenda}.${ extensionArchivo }`;
        }
        
    }

    // mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
          return  res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            path: path,
            img: nombreArchivo
        });

    });

});

function getDateFormat(datestring) {
    console.log(datestring);
    var date = new Date(datestring);
    console.log(date)
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    (day.length == 1) && (day = '0' + day);
    (month.length == 1) && (month = '0' + month);

    console.log(year);
    console.log(month);
    console.log(day);
    var dateformat = year + month + day;
    return dateformat;
}


module.exports = app;