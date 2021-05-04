const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = async function (req, res, next) {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const { refreshToken: refToken } = req.body

        if (!refToken) {
            return res
                .status(403)
                .json({ message: "Error: invalid refresh token!" })
        }

        const decData = jwt.verify(refToken, config.get("server.refreshSecret"))
        req.refreshToken = decData
        return next();
    } catch (e) {
        console.log(e)
        return res.status(401).json({ message: "Invalid refresh token." })
    }
}
