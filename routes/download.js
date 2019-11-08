var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path'); // get path
var dir = path.resolve(".") + '/uploads/redonda'; // give pat


// rutas
app.get('/', (req, res) => {
    fs.readdir(dir, (err, list) => {
        if (err) {
           return res.status(500).json({
                ok: false,
                mensaje: 'Error al listar los archivos o error al leer directorio',
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            files: list
        });
    });
});


module.exports = app;