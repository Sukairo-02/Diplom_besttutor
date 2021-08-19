const Courses = require('../../Models/Courses')

module.exports = async function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const courseID = req.body.courseID || req.params.id
		if (!courseID) {
			return res
				.status(403)
				.json({ message: 'Ошибка: отсутствует id курса!' })
		}

		const course = await Courses.findOne({ _id: courseID })
		if (!course) {
			return res
				.status(403)
				.json({ message: 'Ошибка: курс не найден в базе данных!' })
		}

		if (!course.isPublished) {
			return res
				.status(403)
				.json({ message: 'Ошибка: этот курс еще не опубликован!' })
		}

		req.course = course
		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({ message: 'Произошла ошибка во время валидации статуса курса' })
	}
}
