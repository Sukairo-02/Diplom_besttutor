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
		check('title', 'Вы должны ввести название курса!').notEmpty(),
	],
	controller.newcourse
) //adds new course of current user if user is teacher

router.post(
	'/editcourse',
	[
		check('title', 'Вы должны ввести название курса!').notEmpty(),
		ensureRoles(['TCHR']),
		ensureActiveteacher,
		ensureOwner,
		ensureUnpublished,
	],
	controller.editcourse
) //edits existing course with [_id: courseID]

router.post(
	'/editprice',
	[
		ensureRoles(['TCHR']),
		ensureActiveteacher,
		ensureOwner,
	],
	controller.editprice
) //edits existing course's price with [_id: courseID], available even if published

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

router.post('/newassignment', [ensureRoles(['TCHR']), ensureActiveteacher, ensureOwner], controller.newassignment) //add new assignment to the course: courseID

router.delete('/delassignment', [ensureRoles(['TCHR']), ensureActiveteacher, ensureOwner], controller.delassignment) //delete assignment with _id: assignmentID

router.post('/getassignment', ensureAuth, controller.getassignment) //get assignment with _id: assignmentID (for students)

router.post('/getassignment_teacher', ensureRoles(['TCHR']), controller.getassignment_teacher) //get assignment with _id: assignmentID (for teacher)

router.post('/submit', ensureAuth, controller.submit) //submit completed assignment with _id: assignmentID

router.delete('/delsubmit', ensureAuth, controller.delsubmit) //delete your submit of assignment with _id: assignmentID

router.post('/getsubmit', ensureAuth, controller.getsubmit) //get your results for assignment

router.post('/getsubmit_teacher', ensureRoles(['TCHR']), controller.getSubmitTeacher) //get assignment's results of user: submitterID

router.post('/getstatistic', ensureRoles(['TCHR']), controller.getstatistic) //get statistics for assignment with id: assignmentID - TO BE DONE

//router.get('/getassignmentschedule', ensureAuth, controller.getassignmentSchedule) //get info of upcoming assignments of current user - TO BE DONE

module.exports = router
