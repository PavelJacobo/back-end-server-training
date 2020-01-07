var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var app = express();

var Usuario = require('../models/usuario');

var mdAutenticacion = require('../middlewares/autenticacion');

// =================================
//  Autenticación Cotidiana
// =================================

app.post('/', (req, res) => {

    var body = req.body;
    Usuario.findOne({ email: body.email })
        .populate('programas')
        .exec((err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas'
                });
            }

            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas'
                });
            }

            usuarioDB.password = 'XDXD';
            // Crear Token
            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                id: usuarioDB._id,
                token: token,
                menu: getMenu(usuarioDB.role)
            });
        });

});

// =================================
//  Renovación del Token
// =================================

app.get('/renuevatoken', mdAutenticacion.verifaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });
});

// =================================
//  Get Menu
// =================================

function getMenu(ROLE) {
    menu = [{
            titulo: 'Perfil',
            icono: 'far fa-user',
            submenu: [
                { titulo: 'Salir', icon: 'fas fa-sign-out-alt' },
                { titulo: 'Mi usuario', url: 'perfil', icon: 'far fa-user' }
            ]
        },
        {
            titulo: 'Administración',
            icono: 'fas fa-toolbox',
            submenu: [
                { titulo: 'Noticias', url: 'noticias', icon: 'far fa-newspaper' },
                { titulo: 'Programación', url: 'programacion', icon: 'far fa-clock' },
                { titulo: 'Reservar', url: 'ocupacion', icon: 'far fa-calendar-alt' },
                { titulo: 'Perfil Programas', url: 'perfil_programa', icon: 'fas fa-broadcast-tower' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Gestion de Web', url: 'gestion_web', icon: 'fas fa-broadcast-tower' });
    }
    return menu;
}


module.exports = app;