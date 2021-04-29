const Router = require('express')
const router = new Router()
const controller = require('./classes/authClass')
const { check, oneOf } = require('express-validator')
const ensureRoles = require('./midware/ensureRoles')
const ensureAuth = require('./midware/ensureAuth')
const ensureDate = require('./midware/ensureDate')
const ensureReftoken = require('./midware/ensureReftoken')
const ensureMatchtokens = require('./midware/ensureMatchtokens')

router.post(
	'/register',
	[
		check('email', 'Invalid email!').isEmail(),
		check('username', 'You must enter a username!').notEmpty(),
		check(
			'password',
			'Password must have length between 4 and 24 characters!'
		).isLength({ min: 4, max: 24 }),
		ensureDate,
	],
	controller.register
)

router.post(
	'/login',
	[
		check('email', 'Invalid email!').isEmail(),
		check(
			'password',
			'Password must have length between 4 and 24 characters!'
		).isLength({ min: 4, max: 24 }),
	],
	controller.login
)

router.delete(
	'/logout',
	[ensureAuth, ensureReftoken, ensureMatchtokens],
	controller.logout
)

router.post(
	'/edit',
	[
		check('username', 'You must enter a username!').notEmpty(),
		oneOf(
			[check('phone').isEmpty(), check('phone').isMobilePhone()],
			'Unable to parse phone number.'
		),
		ensureAuth,
		ensureDate,
	],
	controller.edit
)

router.post(
	'/editteacher',
	[
		check('desc','You must write your description!').notEmpty(),
		check('education', 'You must specify your education!').notEmpty(),
		check('experience', 'Write something about your job or experience!').notEmpty(), 
		ensureRoles(['TCHR']),
	], //subject will be checked in function.
	controller.editteacher
)

router.post('/initroles', controller.initRoles)

router.get('/userdata', ensureAuth, controller.userdata)

router.get('/lightdata', ensureAuth, controller.lightdata)

router.get('/userdataID/:id', controller.userdataID) //same but full data

router.get('/lightdataID/:id', controller.lightdataID) //get data by user's id

router.get('/userlist/:role', controller.userlist) //get list of users by their role ("TCHR"/"USER").

router.get('/userlist/', controller.userlist) //Returns full list of users if role is not specified.

router.post('/token', ensureReftoken, controller.token)

router.delete(
	'/killIntruders',
	[ensureAuth, ensureReftoken, ensureMatchtokens],
	controller.killIntruders
)

router.post('/sendValidation', controller.sendValidation)

router.get('/verify/:token', controller.verifyEmail)

router.post('/sendResPassword', controller.sendRestorationEmail)

router.post(
	'/restorePass',
	[
		check(
			'password',
			'Password must have length between 4 and 24 characters!'
		).isLength({ min: 4, max: 24 }),
	],
	controller.restorePass
)

module.exports = router
