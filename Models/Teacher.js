const { Schema, model } = require('mongoose')

const Teacher = new Schema({
	src: { type: String, required: true, unique: true },
	desc: { type: String },
	education: { type: String },
	experience: { type: String },
	subject: { type: String },
	isActive: { type: Boolean, required: true, default: false },
})

module.exports = model('Teacher', Teacher)
