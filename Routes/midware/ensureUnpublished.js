//SHOULD ONLY BE USED AFTER ensureOwner
const Teacher = require('../../models/Teacher')

module.exports = async function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const course = req.course

		if (course.isPublished) {
			return res
				.status(403)
				.json({
					message: "Error: can't delete or edit published course!",
				})
		}

		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({ message: "Error occured while validating course's published state!" })
	}
}
