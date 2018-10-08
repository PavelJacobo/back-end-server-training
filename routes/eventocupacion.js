var express = require('express');
var app = express();

const Evento = require('../models/evento');

// =================================
//  Optener todos los Eventos
// =================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Evento.find({})
        .skip(desde)
        .limit()
        .exec(
            (err, eventos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando eventos - BBDD ',
                        errors: err
                    });
                }
                if (!eventos) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando eventos ',
                        errors: err
                    });
                }
                if (eventos.length <= 0) {

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No hay eventos en base de datos ',
                        errors: err
                    });
                }

                Evento.countDocuments({}, (err, conteo) => {
                    if (err) {

                        res.status(400).json({
                            ok: false,
                            message: 'Error al cuantificar el número de eventos, Posible problema de base de datos'
                        });

                    }
                    res.status(200).json({
                        ok: true,
                        eventos: eventos,
                        total: conteo
                    });
                });




            });

});

// =================================
//  Crear Evento
// =================================

app.post('/', (req, res) => {

    var body = req.body;
    console.log(body);
    var evento = new Evento({
        title: body.title,
        start: body.start,
        end: body.end,
        _userId: body._userId,
        dow: body.dow,
        color: body.color,
        url: body.url
    });

    evento.save((err, eventoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Evento',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });
    });
});

app.put('/:id', (req, res) => {
    const body = req.body;
    const id = req.params.id;
    Evento.findByIdAndUpdate(id, { $set: { start: body.start, end: body.end } })
        .exec((err, eventoActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear Evento',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                evento: eventoActualizado
            });
        });
});

// =================================
//  Borrar Evento
// =================================

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Evento.findByIdAndRemove(id, (err, eventoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar evento',
                errors: err
            });
        }
        if (!eventoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existen eventos con ese ID',
                errors: { message: 'No existe ningún evento con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            evento: eventoBorrado
        });
    });

});

module.exports = app;