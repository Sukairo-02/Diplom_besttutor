const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = async function (req, res, next) {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        if (!(req.user && req.refreshToken)) {
            return res.status(500).json({ message: "Ошибка: не найдены токены!"})
        }

        if(req.user.id !== req.refreshToken.id){
            return res.status(401).json({ message: "Ошибка: токены не совпадают!"})
        }

        return next();
    } catch (e) {
        console.log(e)
        return res.status(401).json({ message: "Токен возобновления не действителен" })
    }
}
