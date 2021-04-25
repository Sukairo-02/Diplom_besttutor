const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = async function (req, res, next) {
    try {
        if (!(req.user && req.refreshToken)) {
            return res.status(500).json({ message: "Error: can't find all needed tokens!"})
        }

        if(req.user.id !== req.refreshToken.id){
            return res.status(401).json({ message: "Error: mismatching tokens!"})
        }

        return next();
    } catch (e) {
        console.log(e)
        return res.status(401).json({ message: "Invalid refresh token." })
    }
}
