const nodemailer = require('nodemailer');
const config = require('config');

module.exports = nodemailer.createTransport({
	service: config.get('email.service'),
	auth: {
		user: config.get('email.address'),
		pass: config.get('email.password'),
	},
});
