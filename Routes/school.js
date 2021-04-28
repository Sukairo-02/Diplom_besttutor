const Router = require('express');
const router = new Router();
const controller = require('./classes/schoolClass');
const { check } = require('express-validator');
const ensureRoles = require('./midware/ensureRoles');
const ensureAuth = require('./midware/ensureAuth');
const ensureDate = require('./midware/ensureDate');
const ensureReftoken = require('./midware/ensureReftoken');
const ensureMatchtokens = require('./midware/ensureMatchtokens');



module.exports = router;