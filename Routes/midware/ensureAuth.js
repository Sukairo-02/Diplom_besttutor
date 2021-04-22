const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token)
        {
            return res
            .status(403)
            .json({message: "User unauthorized!"})
        }

        const decData = jwt.verify(token, config.get('server.secret'))
        req.user = decData
        next()
    } catch (e) {
        console.log(e)
        return res
        .status(403)
        .json({message: "Error occured!"})
    }
}