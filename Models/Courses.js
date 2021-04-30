const { Schema, model } = require('mongoose')

const Courses = new Schema({
	teacher: { type: String, required: true }, //contains 'src' field of teacher, which is similar to his User ID
	title: { type: String, required: true },
	desc: { type: String },
	students: [{ type: String }],
	price: {type: Number, required: true, default: 0}, 
	lessons: [
		{
			date: { type: Date, required: true },
			endDate: { type: Date, required: true },
			location: {
				type: String,
				required: true,
				default: 'Online',
			},
		},
	],
	assignments: [
		{
			source: { type: String },
		},
	],
})

module.exports = model('Courses', Courses)
