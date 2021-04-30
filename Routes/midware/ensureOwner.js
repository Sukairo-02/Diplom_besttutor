//SHOULD ONLY BE USED AFTER ensureActiveteacher
const Teacher = require('../../models/Teacher')

module.exports = async function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const teacher = req.dbTeacher
		if (!teacher) {
			return res
				.status(403)
				.json({ message: 'Error: nonexistent teacher!' })
		}

		const { course: courseID } = req.body
		if (!courseID) {
			return res
				.status(403)
				.json({ message: "Error: nonexistent course's ID!" })
		}

		const course = await Courses.findOne({ _id: courseID })
		if (!course) {
			return res
				.status(403)
				.json({ message: "Error: can't find course in the database!" })
		}
		if (teacher.src !== course.teacher) {
			return res
				.status(403)
				.json({ message: "Error: you don't own this course!" })
		}

		req.course = course
		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({ message: "Error occured while validating teacher's data!" })
	}
}
