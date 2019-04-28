// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicializamos las variables
const app = express();

// Generate CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importamos Rutas

const appRoutes = require('./routes/app');
const noticiaRoutes = require('./routes/noticia');
const loginRoutes = require('./routes/login');
const programaRoutes = require('./routes/programa');
const usuarioRoutes = require('./routes/usuario');
const eventProgRoutes = require('./routes/eventprogramacion');
const eventOcupRoutes = require('./routes/eventocupacion');
const busquedaRoutes = require('./routes/busqueda');
const imagenRoutes = require('./routes/imagen');
const uploadRoutes = require('./routes/upload');
const downloadRoutes = require('./routes/download');

// Conección a Base de datos
// mongodb://ondapoligono:0nd4p0l1g0n0(@ds135537.mlab.com:35537/ondapoligonodb
// mongodb://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@${process.env.SOCKET_DB_CONN}:35537/${process.env.DB_NAME}
mongoose.connect(
    `mongodb://ondapoligono:0nd4p0l1g0n0(@ds135537.mlab.com:35537/ondapoligonodb`, { useNewUrlParser: true },
    (err, res) => {
        if (err) throw err;

        console.log('Base de Datos:\x1b[34m%s\x1b[0m', 'online');
    }
);

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/noticia', noticiaRoutes);
app.use('/programa', programaRoutes);
app.use('/eventprog', eventProgRoutes);
app.use('/eventocup', eventOcupRoutes);
app.use('/img', imagenRoutes);
app.use('/busqueda/', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.use('/', appRoutes);

// Establecemos socket
app.listen(3001, () => {
    console.log(
        'Express Server corriendo en puerto 3001:\x1b[34m%s\x1b[0m',
        'online'
    );
});