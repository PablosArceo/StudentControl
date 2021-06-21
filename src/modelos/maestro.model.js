const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MaestroSchema = Schema({
    nombre: String,
    usuario: String,
    email:String,
    password:String,
    rol: String,
    cursos: {type: Schema.ObjectId, ref: 'cursos'}
})

module.exports = mongoose.model('Maestro', MaestroSchema)