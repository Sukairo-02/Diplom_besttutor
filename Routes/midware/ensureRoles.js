const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (roles) => {
	return (req, res, next) => {
		if (req.method === 'OPTIONS') {
			return next();
		}

		try {
			if (!req.headers.authorization) {
				return res.status(401).json({ message: 'Ошибка: вы не авторизованы!' });
			}

			const token = req.headers.authorization.split(' ')[1];
			if (!token) {
				return res.status(401).json({ message: 'Ошибка: вы не авторизованы!' });
			}
			const decData = jwt.verify(token, config.get('server.secret'));
			const { roles: userRoles } = decData;
			let hasRole = false;
			userRoles.forEach((role) => {
				if (roles.includes(role)) {
					hasRole = true;
				}
			});

			if (!hasRole) {
				return res.status(403).json({ message: 'Ошибка: недостаточно прав!' });
			}

			req.user = decData;
			return next();
		} catch (e) {
			console.log(e);
			return res.status(401).json({ message: 'Ошибка: вы не авторизованы!' });
		}
	};
};
