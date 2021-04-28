const { Schema, model } = require('mongoose')

const Subjects = new Schema({
	name: { type: String, unique: true, required: true },
	Teachers: [{ type: String }],
})

module.exports = model('Subjects', Subjects)
