'use strict'

//IMPORTACIONES
const Maestro = require('../modelos/maestro.model')
const bcrypt = require("bcrypt-nodejs")
const jwt = require('../servicios/jwt')



    
function roles(req,res) {
    if (req.user.rol === 'ROL_MAESTRO'){
        res.status(200).send({mensaje: `Hola, mi nombre es ${req.user.rol} ` })
    } else {
        res.status(200).send({ mensaje: 'No es un Usuario'})
    }

}




function registrar(req,res) {
    var MaestroModel = new Maestro();
    var params = req.body;

    if (params.usuario && params.email && params.password) {
        MaestroModel.nombre = params.nombre;
        MaestroModel.usuario = params.usuario;
        MaestroModel.email = params.email;
        MaestroModel.rol='ROL_MAESTRO';


        Maestro.find({ $or: [
            {usuario: MaestroModel.usuario},
            {email: MaestroModel.email}
        ]}).exec((err, MaestrosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Maestro' })  
            
            if (MaestrosEncontrados 
                && MaestrosEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'El Maestro ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err, passwordEncriptada)=>{
                    MaestroModel.password = passwordEncriptada;

                    MaestroModel.save((err,MaestroGuardado)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el maestro'}) 
                            
                        if (MaestroGuardado) {
                            res.status(200).send(MaestroGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el maestro'})
                        }
                    })
                })

            }
        })
    }    
}


function login(req, res){
var params = req.body;

Maestro.findOne({ usuario: params.usuario }, (err,  maestroEncontrado)=>{
if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});

if (maestroEncontrado){                         // TRUE || False
       bcrypt.compare(params.password, maestroEncontrado.password, (err, passCorrecta)=> {
           if(passCorrecta){
               if(params.obtenerToken === 'true'){
                   return res.status(200).send({
                   token: jwt.createToken(maestroEncontrado)
               });

           }else{
               maestroEncontrado.password = undefined;
               return res.status(200).send({ maestroEncontrado })
           }
       }else{
           return res.status(404).send({ mensaje: 'El maestro no se ha podedido identificar'})
       }
})
}else{
    return res.status(404).send({mensaje: 'EL maestro no se ha podido ingresar'})
}
})
}




 function listarCursos(req,res) {

    Curso.find().populate('maestro','nombre').exec((err, CursoEncontrados)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion de cursos'});
    if(!CursoEncontrados) return res.status(500).send({mensaje: 'Error al obtener cursos'});
    return res.status(200).send({CursoEncontrados});
})
}





module.exports = {
    roles,
    registrar,
    listarCursos,
    login,

}
