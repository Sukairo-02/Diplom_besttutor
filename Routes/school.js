const Router = require('express')
const router = new Router()
const controller = require('./classes/schoolClass')
const { check } = require('express-validator')
const ensureRoles = require('./midware/ensureRoles')
const ensureAuth = require('./midware/ensureAuth')
const ensureActiveteacher = require('./midware/ensureActiveteacher')

router.post('/initSubjects', controller.initSubjects)

router.get('/getSubjects', controller.getSubjects)

module.exports = router
