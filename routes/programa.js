const express = require('express');
const app = express();
const mdAutenticacion = require('../middlewares/autenticacion');

const Programa = require('../models/programa');

//==============================
//  Obtener todos los programas
//==============================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    var limit = req.query.limit || 0;
    desde = Number(desde);
    limit = Number(limit);
    Programa.find({}, 'nombre contenido fecha colaboradores img potcast facebook twitter')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, programas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando programas - BBDD ',
                        errors: err
                    });
                }
                if (!programas) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando programas ',
                        errors: err
                    });
                }
                if (programas.length <= 0) {

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No hay programas en base de datos ',
                        errors: err
                    });
                }

                Programa.countDocuments({}, (err, conteo) => {
                    if (err) {

                        res.status(400).json({
                            ok: false,
                            message: 'Error al cuantificar el número de programas, Posible problema de base de datos'
                        });

                    }
                    res.status(200).json({
                        ok: true,
                        programas: programas,
                        total: conteo
                    });
                });




            });

});

//==============================
//  Obtener programa por id
//==============================

app.get('/:id', (req, res) => {
    const id = req.params.id;
    Programa.findById(id)
        .populate('colaboradores', 'nombre')
        .exec((err, programa) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar programa',
                    errors: err
                });
            }

            if (!programa) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'EL programa con id ' + id + ' no existe',
                    errors: { message: 'No existe un programa con ese ID' }
                });
            }

            if (programa.length <= 0) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el programa en base de datos ',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                programa: programa
            });
        });
});


//==============================
//  Actualizar programa
//==============================

app.put('/:id', mdAutenticacion.verifaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    Programa.findById(id, (err, programa) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar programa',
                errors: err
            });
        }

        if (!programa) {
            return res.status(400).json({
                ok: false,
                mensaje: 'EL programa con id ' + id + ' no existe',
                errors: { message: 'No existe un programa con ese ID' }
            });
        }

        programa.nombre = body.nombre;
        programa.contenido = body.contenido;
        programa.colaboradores = body.colaboradores;
        programa.img = body.img;
        programa.fecha = body.fecha;
        programa.potcast = body.potcast;
        programa.facebook = body.facebook;
        programa.twitter = body.twitter;
        programa.save((err, programaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar programa',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                programa: programaGuardado
            });
        });
    });
});


//==============================
//  Crear un nuevo programa
//==============================

app.post('/', mdAutenticacion.verifaToken, (req, res) => {

    var body = req.body;
    console.log(body);

    var programa = new Programa({
        nombre: body.nombre,
        contenido: body.contenido,
        colaboradores: body.colaboradores,
        fecha: body.fecha,
        img: body.img,
        potcast: body.potcast,
        facebook: body.facebook,
        twitter: body.twitter
    });

    programa.save((err, programaGuardado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear programa',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            programa: programaGuardado
        });
    });
});

//==============================
//  Borrar un  programa
//==============================

app.delete('/:id', mdAutenticacion.verifaToken, (req, res) => {

    var id = req.params.id;

    Programa.findByIdAndRemove(id, (err, programaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar programa',
                errors: err
            });
        }
        if (!programaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existen programas con ese ID',
                errors: { message: 'No existe ningún programa con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            programa: programaBorrado
        });
    });

});


//==============================
//  Borra un usuario de un programa
//==============================

app.post('/user/:id', (req, res) => {

    var body = req.body;
    console.log(body);
    Programa.updateMany({}, { $pull: { colaboradores: body.userID } }, {safe: true, upsert: true}, (err, res) => {
        console.log(err);
        console.log(res, 'RESPUESTA ');

    });

});

module.exports = app;