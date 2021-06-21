'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CursoSchema = Schema ({
    nombreCurso: String,




 maestro: { type: Schema.Types.ObjectId, re: 'maestro'}
 
})


module.exports = mongoose.model("Cursos", CursoSchema);