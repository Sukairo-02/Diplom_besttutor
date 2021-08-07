// SHOULD ONLY BE USED AFTER ensureOwner

module.exports = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const { course } = req;

		if (course.isPublished) {
			return res.status(403).json({ message: 'Ошибка: нельзя редактировать опубликованый курс!' });
		}

		return next();
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'Произошла ошибка во время валидации статуса курса' });
	}
};
