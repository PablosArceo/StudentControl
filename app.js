'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

//IMPORTACION RUTAS
const maestro_rutas = require("./src/rutas/maestro.rutas");
const curso_ruta = require("./src/rutas/curso.rutas");
const alumno_rutas = require("./src/rutas/alumno.rutas");


//MIDDLEWARES 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
  

app.use(cors());

app.use('/api', maestro_rutas, curso_ruta, alumno_rutas);

//EXPORTAR
module.exports = app;