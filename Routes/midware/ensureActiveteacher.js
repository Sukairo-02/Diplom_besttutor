//SHOULD ONLY BE USED AFTER ensureRoles(['TCHR'...])
const Teacher = require('../../models/Teacher')

module.exports = async function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const candidate = await Teacher.findOne({ src: req.user.id })
		if (!candidate) {
			return res
				.status(403)
				.json({ message: 'Error: nonexistent teacher!' })
		}

		if (!Teacher.isActive) {
			return res
				.status(403)
				.json({
					message:
						'Error: you must fill out your teacher data first!',
				})
		}

		req.dbTeacher = candidate
		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({ message: "Error occured while validating teacher's data!" })
	}
}
