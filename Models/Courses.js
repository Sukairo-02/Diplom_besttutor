const { Schema, model } = require('mongoose')

const Courses = new Schema({
	teacher: { type: String, required: true }, //contains 'src' field of teacher, which is similar to his User ID
	subject: { type: String, required: true },
	title: { type: String, required: true },
	desc: { type: String },
	students: [{ type: String }],
	isPublished: { type: Boolean, required: true, default: false },
	isBlocked: { type: Boolean, required: true, default: false },
	price: { type: Number, required: true, default: 0 },
	chatroomID: { type: String },
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
	assignments: [{ type: String }],
})

module.exports = model('Courses', Courses)
