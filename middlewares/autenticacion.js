var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
//==============================
//  Verificar Token
//==============================

exports.verifaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

};

//==============================
//  Verificar Admin
//==============================

exports.verificaAdmin = function(req, res, next) {

    var usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador',
            errors: {
                err: err,
                message: 'No es posible realizar dicha acción. Unauthorized'
            }
        });
    }
};

//==============================
//  Verificar Admin O Mismo User
//==============================

exports.verificaAdminOUser = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador ni es el mismo usuario',
            errors: {
                err: err,
                message: 'No es posible realizar dicha acción. Unauthorized'
            }
        });
    }

};