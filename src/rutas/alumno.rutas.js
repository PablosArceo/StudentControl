'use strict'
//IMPORTACIONES

const express = require("express");
const alumnoControlador = require ("../controladores/alumno.controlador");
// MIDDLEWARES

const md_autentication = require("../middlewares/authenticated");

//RUTAS ALUMNO


var api = express.Router();
api.post('/agregarAlumno', alumnoControlador.agregarAlumno);
api.post('/loginAlumno', alumnoControlador.loginAlumno);
api.put('/editarAlumno/:idAlumno', alumnoControlador.editarAlumno);
api.delete('/eliminarAlumno/:idAlumno', alumnoControlador.eliminarAlumno);
api.post('/asignarCurso/:idCurso1',md_autentication.ensureAuth, alumnoControlador.asignarCurso);
api.get('/listarCursosAlumno', md_autentication.ensureAuth, alumnoControlador.listarCursosAlumno);


module.exports = api;