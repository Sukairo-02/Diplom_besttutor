const { Schema, model } = require('mongoose')

const Subjects = new Schema({
	name: { type: String, unique: true, required: true },
	desc: {type: String},
	Teachers: [{ type: String }],
})

module.exports = model('Subjects', Subjects)
