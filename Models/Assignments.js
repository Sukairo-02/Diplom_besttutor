const { Schema, model } = require('mongoose')

const Assignments = new Schema({
	title: { type: String, required: true },
	desc: { type: String },
	isShuffled: { type: Boolean, required: true, default: false }, //determines if questions and answer variants will be shuffled
	allowOvertime: { type: Boolean, required: true, default: false }, //determines if users will be able to submit past endDate
	maxPoints: { type: Number, default: 0 },
	date: { type: Date, required: true, default: Date.now },
	endDate: { type: Date },
	questions: [
		{
			title: { type: String, required: true },
			qID: { type: String },
			points: { type: Number, default: 0 },
			isMulAnswers: { type: Boolean, required: true, default: false }, //determines whether question is answered by radio button or checkbox (radio by default)
			answers: [
				{
					nID: { type: String },
					text: { type: String, required: true },
					isTrue: { type: Boolean, required: true, default: false },
				},
			],
		},
	],
	submits: [
		{
			submitter: { type: String, required: true },
			points: { type: Number, default: 0, required: true },
			questions: [
				{
					title: { type: String, required: true },
					qID: { type: String, required: true },
					points: { type: Number, required: true },
					isCorrect: { type: Boolean, default: false },
					answers: [
						{
							text: { type: String, required: true },
							nID: { type: String, required: true },
							isChecked: {
								type: Boolean,
								required: true,
								default: false,
							},
							isCorrect: {
								type: Boolean,
								required: true,
								default: false,
							},
						},
					],
				},
			],
		},
	],
})

module.exports = model('Assignments', Assignments)
