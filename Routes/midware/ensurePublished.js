module.exports = async function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const courseID = req.body.courseID || req.params.id 
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

        if(!course.isPublished){
            return res
            .status(403)
            .json({ message: "Error: this course is not yet published!" })
        }

		req.course = course
		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({ message: "Error occured while validating course's publish state!" })
	}
}
