const Router = require('express')
const router = new Router()
const controller = require('./classes/schoolClass')
const { check } = require('express-validator')
const ensureRoles = require('./midware/ensureRoles')
const ensureAuth = require('./midware/ensureAuth')
const ensureActiveteacher = require('./midware/ensureActiveteacher')
const ensureOwner = require('./midware/ensureOwner')
const ensureUnblocked = require('./midware/ensureUnblocked')
const ensurePublished = require('./midware/ensurePublished')
const ensureUnpublished = require('./midware/ensureUnpublished')

router.post('/initSubjects', controller.initSubjects)

router.get('/getSubjects', controller.getSubjects)

router.get('/courses/', [ensureRoles(['TCHR'])], controller.courses) //get array of courses of current user (as teacher)

router.get('/courses/:id', controller.coursesByID) //get array of courses of teacher with src = id

router.get('/usercourses/', ensureAuth, controller.usercourses) //get array of courses of current user (as student)

router.get('/usercourses/:id', controller.usercoursesID) //get array of user's courses by his ID

router.get('/coursedata/:id', controller.coursedata) //gets data of course by it's ID

router.post(
	'/newcourse',
	[
		ensureRoles(['TCHR']),
		ensureActiveteacher,
		check('title', "You must enter course's title!").notEmpty(),
	],
	controller.newcourse
) //adds new course of current user if user is teacher

router.post(
	'/editcourse',
	[
		check('title', "You must enter course's title!").notEmpty(),
		ensureRoles(['TCHR']),
		ensureActiveteacher,
		ensureOwner,
	],
	controller.editcourse
) //edits existing course with [_id: courseID]

router.post(
	'/newlesson',
	[
		ensureRoles(['TCHR']),
		ensureActiveteacher,
		ensureOwner,
		ensureUnpublished,
	],
	controller.newlesson
) //adds new lesson to the course if user is teacher and owns course

router.delete(
	'/dellesson',
	[
		ensureRoles(['TCHR']),
		ensureActiveteacher,
		ensureOwner,
		ensureUnpublished,
	],
	controller.dellesson
) //deletes lesson by it's ID (lessonID)

router.post(
	'/subscribe/:id',
	[ensureAuth, ensureUnblocked, ensurePublished],
	controller.subscribe
) //subscribes current user to course with [_id: id]

router.post('/unsubscribe/:id', ensureAuth, controller.unsubscribe) //subscribes current user to course with [_id: id]

router.post(
	'/refund/:id',
	[ensureRoles(['TCHR']), ensureActiveteacher, ensureOwner],
	controller.refundID
) //refund to a student of course with [_id: id]

router.post(
	'/refund',
	[ensureRoles(['TCHR']), ensureActiveteacher, ensureOwner],
	controller.refund
) //refund to all students of course [_id: courseID]

router.post(
	'/blockcourse/',
	[ensureRoles(['TCHR']), ensureActiveteacher, ensureOwner],
	controller.blockcourse
) //block course with [_id: courseID]

router.post(
	'/unblockcourse/',
	[ensureRoles(['TCHR']), ensureActiveteacher, ensureOwner],
	controller.unblockcourse
) //unblock course with [_id: courseID]

router.post(
	'/publishcourse/',
	[ensureRoles(['TCHR']), ensureActiveteacher, ensureOwner],
	controller.publishcourse
) //publish course with [_id: courseID]

router.delete(
	'/deletecourse/',
	[
		ensureRoles(['TCHR']),
		ensureActiveteacher,
		ensureOwner,
		ensureUnpublished,
	],
	controller.deletecourse
) //delete unpublished course with [_id: courseID]

router.post('/review', ensureAuth, controller.review) //publish review

router.delete('/delreview', ensureAuth, controller.delreview) //delete review

module.exports = router
