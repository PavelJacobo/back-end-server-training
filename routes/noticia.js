var express = require('express');
var app = express();
var Noticia = require('../models/noticia');


// Get Noticia
app.get('/', (req, res, next) => {
    Noticia.find({})
        .populate('author')
        .exec((err, noticiasEncontradas) => {
            if (err) {
                return res.status(404).json({
                    status: false,
                    err: err,
                    message: 'Error al buscar noticia'
                });
            }

            res.status(200).json({
                status: true,
                noticias: noticiasEncontradas
            });
        });
});

// Get noticia por tipo
app.get('/tipo/:tipo', (req, res, next) => {
    const tipo = req.params.tipo;
    console.log(tipo);
    Noticia.find({ 'categoria': tipo })
        .sort({ date: -1 })
        .limit(3)
        .populate('author')
        .exec((err, noticiasEncontradas) => {
            if (err) {
                return res.status(404).json({
                    status: false,
                    err: err,
                    message: 'Error al buscar noticia'
                });
            }

            res.status(200).json({
                status: true,
                noticias: noticiasEncontradas
            });
        });
});

// Get Noticia por Id de noticia
app.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Noticia.findById(id)
        .populate('author', 'nombre')
        .exec((err, noticiaEncontrada) => {
            if (err) {
                return res.status(404).json({
                    status: false,
                    err: err,
                    message: 'Error al buscar noticia'
                });
            }

            res.status(200).json({
                status: true,
                noticia: noticiaEncontrada
            });
        });
});

// get Noticia de Usuario por id de Usuario
app.get('/user/:id', (req, res, next) => {
    const id = req.params.id;
    Noticia.find({ author: id })
        .exec((err, noticias) => {
            if (err) {
                return res.status(404).json({
                    status: false,
                    err: err,
                    message: 'Error al buscar noticias del usuario'
                });
            }

            res.status(200).json({
                status: true,
                noticias: noticias
            });
        });
});

// Crear noticia

app.post('/', (req, res) => {
    const body = req.body;
    console.log('BODY', body)
    const noticia = new Noticia({
        titulo: body.titulo,
        resume: body.resume,
        contenido: body.contenido,
        tags: body.tags,
        categoria: body.categoria,
        img: body.img,
        author: body.author,
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

// Actualizar Noticia por Id

app.put('/:id', (req, res) => {
    let id = req.params.id;
    console.log('ID', id);
    let body = req.body;
    console.log('BODY', body);
    Noticia.findByIdAndUpdate(id, {
            $set: {
                titulo: body.titulo,
                resume: body.resume,
                contenido: body.contenido,
                tags: body.tags,
                categoria: body.categoria,
                img: body.img,
            }
        })
        .exec((err, noticiaEncontrada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Noticia',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                noticia: noticiaEncontrada
            });
        });
});

// ELiminar una noticia por id

app.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Noticia.findByIdAndRemove(id, (err, noticiaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar noticia',
                errors: err
            });
        }
        if (!noticiaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existen Noticias con ese ID',
                errors: { message: 'No existe ningún noticia con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            noticia: noticiaBorrada
        });
    });
});

module.exports = app;