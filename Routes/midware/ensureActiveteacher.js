// SHOULD ONLY BE USED AFTER ensureRoles(['TCHR'...])
const Teacher = require('../../Models/Teacher');

module.exports = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const candidate = await Teacher.findOne({ src: req.user.id });
		if (!candidate) {
			return res.status(403).json({ message: 'Ошибка: несуществующий учитель!' });
		}

		if (!candidate.isActive) {
			return res.status(403).json({
				message: 'Ошибка: сначала заполните свои учительские данные!',
			});
		}

		req.dbTeacher = candidate;
		return next();
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'Во время получения учительских данных произошла ошибка' });
	}
};
