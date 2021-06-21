const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AlumnoSchema = Schema({
    nombre: String,
    usuario: String,
    email:String,
    rol:String,
    password:String,
    cursos:[{type: Schema.Types.ObjectId,ref: 'Cursos'}]
   

})

module.exports = mongoose.model('Alumno', AlumnoSchema)