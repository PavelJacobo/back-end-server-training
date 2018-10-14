var express = require('express');
var app = express();
var Noticia = require('../models/noticia');


// rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Crear noticia

app.post('/', (req, res) => {
    const body = req.body;
    const noticia = new Noticia({
        titulo: body.titulo,
        resume: body.resume,
        contenido: body.contenido,
        tags: body.tags,
        img: body.img,
        date: body.date
    });

    noticia.save((err, noticiaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Noticia',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            noticia: noticiaGuardada
        });
    });

});

module.exports = app;