'use strict'

//IMPORTACIONES
const Alumno = require('../modelos/alumno.model')
const bcrypt = require("bcrypt-nodejs")
 const jwt = require('../servicios/jwt')



    
 function roles(req,res) {
    if (req.user.rol === 'ROL_ALUMNO'){
        res.status(200).send({mensaje: `Hola, mi nombre es ${req.user.rol} ` })
    } else {
        res.status(200).send({ mensaje: 'No es un Usuario'})
    }

}

function agregarAlumno(req,res) {
    var alumnoModel = new Alumno();
    var params = req.body;

    if (params.usuario && params.email && params.password) {
        alumnoModel.nombre = params.nombre;
        alumnoModel.usuario = params.usuario;
        alumnoModel.email = params.email;
        alumnoModel.rol='ROL_ALUMNO';

        Alumno.find({ $or: [
            {usuario: alumnoModel.usuario},
            {email: alumnoModel.email}
        ]}).exec((err, alumnosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del alumno' })  
            
            if (alumnosEncontrados 
                && alumnosEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'El alumno ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err, passwordEncriptada)=>{
                    alumnoModel.password = passwordEncriptada;

                    alumnoModel.save((err,alumnoGuardado)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el alumno'}) 
                            
                        if (alumnoGuardado) {
                            res.status(200).send(alumnoGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el alumno'})
                        }
                    })
                })

            }
        })
    }    
}



function loginAlumno(req, res){
    var params = req.body;
    
    Alumno.findOne({ usuario: params.usuario }, (err,  AlumnoEncontrado)=>{
    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
    
    if (AlumnoEncontrado){                         // TRUE || False
           bcrypt.compare(params.password, AlumnoEncontrado.password, (err, passCorrecta)=> {
               if(passCorrecta){
                   if(params.obtenerToken === 'true'){
                       return res.status(200).send({
                       token: jwt.createToken(AlumnoEncontrado)
                   });
    
               }else{
                   AlumnoEncontrado.password = undefined;
                   return res.status(200).send({ AlumnoEncontrado })
               }
           }else{
               return res.status(404).send({ mensaje: 'El alumno no se ha podedido identificar'})
           }
    })
    }else{
        return res.status(404).send({mensaje: 'EL alumno no se ha podido ingresar'})
    }
    })
    }
    
 


function editarAlumno(req, res){
    var idAlumno = req.params.idAlumno;
    var params = req.body;


    delete params.password;


  
    Alumno.findByIdAndUpdate(idAlumno, params, { new: true }, (err, alumnoActualizado)=>{ 
        if(err) return status(500).send({mensaje: 'Error en la peticion'});
        if(!alumnoActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar el alumno'})
  
        return res.status(200).send({ alumnoActualizado });

    } )
}

function eliminarAlumno(req,res){
const idAlumno = req.params.idAlumno;


 Alumno.findByIdAndDelete(idAlumno, (err, alumnoEliminado)=>{
     if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar, verifique ID'});
     if(!alumnoEliminado) return res.status(500).send({mensaje: 'Alumno ya eliminado'});

     return res.status(200).send({ alumnoEliminado});
 })
}



    function asignarCurso(req,res){
    var idCurso1 = req.params.idCurso1;
    var idAlumno = req.user.sub;
    
    Alumno.findOne({_id : idAlumno}).exec((err,userFound)=>{
    if (userFound.cursos.length <3){
    for (let step = 1; step < userFound.cursos.length; step++){

        if (userFound.cursos[step] == idCurso1){
         return res.status(500).send({mensaje:'Ya se encuentra asignado este curso'})
     }
 }
        Alumno.findOneAndUpdate({
        _id: idAlumno
         },{
         $push:{
         cursos: idCurso1

    }
        },(err,userFound)=>{
        return res.status(500).send(userFound)

})
     }else{
        return res.status(404).send({mensaje: 'Ha superado el limite de asignaciones de cursos'})
}
})
}    

function listarCursosAlumno(req,res) {
    var idAlumno = req.user.sub;
  
    Alumno.find({ idAlumno: req.user.idAlumno}).populate('Cursos','nombreCurso').exec((er, CursosEncotrados)=>{
       if(er) return res.status(500).send({mensaje: 'Error al listar cursos alumnos'});
       if(!CursosEncotrados) return res.status(500).send({mensaje: 'Erro al obtener cursos'});
       return res.status(200).send({CursosEncotrados});
    })
 
}




module.exports = {
    agregarAlumno,
    loginAlumno,
    editarAlumno,
    eliminarAlumno,
    roles,
    asignarCurso,
    listarCursosAlumno
}
