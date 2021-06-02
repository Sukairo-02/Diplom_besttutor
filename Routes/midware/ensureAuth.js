const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		if (!req.headers.authorization) {
			return res.status(401).json({ message: 'Вы не авторизованы!' })
		}

		const token = req.headers.authorization.split(' ')[1]
		if (!token) {
			return res.status(401).json({ message: 'Вы не авторизованы!' })
		}

		const decData = jwt.verify(token, config.get('server.secret'))
		req.user = decData
		return next()
	} catch (e) {
		console.log(e)
		return res.status(401).json({ message: 'Токен не действительный!' })
	}
}
