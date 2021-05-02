const User = require('../../models/User')
const Teacher = require('../../models/Teacher')
const Role = require('../../models/Roles')
const Subjects = require('../../models/Subjects')
const Assignments = require('../../models/Assignments')
const Courses = require('../../models/Courses')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const config = require('config')

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

			const courses = await Courses.find({ id: { $in: user.courses } })
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

			const courses = await Courses.find({ id: { $in: user.courses } })
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
			if (!Number.isInteger(price) || price < 0) {
				return res
					.status(403)
					.json({ message: 'Error: price must be positive integer!' })
			}

			course.title = title
			course.desc = desc
			course.price = price

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
			console.log(dates)
			console.log(minDate)
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
}

module.exports = new schoolController()
