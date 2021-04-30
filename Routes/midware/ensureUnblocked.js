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

        if(course.isBlocked){
            return res
            .status(403)
            .json({ message: "Error: can't do this to blocked course!" })
        }

		req.course = course
		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({ message: "Error occured while validating course's block state!" })
	}
}
