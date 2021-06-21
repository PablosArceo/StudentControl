'use strict'
const { response } = require('express');
const alumnoModel = require('../modelos/alumno.model');
const MaestroModel = require('../modelos/maestro.model');
const { findById, findOne, model } = require('../modelos/curso.model');
//IMPORTACIONES
var Cursos = require('../modelos/curso.model');


function roles(req,res) {
    if (req.user.rol === 'ROL_MAESTRO'){
        res.status(200).send({mensaje: `Hola, mi nombre es ${req.user.rol} ` })
    } else {
        res.status(200).send({ mensaje: 'No es un Usuario'})
    }

}


function agregarCursos(req,res) {
var params = req.body;
var cursoModel = new Cursos();


if(params.nombreCurso){
cursoModel.nombreCurso= params.nombreCurso,
cursoModel.maestro = req.user.sub;
if(req.user.rol != 'ROL_MAESTRO'){
    return res.status(500).send({mensaje: 'No tiene los permisos para agregar cursos'})
}
    
    


cursoModel.save((err,CursoAgregado )=>{
 if (err) return res.status(500).send({ mensaje: 'Error en la peticion del curso'});
 if(!CursoAgregado) return res.status(500).send({ mensaje: 'Error al agregar el curso'});

 return res.status(200).send({ CursoAgregado});
})
}else{
    res.status(500).send({
        mensaje: 'Rellene los datos necesarios para crear el curso'
    });
}

/* 
function agregarCursos(req,res) {
    var params = req.body;
    var cursoModel = new Curso();
    if(req.alumno.rol != 'ROL_ALUMNO'){
        return res.status(500).send({mensaje: 'No se puede agregar cursos'})
    }
    if(params.nombreCurso){
        cursoModel.nombre = params.nombreCurso,
        cursoModel.save((err, agregarAsignacion)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!agregarAsignacion) return res.status(500).send({mensaje: 'Error al agregar'})
            return res.status(200).send({ agregarAsignacion});
        })
    } else {
        res.status(500).send({ mensaje: 'Se requiern mas datos'});
    }
}


 
*/
}
function listarCursos(req,res) {

        Cursos.find().populate('maestro','nombreCurso').exec((err, CursosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de cursos'});
        if(!CursosEncontrados) return res.status(500).send({mensaje: 'Error al obtener cursos'});
        return res.status(200).send({CursosEncontrados});
    })
}



 function editarCurso(req, res){
    var params = req.body;
    var CursoModel = new Cursos();
    var idCurso = req.params.idCurso;
    if(req.user.rol != 'ROL_MAESTRO'){
        return res.status(500).send({mensaje: 'No tiene los permisos para editar cursos'})
    }



    Cursos.findByIdAndUpdate(idCurso, params, { new: true }, (err, CursoActualizado)=>{ 
        if(err) return status(500).send({mensaje: 'Error en la peticion de actualizar'});
        if(!CursoActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al curso'})
    
        return res.status(200).send({ CursoActualizado });

    } )
} 


function eliminarCurso(req,res){
const idCurso = req.params.idCurso;
if(req.user.rol != 'ROL_MAESTRO'){
    return res.status(500).send({mensaje: 'No tiene los permisos para eliminar cursos'})
}
 Cursos.findByIdAndDelete(idCurso, (err, CursoEliminado)=>{
     if(err) 
     return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar'});
     if(!CursoEliminado)
     return res.status(500).send({mensaje: 'Curso ya eliminado con aterioridad'});
    
     return res.status(200).send({ CursoEliminado});
     

 })


}
/// CURSOS POR DEFAULT
function cursosEjercicio(){
            Cursos.findOne({nombreCurso: 'DEFAULT'},(err,CursosEncontrados) => {
            if (err) return console.log('error en la creacion del curso');
            if (CursosEncontrados) {
            return console.log(chalk.bgRedBright.writeBright('El curso ya existe'))


        }else{
            maestro.findOne({name:'MAESTRO', usuario: 'MAESTRO'}, (err,maestroEncontrado)=>{
            if (err) return console.log('Error en la busqueda de maestro');

            const nCurso = new Cursos();
             if(maestroEncontrado){

            nCurso.nombreCurso = 'DEFAULT';
            nCurso.maestro = maestroEncontrado._id;

                nCurso.save((err,cursoGuardado)=>{
                if(err) return console.log ('Error intentando guardar curso');
                !cursoGuardado
                ?console.log('No se conoce el dato del Curso')
                    : console.log(chalk.bgRedBright.black('Curso creado Exitosamente'));

    });

    }
})

         } 
           })









}


module.exports = {
    agregarCursos,
    listarCursos,
    editarCurso,
    eliminarCurso,
    cursosEjercicio


}