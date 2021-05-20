var isDate = function (date) {
	return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date))
}

module.exports = async function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const { dateOfBirth: date } = req.body
		if (!date) {
			return res
				.status(403)
				.json({ message: 'Ошибка: не указана дата рождения!' })
		} else {
			if (!isDate(date)) {
				return res
					.status(403)
					.json({ message: 'Ошибка: неверная дата рождения!' })
			} else {
				let date1 = new Date(date)
				let date2 = new Date()
				let year = date2.getFullYear() - date1.getFullYear()

				if (year < 4) {
					return res
						.status(403)
						.json({ message: 'Ошибка: неверная дата рождения!' })
				}
			}
		}
		return next()
	} catch (e) {
		console.log(e)
		return res
			.status(500)
			.json({	message: 'Во время проверки даты рождения произошла ошибка' })
	}
}
