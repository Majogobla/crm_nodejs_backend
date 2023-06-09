const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({path: 'variables.env'});

// CORS permite que un cliente se conecte a otro servidor para el intercambio de recursos
const cors = require('cors');

// Conectar a mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, 
{
    useNewUrlParser: true,
});

// Crear el servidor
const app = express();

// Carpeta publica
app.use(express.static('uploads'));

// Habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Definir un dominio para recibir las peticiones
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = 
{
    origin: (origin, callback) =>
    {
        // Revisar si la peticion viene de un servidor que esta en la lista blanca
        const existe = whiteList.some(dominio => dominio === origin);

        if(existe)
        {
            callback(null, true);
        }
        else
        {
            callback(new Error('No permitido por CORS'));
        }
    }
}

// Habilitar cors
app.use(cors(corsOptions));

// Rutas de la app
app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

// Puerto
app.listen(port, host, () =>
{
    console.log('El servidor está funcionando');
});