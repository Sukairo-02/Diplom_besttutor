const User = require('../../models/User')
const Teacher = require('../../models/Teacher')
const Subjects = require('../../models/Subjects')
const Assignments = require('../../models/Assignments')
const Courses = require('../../models/Courses')
const { validationResult } = require('express-validator')
const config = require('config')
const e = require('express')

function getMaxDate(a) {
	new Date(Math.max(...a.map((e) => new Date(e.MeasureDate))))
}

function getMinDate(a) {
	let minDate = a[0]
	a.forEach((el) => {
		if (el.getTime() < minDate.getTime()) {
			minDate = el
		}
	})
	return minDate
}

var isDate = function (date) {
	return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date))
}

function shuffle(array) {
	let counter = array.length

	while (counter > 0) {
		let index = Math.floor(Math.random() * counter)

		counter--
		let temp = array[counter]

		array[counter] = array[index]
		array[index] = temp
	}

	return array
}

class schoolController {
	async initSubjects(req, res) {
		//dev route, to be removed in production
		try {
			const { subjects } = req.body
			subjects.forEach(async (el) => {
				const subject = await Subjects.findOne({ name: el })
				if (!subject) {
					const newSub = new Subjects({ name: el })
					await newSub.save()
				}
			})

			return res.json({ message: 'Subjects initialized succesfully!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to initialize subjects!',
			})
		}
	}

