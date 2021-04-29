const User = require('../../models/User')
const Teacher = require('../../models/Teacher')
const Role = require('../../models/Roles')
const Subjects = require('../../models/Subjects')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const config = require('config')

class schoolController {
	async initSubjects(req, res) {
		//dev route, to be removed in production
		try {
			const { subjects } = req.body
			subjects.forEach(async (el) => {
				const subject = await Subjects.findOne({ name: el })
				if (!subject) {
					const newSub = new Subjects({ name: el })
					await newSub.save()
				}
			})

			return res.json({ message: 'Subjects initialized succesfully!' })
		} catch (e) {
			console.log(e)
			res.status(500).json({
				message: 'Error: failed to initialize subjects!',
			})
		}
	}

    async getSubjects(req, res) {
        try {
			const subjects = await Subjects.find()
			return res.json({ subjects })
		} catch (e) {
			console.log(e)
			res.status(500).json({
				message: 'Error: failed to get subjects!',
			})
		}
    }
}

module.exports = new schoolController()
