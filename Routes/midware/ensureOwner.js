//SHOULD ONLY BE USED AFTER ensureActiveteacher
const Courses = require('../../models/Courses')

module.exports = async function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const teacher = req.dbTeacher
		if (!teacher) {
			return res
				.status(403)
				.json({ message: 'Ошибка: несуществующий учитель!' })
		}

		const { courseID } = req.body
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
		if (teacher.src !== course.teacher) {
			return res
				.status(403)
				.json({ message: 'Ошибка: вы не владеете этим курсом!' })
		}

		req.course = course
		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({	message: 'Во время подтверждения данных учителя произошла ошибка' })
	}
}
