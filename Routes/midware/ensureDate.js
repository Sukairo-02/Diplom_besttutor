const isDate = (date) => {
	return new Date(date) !== 'Invalid Date' && !Number.isNaN(new Date(date));
};

module.exports = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const { dateOfBirth: date } = req.body;
		if (!date) {
			return res.status(403).json({ message: 'Ошибка: не указана дата рождения!' });
		}
		if (!isDate(date)) {
			return res.status(403).json({ message: 'Ошибка: неверная дата рождения!' });
		}
		const date1 = new Date(date);
		const date2 = new Date();
		const year = date2.getFullYear() - date1.getFullYear();

		if (year < 4) {
			return res.status(403).json({ message: 'Ошибка: неверная дата рождения!' });
		}

		return next();
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'Во время проверки даты рождения произошла ошибка' });
	}
};
