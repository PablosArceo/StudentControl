'use strict'

//IMPORTACIONES
const express = require("express");
const maestroControlador = require("../controladores/maestro.controlador")
// MIDDLEWARES
var md_autentication = require("../middlewares/authenticated")

//RUTAS MAESTRO
var api = express.Router();
api.get('/roles', md_autentication.ensureAuth, maestroControlador.roles);
api.post('/registrar',maestroControlador.registrar);

api.post('/login', maestroControlador.login);




module.exports = api;