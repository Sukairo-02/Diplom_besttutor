const Router = require('express')
const router = new Router()
const controller = require('./classes/authClass')
const {check} = require('express-validator')
const authMidware = require('./midware/ensureAuth')
const roleMidware = require('./midware/ensureRoles')

// router.post('/registration', [
//     check('username', "Username can't be empty!").notEmpty(),
//     check('password', "Password must have length of 4-24 symbols").isLength({min: 4, max: 24}),
                    
// ], controller.registration)

// router.post('/login', controller.login)

// router.get('/users', roleMidware(['USER', 'ADMIN']), controller.getUsers)

module.exports = router