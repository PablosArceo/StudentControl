'use strict'
//IMPORTACIONES
const express = require("express");
const cursoControlador = require ("../controladores/curso.controlador");
// MIDDLEWARES

const md_autentication = require("../middlewares/authenticated");

//RUTAS CURSO

const api = express.Router();
api.post('/agregarCursos', md_autentication.ensureAuth, cursoControlador.agregarCursos);
api.get('/listarCursos', md_autentication.ensureAuth, cursoControlador.listarCursos);
api.put('/editarCurso/:idCurso', md_autentication.ensureAuth, cursoControlador.editarCurso );
api.delete("/eliminarCurso/:idCurso", md_autentication.ensureAuth, cursoControlador.eliminarCurso);

module.exports = api;