	async getSubjects(req, res) {
		try {
			const subjects = await Subjects.find()
			return res.json({ subjects })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to get subjects!',
			})
		}
	}

	async courses(req, res) {
		try {
			const { id } = req.user
			const teacher = await Teacher.findOne({ src: id })
			if (!teacher) {
				return res.status(403).json({ message: 'Error: invalid ID' })
			}

			const coursesRaw = await Courses.find({
				_id: { $in: teacher.courses },
			})

			let courses = []
			coursesRaw.forEach((e) => {
				courses.push({
					_id: e._id,
					teacher: e.teacher,
					subject: e.subject,
					title: e.title,
					desc: e.desc,
					students: e.students,
					isPublished: e.isPublished,
					isBlocked: e.isBlocked,
					price: e.price,
					chatroomID: e.chatroomID,
					lessons: e.lessons,
					assignments: e.assignments,
					chatroom: e.chatroom,
				})
			})

			for (let i = 0; i < courses.length; i++) {
				courses[i].usersdata = []
				for (let j = 0; j < courses[i].students.length; j++) {
					const student = await User.findOne({
						_id: courses[i].students[j],
					})
					if (!student) {
						return res
							.status(403)
							.json({ message: 'Error: invalid User id' })
					}
					courses[i].usersdata[j] = {
						id: student._id,
						avatar: student.avatar,
						username: student.username,
						email: student.email,
					}
				}
			}

			return res.json({ courses })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to get courses!',
			})
		}
	}

	async coursesByID(req, res) {
		try {
			const { id } = req.params
			const teacher = await Teacher.findOne({ src: id })
			if (!teacher) {
				return res.status(403).json({ message: 'Error: invalid ID' })
			}

			const courses = await Courses.find({
				_id: { $in: teacher.courses },
			})
			return res.json({ courses })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to get courses!',
			})
		}
	}

	async usercourses(req, res) {
		try {
			const { id } = req.user
			const user = await User.findOne({ _id: id })
			if (!user) {
				return res.status(403).json({ message: 'Error: invalid ID' })
			}

			let ids = []
			user.courses.forEach((e) => {
				ids.push(e.id)
			})

			const courses = await Courses.find({ _id: { $in: ids } })
			return res.json({ courses })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to get courses!',
			})
		}
	}

	async usercoursesID(req, res) {
		try {
			const { id } = req.params
			const user = await User.findOne({ _id: id })
			if (!user) {
				return res.status(403).json({ message: 'Error: invalid ID' })
			}

			let ids = []
			user.courses.forEach((e) => {
				ids.push(e.id)
			})

			const courses = await Courses.find({ _id: { $in: ids } })
			return res.json({ courses })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to get courses by ID!',
			})
		}
	}

	async coursedata(req, res) {
		try {
			const { id } = req.params
			const course = await Courses.findOne({ _id: id })
			if (!course) {
				return res.status(403).json({ message: 'Error: invalid ID' })
			}

			return res.json({ course })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: "Error: failed to get course's data!",
			})
		}
	}

	async newcourse(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Creation error!', errors })
			}

			const { id: teacher } = req.user
			const { title, desc, price } = req.body
			if (!Number.isInteger(price) || price < 0) {
				return res
					.status(403)
					.json({ message: 'Error: price must be positive integer!' })
			}

			const { subject } = req.dbTeacher

			const candidate = new Courses({
				teacher,
				subject,
				title,
				desc,
				price,
			})

			await candidate.save()
			await req.dbTeacher.courses.push(candidate._id)
			await req.dbTeacher.save()

			return res
				.status(201)
				.json({ message: 'Course created succesfully!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to create course!',
			})
		}
	}

	async editcourse(req, res) {
		try {
			const course = req.course
			const { title, desc, price } = req.body
			if (price != undefined) {
				if (!Number.isInteger(price) || price < 0) {
					return res.status(403).json({
						message: 'Error: price must be positive integer!',
					})
				}
				course.price = price
			}

			if (title) {
				course.title = title
			}

			course.desc = desc

			await course.save()
			return res
				.status(201)
				.json({ message: 'Course has been succesfully edited!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to edit course!',
			})
		}
	}

	async editprice(req, res) {
		try {
			const course = req.course
			const { price } = req.body
			if (!Number.isInteger(price) || price < 0) {
				return res
					.status(403)
					.json({ message: 'Error: price must be positive integer!' })
			}

			course.price = price

			await course.save()
			return res.status(201).json({
				message: "Course's price has been succesfully edited!",
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to change price!',
			})
		}
	}

	async deletecourse(req, res) {
		try {
			const course = req.course
			const teacher = await Teacher.findOne({ src: course.teacher })
			await teacher.courses.pull(course._id)
			await course.delete()
			await teacher.save()
			return res
				.status(201)
				.json({ message: 'Course deleted succesfully!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to delete course!',
			})
		}
	}

	async newlesson(req, res) {
		try {
			const course = req.course //database object of targeted course, parsed in ensureOwner middleware
			//send course's _id in field 'courseID'
			const { date, endDate, location } = req.body //if lesson is online, location can be left empty
			if (!(isDate(date) && isDate(endDate))) {
				return res.status(403).json({ message: 'Error: invalid date!' })
			}

			const d1 = new Date(date)
			const d2 = new Date(endDate)
			const now = new Date()

			if (d1.getTime() < now.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message: "Error: lesson can't be set in the past!",
				})
			}

			if (d1.getTime() > d2.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message:
						"Error: date of end can't be less than date of beginning!",
				})
			}

			let isOverlap = false
			course.lessons.forEach((e) => {
				if (
					(d1.getTime() > e.date.getTime() &&
						d1.getTime() < e.endDate.getTime()) ||
					d1.getTime() === e.date.getTime() ||
					d1.getTime() === e.endDate.getTime() ||
					(d2.getTime() > e.date.getTime() &&
						d2.getTime() < e.endDate.getTime()) ||
					d2.getTime() === e.date.getTime() ||
					d2.getTime() === e.endDate.getTime()
				) {
					isOverlap = true
					return
				}
			})
			if (isOverlap) {
				return res.status(403).json({
					message: 'Error: lesson dates overlap!',
				})
			}

			if (location) {
				await course.lessons.push({ date, endDate, location })
			} else {
				await course.lessons.push({ date, endDate })
			}
			await course.save()

			return res.json({ message: 'Lesson added succesfully!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to create lesson!',
			})
		}
	}

	async dellesson(req, res) {
		try {
			const course = req.course
			const { lessonID: _id } = req.body

			if (!_id) {
				return res
					.status(403)
					.json({ message: 'Error: empty lesson id!' })
			}

			await course.lessons.pull({ _id })
			await course.save()

			return res.json({ message: 'Lesson deleted succesfully!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to delete lesson!',
			})
		}
	}

	async publishcourse(req, res) {
		try {
			const course = req.course
			if (!course.lessons.length) {
				return res.json({ message: 'You must add lessons first!' })
			}
			course.isPublished = true
			await course.save()
			return res.json({ message: 'Course has been published!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to publish course!',
			})
		}
	}

	async blockcourse(req, res) {
		try {
			const course = req.course
			course.isBlocked = true
			await course.save()
			return res.json({ message: 'Course has been blocked!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to block course!',
			})
		}
	}

	async unblockcourse(req, res) {
		try {
			const course = req.course
			course.isBlocked = false
			await course.save()
			return res.json({ message: 'Course has been unblocked!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to unblock course!',
			})
		}
	}

	async subscribe(req, res) {
		try {
			const { id } = req.user
			const user = await User.findOne({ _id: id })
			if (!user) {
				return res.status(403).json({ message: 'Error: invalid user!' })
			}

			const dbTarget = req.course
			if (id === dbTarget.teacher) {
				return res.status(403).json({
					message: "Error: you can't subscribe to your own course!",
				})
			}

			let isSubbed = false
			user.courses.forEach((el) => {
				if (el.id === dbTarget.id) {
					isSubbed = true
					return
				}
			})

			if (isSubbed) {
				return res.status(403).json({
					message:
						'Error: you are already subscribed to this course!',
				})
			}

			if (user.balance < dbTarget.price) {
				return res
					.status(403)
					.json({ message: 'Error: insufficient balance!' })
			}

			const teacher = await User.findOne({ _id: dbTarget.teacher })
			if (!teacher) {
				return res
					.status(403)
					.json({ message: "Error: can't find course's teacher!" })
			}

			teacher.balance = teacher.balance + dbTarget.price
			user.balance = user.balance - dbTarget.price

			await teacher.save()
			await dbTarget.students.push(user._id)
			await dbTarget.save()
			await user.courses.push({ id: dbTarget._id, price: dbTarget.price })
			await user.save()

			return res.json({
				message: 'You have succesfully subscribed to this course!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to subscribe to course!',
			})
		}
	}

	async unsubscribe(req, res) {
		try {
			const { id } = req.params
			const { id: userId } = req.user
			if (!id) {
				return res
					.status(403)
					.json({ message: "You must specify course's id!" })
			}

			const course = await Courses.findOne({ _id: id })
			if (!course) {
				return res
					.status(403)
					.json({ message: 'Error: invalid course!' })
			}

			const student = await User.findOne({ _id: userId })
			let studCourse
			student.courses.forEach((e) => {
				if (e.id === id) {
					studCourse = e
					return
				}
			})

			if (!studCourse) {
				return res
					.status(403)
					.json({ message: "Error: you didn't subscribe to this!" })
			}

			const teacher = await User.findOne({ _id: course.teacher })
			if (!teacher) {
				return res.status(403).json({
					message: "Error: can't find teacher of the course!",
				})
			}

			let dates = []
			course.lessons.forEach((e) => {
				dates.push(e.date)
			})
			let now = new Date()
			const minDate = getMinDate(dates)

			if (
				minDate.getTime() < now.getTime() ||
				minDate.getTime() === now.getTime()
			) {
				return res.status(403).json({
					message:
						'Error: too late to unsubscribe! Try requesting refund from a teacher.',
				})
			}

			const price = studCourse.price
			await course.students.pull(userId)
			await student.courses.pull(studCourse)
			student.balance += price
			teacher.balance -= price

			await course.save()
			await student.save()
			await teacher.save()
			return res.json({
				message: 'You have succesfully unsubscribed from this course!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to unsubscribe from course!',
			})
		}
	}

	async refund(req, res) {
		try {
			const course = req.course
			const id = course._id

			const students = await User.find({ _id: { $in: course.students } })
			if (!students) {
				return res.json({
					message: 'Error: course already has no subscribers!',
				})
			}

			const teacher = await User.findOne({ _id: course.teacher })
			if (!teacher) {
				return res.status(403).json({
					message: "Error: can't find teacher of the course!",
				})
			}

			students.forEach(async (e) => {
				let eCourse
				e.courses.forEach(async (el) => {
					if (el.id === id.toString()) {
						eCourse = el
						return
					}
				})
				if (eCourse) {
					const price = eCourse.price
					await course.students.pull(e._id)
					await e.courses.pull(eCourse)
					e.balance += price
					teacher.balance -= price
					await e.save()
				}
			})

			await course.save()
			await teacher.save()
			return res.json({
				message:
					'You have succesfully refunded all users for this course!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to refund users for course!',
			})
		}
	}

	async refundID(req, res) {
		try {
			const course = req.course
			const id = course._id
			const { id: studID } = req.params

			const student = await User.findOne({ _id: studID })
			if (!student) {
				return res.json({ message: 'Error: invalid id!' })
			}

			const teacher = await User.findOne({ _id: course.teacher })
			if (!teacher) {
				return res.status(403).json({
					message: "Error: can't find teacher of the course!",
				})
			}

			let eCourse
			student.courses.forEach(async (el) => {
				if (el.id === id.toString()) {
					eCourse = el
				}
			})

			if (!eCourse) {
				return res.status(403).json({
					message: "Error: can't find course in user's document!",
				})
			}

			const price = eCourse.price
			await course.students.pull(studID)
			await student.courses.pull(eCourse)
			student.balance += price
			teacher.balance -= price

			await student.save()
			await course.save()
			await teacher.save()
			return res.json({
				message: 'You have succesfully refunded users for this course!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to refund user for course!',
			})
		}
	}

	async review(req, res) {
		try {
			const { id } = req.user
			const { teacher, rating, text } = req.body //teacher's 'src' field/teacher's user id field

			if (id === teacher) {
				return res.status(403).json({
					message:
						"Error: you can't leave reviews on your own profile!",
				})
			}

			if (
				!rating ||
				!Number.isInteger(rating) ||
				rating > 10 ||
				rating < 0
			) {
				return res
					.status(403)
					.json({ message: 'Error: invalid rating!' })
			}

			const target = await Teacher.findOne({ src: teacher })
			if (!target) {
				return res
					.status(403)
					.json({ message: "Error: invalid teacher's id!" })
			}

			let old
			target.reviews.forEach(async (e) => {
				if (e.author === id) {
					old = e
					return
				}
			})

			if (old) {
				old.rating = rating
				old.text = text
				await target.save()
				return res
					.status(201)
					.json({ message: 'Review succesfully changed!' })
			}

			await target.reviews.push({ author: id, rating, text })
			await target.save()
			return res
				.status(201)
				.json({ message: 'Review succesfully published!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to leave a review!' })
		}
	}

	async delreview(req, res) {
		try {
			const { id } = req.user
			const { teacher } = req.body //teacher's 'src' field/teacher's user id field

			const target = await Teacher.findOne({ src: teacher })
			if (!target) {
				return res
					.status(403)
					.json({ message: "Error: invalid teacher's id!" })
			}

			let old
			target.reviews.forEach(async (e) => {
				if (e.author === id) {
					old = e
					return
				}
			})

			if (!old) {
				return res
					.status(403)
					.json({ message: 'Error: review not found!' })
			}

			await target.reviews.pull(old)
			await target.save()
			return res
				.status(201)
				.json({ message: 'Review succesfully deleted!' })
		} catch (e) {
			return res.status(500).json({
				message: 'Error: failed to delete a review!',
			})
		}
	}

	async newassignment(req, res) {
		try {
			const course = req.course
			const {
				title,
				desc,
				isShuffled,
				allowOvertime,
				date,
				endDate,
				questions,
			} = req.body
			if (!(title && questions.length > 0)) {
				return res
					.status(500)
					.json({ message: 'Error: insufficient data!' })
			}

			const d1 = new Date(date)
			const d2 = new Date(endDate)
			const now = new Date()

			if (d1.getTime() < now.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message: "Error: assignment can't be set in the past!",
				})
			}

			if (d1.getTime() > d2.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message:
						"Error: date of end can't be less than date of beginning!",
				})
			}

			let [isTitles, isPoints, isAnswers, isMulviol] = [
				false,
				false,
				false,
				false,
			]
			let maxPoints = 0
			questions.forEach((e) => {
				if (!e.title) {
					isTitles = true
					return
				}

				if (!e.points) {
					isPoints = true
					return
				}

				if (!Number.isInteger(e.points) || e.points < 0) {
					isPoints = true
					return
				}

				maxPoints += e.points

				if (!e.answers) {
					isAnswers = true
					return
				}

				let hasAnswers = false
				let trueAmt = 0
				let answAmount = 0
				e.answers.forEach((el) => {
					if (!el.text) {
						isTitles = true
						return
					}

					if (el.isTrue) {
						hasAnswers = true
						trueAmt++
					}

					answAmount++
				})

				if (!e.isMulAnswers && trueAmt > 1) {
					isMulviol = true
					return
				}

				if (answAmount < 2) {
					isAnswers = true
					return
				}

				if (!hasAnswers) {
					isAnswers = true
					return
				}
			})

			if (isMulviol) {
				return res.status(403).json({
					message:
						"Single answer questions can't have multiple true answers!",
				})
			}

			if (isTitles) {
				return res.status(403).json({
					message: 'All questions and answers must have a title!',
				})
			}

			if (isPoints) {
				return res.status(403).json({
					message:
						'All questions must have positive integer amount of points!',
				})
			}

			if (isAnswers) {
				return res.status(403).json({
					message: 'All questions must have at least 2 answers!',
				})
			}

			const assignment = new Assignments({
				title,
				desc,
				isShuffled,
				allowOvertime,
				maxPoints,
				date,
				endDate,
				questions,
			})

			assignment.questions.forEach((e) => {
				e.qID = e._id
				e.answers.forEach((el) => {
					el.nID = el._id
				})
			})

			await assignment.save()
			await course.assignments.push(assignment._id)
			await course.save()

			return res.json({
				message: 'Assignment has been added succesfully!',
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to add assignment!' })
		}
	}

	async delassignment(req, res) {
		try {
			const { assignmentID } = req.body
			const { id } = req.user

			const assignment = await Assignments.findOne({ _id: assignmentID })
			if (!assignment) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			if (course.teacher !== id) {
				return res
					.status(403)
					.json({ message: "You don't own this course!" })
			}

			await course.assignments.pull(assignmentID)
			await assignment.delete()
			await course.save()

			return res.json({ message: 'Assignment deleted succesfully!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to delete assignment!' })
		}
	}

	async getassignment(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body

			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			let isSubbed = false
			course.students.forEach((e) => {
				if (e === id) {
					isSubbed = true
					return
				}
			})
			if (!isSubbed) {
				return res
					.status(403)
					.json({ message: 'You are not subscribed to this course!' })
			}

			const {
				_id,
				title,
				desc,
				isShuffled,
				allowOvertime,
				maxPoints,
				date,
				endDate,
			} = asg

			let questions = []

			asg.questions.forEach((e) => {
				let answers = []
				e.answers.forEach((el) => {
					answers.push({ nID: el.nID, text: el.text })
				})
				questions.push({
					title: e.title,
					qID: e.qID,
					points: e.points,
					isMulAnswers: e.isMulAnswers,
					answers,
				})
			})

			if (isShuffled) {
				questions.forEach((e) => {
					shuffle(e.answers)
				})
				shuffle(questions)
			}

			return res.json({
				_id,
				title,
				desc,
				isShuffled,
				allowOvertime,
				maxPoints,
				date,
				endDate,
				questions,
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to get assignment!' })
		}
	}

	async getassignment_teacher(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body

			const assignment = await Assignments.findOne({ _id: assignmentID })
			if (!assignment) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			if (course.teacher !== id) {
				return res
					.status(403)
					.json({ message: "You are not this course's teacher!" })
			}

			return res.json({
				assignment,
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to get assignment!' })
		}
	}

	async getAssignmentSchedule(req, res) {
		try {
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to add assignment!' })
		}
	}

	async submit(req, res) {
		try {
			const { id } = req.user
			const { assignmentID, questions } = req.body

			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			let now = new Date().getTime()
			let dateStart = new Date(asg.date).getTime()
			let dateEnd = new Date(asg.date).getTime()

			if (now < dateStart) {
				return res
					.status(403)
					.json({ message: "Assignment didn't begin yet!" })
			}

			if (!asg.allowOvertime && now > dateEnd) {
				return res.status(403).json({
					message:
						"This assignment can't be submitted past it's end time!",
				})
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			let isSubbed = false
			course.students.forEach((e) => {
				if (e === id) {
					isSubbed = true
					return
				}
			})

			if (!isSubbed) {
				return res
					.status(403)
					.json({ message: 'You are not subscribed to this course!' })
			}

			let qLeft = asg.questions.length 
			let points = 0
			for (let i = 0; i < asg.questions.length; i++) {
				for (let j = 0; j < questions.length; j++) {
					if (asg.questions[i].qID === questions[j].qID) {

						questions[j].title = asg.questions[i].title
						questions[j].points = asg.questions[i].points

						let ansCnt = 0
						let corAnsCnt = 0
						let isMul = asg.questions[i].isMulAnswers

						for (let n = 0; n < asg.questions[i].answers.length; n++) {
							for (let m = 0; m < asg.questions[i].answers.length; m++) {
								if (asg.questions[i].answers[n].nID === questions[j].answers[m].nID) {
									questions[j].answers[m].text =
										asg.questions[i].answers[n].text
									questions[j].answers[m].isCorrect =
										asg.questions[i].answers[n].isTrue ==
										questions[j].answers[m].isChecked
									corAnsCnt +=
										questions[j].answers[m].isCorrect 
									ansCnt +=
										questions[j].answers[m].isChecked
								}
							}
						}

						if (!ansCnt) {
							return res.status(403).json({
								message:
									'Each question must have at least 1 answer!',
							})
						}

						if (!isMul && ansCnt > 1) {
							console.log(questions[j].answers, ansCnt, corAnsCnt)
							return res.status(403).json({
								message:
									"Error: single answer question can't have multiple answers!",
							})
						}

						questions[j].isCorrect = asg.questions[i].answers.length == corAnsCnt
						if (questions[j].isCorrect) {
							points += asg.questions[i].points
						}
						console.log(asg.questions[i].answers.length)
						console.log(corAnsCnt)

						qLeft--
					}
				}
			}

			if (qLeft) {
				return res
					.status(403)
					.json({ message: 'You must answer every question!' })
			}

			let oldSubmit
			asg.submits.forEach((e) => {
				if (e.submitter === id) {
					oldSubmit = e
				}
			})

			if (oldSubmit) {
				asg.submits.pull(oldSubmit)
			}

			asg.submits.push({ submitter: id, points, questions })
			await asg.save()
			return res
				.status(201)
				.json({ message: 'Assignment submitted succesfully!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to submit assignment!' })
		}
	}

	async delsubmit(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body
			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			if (!asg.submits) {
				return res
					.status(403)
					.json({ message: 'There are no submitted assignments.' })
			}

			let submit
			asg.submits.every((e) => {
				if (e.submitter === id) {
					submit = e.submitter
					return false
				}
				return true
			})

			if (!submit) {
				return res.status(403).json({
					message: "You didn't submit answers to this assignment!",
				})
			}

			asg.submits.pull(submit)

			await asg.save()

			return res.json({ submit })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to delete submitted assignment!',
			})
		}
	}

	async getsubmit(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body
			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			if (!asg.submits) {
				return res
					.status(403)
					.json({ message: 'There are no submitted assignments.' })
			}

			let submit
			asg.submits.every((e) => {
				if (e.submitter === id) {
					submit = e
					return false
				}
				return true
			})

			if (!submit) {
				return res.status(403).json({
					message: "You didn't submit answers to this assignment!",
				})
			}

			return res.json({ submit })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to get submitted assignment!' })
		}
	}

	async getSubmitTeacher(req, res) {
		try {
			const { id } = req.user
			const { assignmentID, submitterID } = req.body

			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			if (!asg.submits) {
				return res
					.status(403)
					.json({ message: 'There are no submitted assignments.' })
			}

			const course = await Courses.findOne({ assignments: asg._id })

			if (!course) {
				return res
					.status(403)
					.json({ message: "Can't find assignment's course!" })
			}

			if (course.teacher !== id) {
				return res
					.status(403)
					.json({ message: "You are not this course's teaher!" })
			}

			let submit
			asg.submits.every((e) => {
				if (e.submitter === submitterID) {
					submit = e
					return false
				}
				return true
			})

			if (!submit) {
				return res.status(403).json({
					message: "User didn't submit answers to this assignment!",
				})
			}

			return res.json({ submit })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error: failed to get submitted assignment!' })
		}
	}

	async getstatistic(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body

			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res
					.status(403)
					.json({ message: "Can't find assignment!" })
			}

			if (!asg.submits) {
				return res.status(403).json({
					message:
						'There are no submitted assignments to show statistics of.',
				})
			}

			const course = await Courses.findOne({ assignments: asg._id })

			if (!course) {
				return res
					.status(403)
					.json({ message: "Can't find assignment's course!" })
			}

			if (course.teacher !== id) {
				return res
					.status(403)
					.json({ message: "You are not this course's teaher!" })
			}

			let statistics = {
				best_students: [],
				hardest_questions: []
			}
			for (let i = 0; i < asg.submits.length; i++) {
				let submit = asg.submits[i]

				let student = await User.findOne({ _id: submit.submitter })
				if (!student) {
					return res.status(403).json({
						message: 'Found submit from non-existing student!',
					})
				}
				statistics.best_students[i] = {
					points: submit.points,
					_id: student._id,
					username: student.username,
					avatar: student.avatar,
					email: student.email,
				}
				for (let j = 0; j < submit.questions.length; j++) {
					let question = submit.questions[j]

					let existsHQ = -1
					for (let n = 0; n < statistics.hardest_questions; n++) {
						if (
							statistics.hardest_questions[n].qID === question.qID
						) {
							existsHQ = n
							break
						}
					}

					if (existsHQ > -1) {
						statistics.hardest_questions[i].correct_answers +=
							question.isCorrect
						for (
							let n = 0;
							statistics.hardest_questions[i].answers.length;
							n++
						) {
							for (let m = 0; m < question.answers.length; m++) {
								if (
									statistics.hardest_questions[i].answers[n]
										.nID !== question.answers[m].nID
								) {
									continue
								}

								statistics.hardest_questions[i].answers[
									n
								].picked += question.answers[m].isChecked
							}
						}
					} else {
						let answers = []
						for (let n = 0; n < question.answers.length; n++) {
							let cAnswer = question.answers[n]
							answers[n] = {
								text: cAnswer.text,
								nID: cAnswer.nID,
								isTrue: cAnswer.isChecked == cAnswer.isCorrect,
								picked: 0 + cAnswer.isChecked,
							}
						}
						statistics.hardest_questions[
							statistics.hardest_questions.length
						] = {
							title: question.title,
							qID: question.qID,
							correct_answers: 0 + question.isCorrect,
							points: question.points,
							answers,
						}
					}
				}
			}

			statistics.best_students.sort((a, b) => {
				return a.points < b.points ? 1 : a.points > b.points ? -1 : 0
			})

			statistics.hardest_questions.sort((a, b) => {
				return a.correct_answers > b.correct_answers
					? 1
					: a.correct_answers < b.correct_answers
					? -1
					: 0
			})

			statistics.hardest_questions.forEach((e) => {
				e.answers.sort((a, b) => {
					return a.picked < b.picked
						? 1
						: a.picked > b.picked
						? -1
						: 0
				})
			})

			return res.json({ statistics })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error: failed to get statistics of assignment!',
			})
		}
	}
}

//statistics: Users by points, questions by ansers

module.exports = new schoolController()
