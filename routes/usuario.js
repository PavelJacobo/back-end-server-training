var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Usuario = require('../models/usuario');

//==============================
//  Obtener todos los usuarios
//==============================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role programas')
        .populate('programas')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios ',
                        errors: err
                    });
                }
                if (!usuarios) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios ',
                        errors: err
                    });
                }
                if (usuarios.length <= 0) {

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No hay usuarios en base de datos ',
                        errors: err
                    });
                }

                Usuario.countDocuments({}, (err, conteo) => {
                    if (err) {

                        res.status(400).json({
                            ok: false,
                            message: 'Error al cuantificar el número de usuarios, Posible problema de base de datos'
                        });

                    }
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });




            });

});

//==============================
//  Obtener usuario por ID
//==============================

app.get('/:id', mdAutenticacion.verifaToken, (req, res) => {
    const id = req.params.id;
    console.log(id);
    Usuario.findById(id).exec((err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'EL usuario con id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        if (usuario.length <= 0) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No hay usuarios en base de datos ',
                errors: err
            });
        }
        usuario.password = 'XD';
        res.status(200).json({
            ok: true,
            usuario: usuario
        });

    });
});

//==============================
//  Actualizar usuario
//==============================

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id)
        .populate('programas', 'nombre')
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'EL usuario con id ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;
            usuario.programas = body.programas;

            if (body.password1 && body.password2) {
                if (body.password1 === body.password2) {
                    usuario.password = bcrypt.hashSync(body.password1, 10);
                }
            }


            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }
                usuarioGuardado.password = ':)';
                Usuario.findById(usuarioGuardado._id)
                    .populate('programas')
                    .exec((err, usuario) => {
                        res.status(200).json({
                            ok: true,
                            usuario: usuario
                        });
                    });
            });
        });
});

//==============================
//  Añadir programa a Usuario
//==============================

app.put('/addprograma/:id', mdAutenticacion.verifaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    console.log(id, 'y', body);

    Usuario.findById(id)
        .exec((err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'EL usuario con id ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }

            usuario.programas.push(body.id);

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }
                usuarioGuardado.password = ':)';
                Usuario.findById(usuarioGuardado._id)
                    .exec((err, usuario) => {
                        res.status(200).json({
                            ok: true,
                            usuario: usuario
                        });
                    });
            });

        });

});

//==============================
//  Crear un nuevo usuario
//==============================

app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});


//==============================
//  Borrar un  usuario
//==============================

app.delete('/:id', mdAutenticacion.verifaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existen usuarios con ese ID',
                errors: { message: 'No existe ningún usuario con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;