const { Schema, model } = require("mongoose")

const Classes = new Schema({
    name: { type: String, required: true},
    teachers: [{type: String}],
    students: [{type: String}]
})

module.exports = model("Classes", Classes)