const { Schema, model } = require('mongoose')

const User = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	dateOfBirth: { type: Date, required: true },
	phone: { type: String, default: 'TBA' },
	area: { type: String, default: 'TBA' },
	city: { type: String, default: 'TBA' },
	address: { type: String, default: 'TBA' },
	avatar: { type: String },
	roles: [{ type: String, ref: 'Role' }], //possible roles: 'USER', 'TCHR'
	balance: { type: Number, required: true, default: 0 },
	isActive: { type: Boolean, required: true, default: false },
	courses: [
		{
			id: { type: String, required: true },
			price: { type: Number, required: true, default: 0 },
		},
	], //courses where user participates as student
})

module.exports = model('User', User)
