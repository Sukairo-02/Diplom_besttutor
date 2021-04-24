const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (roles) {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            return next()
        }
    
        try {
            if (!req.headers.authorization) {
                return res
                .status(403)
                .json({message: "User unauthorized!"}) 
            }

            const token = req.headers.authorization.split(' ')[1]
            if (!token)
            {
                return res
                .status(403)
                .json({message: "User unauthorized!"})
            }
            
            const {roles: userRoles} = jwt.verify(token, config.get('server.secret'))
            let hasRole = false
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true
                }
            })

            if(!hasRole) {
                return res
                .status(403)
                .json({message: "User is missing required role!"})
            }

            return next()
        } catch (e) {
            console.log(e)
            return res
            .status(500)
            .json({message: "User unauthorized!"})
        }
    }
}