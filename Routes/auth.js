const Router = require('express');
const { check, oneOf } = require('express-validator');
const ensureRoles = require('./midware/ensureRoles');
const ensureAuth = require('./midware/ensureAuth');
const ensureDate = require('./midware/ensureDate');
const ensureReftoken = require('./midware/ensureReftoken');
const ensureMatchtokens = require('./midware/ensureMatchtokens');

const controller = require('./classes/authClass');

const router = new Router();

router.post(
	'/register',
	[
		check('email', 'Invalid email!').isEmail(),
		check('username', 'You must enter a username!').notEmpty(),
		check('password', 'Пароль должен иметь размер от 4 до 24 символов!').isLength({ min: 4, max: 24 }),
		ensureDate,
	],
	controller.register
);

router.post(
	'/login',
	[
		check('email', 'Invalid email!').isEmail(),
		check('password', 'Пароль должен иметь размер от 4 до 24 символов!').isLength({ min: 4, max: 24 }),
	],
	controller.login
);

router.delete('/logout', [ensureAuth, ensureReftoken, ensureMatchtokens], controller.logout);

router.post(
	'/edit',
	[
		check('username', 'Вы должны ввести имя пользователя!').notEmpty(),
		oneOf([check('phone').isEmpty(), check('phone').isMobilePhone()], 'Невозможно распознать номер телефона'),
		ensureAuth,
		ensureDate,
	],
	controller.edit
);

router.post(
	'/editteacher',
	[
		check('desc', 'Вы должны заполнить описание!').notEmpty(),
		check('education', 'Укажите образование!').notEmpty(),
		check('experience', 'Укажите работу\\опыт!').notEmpty(),
		ensureRoles(['TCHR']),
	], // subject will be checked in function.
	controller.editteacher
);

router.post('/initroles', controller.initRoles);

router.get('/userdata', ensureAuth, controller.userdata);

router.get('/lightdata', ensureAuth, controller.lightdata);

router.get('/lightdataID/:id', controller.lightdataID); // get data by user's id

router.get('/userdataID/:id', controller.userdataID); // same but full data

router.post('/userdataArr/', controller.userdataArr); // userdata by array of ids

router.post('/lightdataArr/', controller.lightdataArr); // lightdata by array of ids

router.get('/userlist/:role', controller.userlist); // get list of users by their role ("TCHR"/"USER").

router.get('/userlist/', controller.userlist); // Returns full list of users if role is not specified.

router.post('/token', ensureReftoken, controller.token);

router.delete('/killIntruders', [ensureAuth, ensureReftoken, ensureMatchtokens], controller.killIntruders);

router.post('/sendValidation', controller.sendValidation);

router.get('/verify/:token', controller.verifyEmail);

router.post('/sendResPassword', controller.sendRestorationEmail);

router.post(
	'/restorePass',
	[check('password', 'Пароль должен иметь размер от 4 до 24 символов!').isLength({ min: 4, max: 24 })],
	controller.restorePass
);

module.exports = router;
