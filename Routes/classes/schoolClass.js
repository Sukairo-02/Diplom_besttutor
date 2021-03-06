/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const { validationResult } = require('express-validator')
const User = require('../../Models/User')
const Teacher = require('../../Models/Teacher')
const Subjects = require('../../Models/Subjects')
const Assignments = require('../../Models/Assignments')
const Courses = require('../../Models/Courses')

function getMinDate(a) {
	let minDate = a[0]
	a.forEach((el) => {
		if (el.getTime() < minDate.getTime()) {
			minDate = el
		}
	})
	return minDate
}

const isDate = (date) => {
	return new Date(date) !== 'Invalid Date' && !Number.isNaN(new Date(date))
}

function shuffle(array) {
	let counter = array.length

	while (counter > 0) {
		const index = Math.floor(Math.random() * counter)

		counter--
		const temp = array[counter]

		// eslint-disable-next-line no-param-reassign
		array[counter] = array[index]
		// eslint-disable-next-line no-param-reassign
		array[index] = temp
	}

	return array
}

class SchoolController {
	async initSubjects(req, res) {
		// dev route, to be removed in production
		try {
			const { subjects } = req.body
			subjects.forEach(async (el) => {
				const subject = await Subjects.findOne({ name: el })
				if (!subject) {
					const newSub = new Subjects({ name: el })
					await newSub.save()
				}
			})

			return res.json({
				message: 'Предметы были успешно инициализированы',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При создании предмета произошла ошибка',
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
				message: 'При получении предметов произошла ошибка',
			})
		}
	}

	async courses(req, res) {
		try {
			const { id } = req.user
			const teacher = await Teacher.findOne({ src: id })
			if (!teacher) {
				return res.status(403).json({ message: 'Ошибка: неверный id' })
			}

			const coursesRaw = await Courses.find({
				_id: { $in: teacher.courses },
			})

			const allAssignments = await Assignments.find()

			const courses = []
			for (let i = 0; i < coursesRaw.length; i++) {
				const e = coursesRaw[i]
				//	const asgs = await Assignments.find({
				//		_id: { $in: e.assignments },
				//	});

				let asgs = []
				for (let j = 0; j < allAssignments.length; j++) {
					for (let k = 0; k < e.assignments.length; k++) {
						if (
							allAssignments[j]._id.toString() ===
							e.assignments[k]
						) {
							asgs.push(allAssignments[j])
							e.assignments.splice(k, 1)
							allAssignments.splice(j, 1)
							j--
							break
						}
					}
				}

				const assigns = []
				asgs.forEach((el) => {
					assigns.push({
						_id: el._id,
						title: el.title,
					})
				})

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
					assignments: assigns,
					chatroom: e.chatroom,
				})
			}

			for (let i = 0; i < courses.length; i++) {
				courses[i].usersdata = []
				// eslint-disable-next-line no-await-in-loop
				const students = await User.find({
					_id: { $in: courses[i].students },
				})
				// TO BE REMADE ALONG WITH IMAGE LOADING LOGIC
				// USER DOCUMENT IS TOO HEAVY TO LOAD EVERY ENTRY AT ONCE
				// DUE TO CONTAINING AVATARS DIRECTLY IN PROFILES
				for (let j = 0; j < courses[i].students.length; j++) {
					let student

					for (let n = 0; n < students.length; n++) {
						if (
							students[n]._id.toString() ===
							courses[i].students[j]
						) {
							student = students[n]
							break
						}
					}

					if (!student) {
						return res.status(403).json({
							message: 'Ошибка: неверный id пользователя',
						})
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
				message: 'При получении курсов произошла ошибка',
			})
		}
	}

	async oldCourses(req, res) {
		try {
			const { id } = req.user
			const teacher = await Teacher.findOne({ src: id })
			if (!teacher) {
				return res.status(403).json({ message: 'Ошибка: неверный id' })
			}

			const coursesRaw = await Courses.find({
				_id: { $in: teacher.courses },
			})

			const courses = []
			for (let i = 0; i < coursesRaw.length; i++) {
				const e = coursesRaw[i]
				// eslint-disable-next-line no-await-in-loop
				const asgs = await Assignments.find({
					_id: { $in: e.assignments },
				})
				const assigns = []
				asgs.forEach((el) => {
					assigns.push({
						_id: el._id,
						title: el.title,
					})
				})

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
					assignments: assigns,
					chatroom: e.chatroom,
				})
			}

			for (let i = 0; i < courses.length; i++) {
				courses[i].usersdata = []
				// eslint-disable-next-line no-await-in-loop
				const students = await User.find({
					_id: { $in: courses[i].students },
				})
				for (let j = 0; j < courses[i].students.length; j++) {
					let student

					for (let n = 0; n < students.length; n++) {
						if (
							students[n]._id.toString() ===
							courses[i].students[j]
						) {
							student = students[n]
							break
						}
					}

					if (!student) {
						return res.status(403).json({
							message: 'Ошибка: неверный id пользователя',
						})
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
				message: 'При получении курсов произошла ошибка',
			})
		}
	}

	async coursesByID(req, res) {
		try {
			const { id } = req.params
			const teacher = await Teacher.findOne({ src: id })
			if (!teacher) {
				return res.status(403).json({ message: 'Ошибка: неверный id' })
			}

			const courses = await Courses.find({
				_id: { $in: teacher.courses },
			})
			return res.json({ courses })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При получении курсов произошла ошибка',
			})
		}
	}

	async usercourses(req, res) {
		try {
			const { id } = req.user
			const user = await User.findOne({ _id: id })
			if (!user) {
				return res.status(403).json({ message: 'Ошибка: неверный id' })
			}

			const usercourses = []
			user.courses.forEach((e) => {
				usercourses.push(e.id)
			})

			const coursesRaw = await Courses.find({
				_id: { $in: usercourses },
			})

			const allAssignments = await Assignments.find()

			const courses = []
			for (let i = 0; i < coursesRaw.length; i++) {
				const e = coursesRaw[i]

				let asgs = []
				for (let j = 0; j < allAssignments.length; j++) {
					for (let k = 0; k < e.assignments.length; k++) {
						if (
							allAssignments[j]._id.toString() ===
							e.assignments[k]
						) {
							asgs.push(allAssignments[j])
							e.assignments.splice(k, 1)
							allAssignments.splice(j, 1)
							j--
							break
						}
					}
				}

				const assigns = []
				asgs.forEach((el) => {
					assigns.push({
						_id: el._id,
						title: el.title,
					})
				})

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
					assignments: assigns,
					chatroom: e.chatroom,
				})
			}

			for (let i = 0; i < courses.length; i++) {
				courses[i].usersdata = []
				// eslint-disable-next-line no-await-in-loop
				const students = await User.find({
					_id: { $in: courses[i].students },
				})
				// TO BE REMADE ALONG WITH IMAGE LOADING LOGIC
				// USER DOCUMENT IS TOO HEAVY TO LOAD EVERY ENTRY AT ONCE
				// DUE TO CONTAINING AVATARS DIRECTLY IN PROFILES
				for (let j = 0; j < courses[i].students.length; j++) {
					let student

					for (let n = 0; n < students.length; n++) {
						if (
							students[n]._id.toString() ===
							courses[i].students[j]
						) {
							student = students[n]
							break
						}
					}

					if (!student) {
						return res.status(403).json({
							message: 'Ошибка: неверный id пользователя',
						})
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
				message: 'При получении курсов произошла ошибка',
			})
		}
	}

	async usercoursesID(req, res) {
		try {
			const { id } = req.params
			const user = await User.findOne({ _id: id })
			if (!user) {
				return res.status(403).json({ message: 'Ошибка: неверный id' })
			}

			const ids = []
			user.courses.forEach((e) => {
				ids.push(e.id)
			})

			const courses = await Courses.find({ _id: { $in: ids } })
			return res.json({ courses })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При получении данных курсов произошла ошибка',
			})
		}
	}

	async coursedata(req, res) {
		try {
			const { id } = req.params
			const course = await Courses.findOne({ _id: id })
			if (!course) {
				return res.status(403).json({ message: 'Ошибка: неверный id' })
			}

			return res.json({ course })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При получении данных курса произошла ошибка',
			})
		}
	}

	async newcourse(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Ошибка при создании курса!', errors })
			}

			const { id: teacher } = req.user
			const { title, desc, price } = req.body
			if (!Number.isInteger(price) || price < 0) {
				return res.status(403).json({
					message:
						'Ошибка: цена курса должна быть целым положительным числом!',
				})
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

			return res.status(201).json({ message: 'Курс был успешно создан!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При создании курса произошла ошибка',
			})
		}
	}

	async editcourse(req, res) {
		try {
			const { course } = req
			const { title, desc, price } = req.body
			if (price !== undefined) {
				if (!Number.isInteger(price) || price < 0) {
					return res.status(403).json({
						message:
							'Ошибка: цена курса должна быть целым положительным числом!',
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
				.json({ message: 'Курс был успешно отредактирован!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При редактировании курса произошла ошибка',
			})
		}
	}

	async editprice(req, res) {
		try {
			const { course } = req
			const { price } = req.body
			if (!Number.isInteger(price) || price < 0) {
				return res.status(403).json({
					message:
						'Ошибка: цена курса должна быть целым положительным числом!',
				})
			}

			course.price = price

			await course.save()
			return res.status(201).json({
				message: 'Вы успешно изменили цену курса!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При изменении цены произошла ошибка',
			})
		}
	}

	async deletecourse(req, res) {
		try {
			const { course } = req
			const teacher = await Teacher.findOne({ src: course.teacher })
			await teacher.courses.pull(course._id)
			await course.delete()
			await teacher.save()
			return res.status(201).json({ message: 'Курс был успешно удалён!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При удалении курса произошла ошибка',
			})
		}
	}

	async newlesson(req, res) {
		try {
			const { course } = req // database object of targeted course, parsed in ensureOwner middleware
			// send course's _id in field 'courseID'
			const { date, endDate, location } = req.body // if lesson is online, location can be left empty
			if (!(isDate(date) && isDate(endDate))) {
				return res
					.status(403)
					.json({ message: 'Ошибка: неверная дата!' })
			}

			const d1 = new Date(date)
			const d2 = new Date(endDate)
			const now = new Date()

			if (d1.getTime() < now.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message: 'Ошибка: нельзя назначать уроки в прошлом!',
				})
			}

			if (d1.getTime() > d2.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message:
						'Ошибка: дата окончания не может быть ранее даты начала!',
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
				}
			})
			if (isOverlap) {
				return res.status(403).json({
					message: 'Ошибка: даты провождения уроков пересекаются!',
				})
			}

			if (location) {
				await course.lessons.push({ date, endDate, location })
			} else {
				await course.lessons.push({ date, endDate })
			}
			await course.save()

			return res.json({ message: 'Урок был успешно добавлен!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При добавлении урока возникла ошибка',
			})
		}
	}

	async dellesson(req, res) {
		try {
			const { course } = req
			const { lessonID: _id } = req.body

			if (!_id) {
				return res
					.status(403)
					.json({ message: 'Ошибка: укажите id урока!' })
			}

			await course.lessons.pull({ _id })
			await course.save()

			return res.json({ message: 'Урок был успешно удалён!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При удалении урока произошла ошибка',
			})
		}
	}

	async publishcourse(req, res) {
		try {
			const { course } = req
			if (!course.lessons.length) {
				return res.json({ message: 'Сначала добавьте уроки!!' })
			}
			course.isPublished = true
			await course.save()
			return res.json({ message: 'Курс был успешно опубликован!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При опубликовании курса произошла ошибка',
			})
		}
	}

	async blockcourse(req, res) {
		try {
			const { course } = req
			course.isBlocked = true
			await course.save()
			return res.json({ message: 'Курс был успешно заблокирован!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При блокировке курса произошла ошибка!',
			})
		}
	}

	async unblockcourse(req, res) {
		try {
			const { course } = req
			course.isBlocked = false
			await course.save()
			return res.json({ message: 'Курс был успешно разблокирован!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При разблокировке курса произошла ошибка',
			})
		}
	}

	async subscribe(req, res) {
		try {
			const { id } = req.user
			const user = await User.findOne({ _id: id })
			if (!user) {
				return res
					.status(403)
					.json({ message: 'Ошибка: неверный пользователь!' })
			}

			const dbTarget = req.course
			if (id === dbTarget.teacher) {
				return res.status(403).json({
					message:
						'Ошибка: вы не можете подписаться на собственный курс!',
				})
			}

			let isSubbed = false
			user.courses.forEach((el) => {
				if (el.id === dbTarget.id) {
					isSubbed = true
				}
			})

			if (isSubbed) {
				return res.status(403).json({
					message: 'Ошибка: вы уже подписаны на этот курс!',
				})
			}

			if (user.balance < dbTarget.price) {
				return res
					.status(403)
					.json({ message: 'Ошибка: недостаточно средств!' })
			}

			const teacher = await User.findOne({ _id: dbTarget.teacher })
			if (!teacher) {
				return res
					.status(403)
					.json({ message: 'Ошибка: не найден учитель курса!' })
			}

			teacher.balance += dbTarget.price
			user.balance -= dbTarget.price

			await teacher.save()
			await dbTarget.students.push(user._id)
			await dbTarget.save()
			await user.courses.push({ id: dbTarget._id, price: dbTarget.price })
			await user.save()

			return res.json({
				message: 'Вы успешно подписались на данный курс!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При подписке на курс произошла ошибка',
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
					.json({ message: 'Ошибка: вы должны указать id курса!' })
			}

			const course = await Courses.findOne({ _id: id })
			if (!course) {
				return res
					.status(403)
					.json({ message: 'Ошибка: неверный курс!' })
			}

			const student = await User.findOne({ _id: userId })
			let studCourse
			student.courses.forEach((e) => {
				if (e.id === id) {
					studCourse = e
				}
			})

			if (!studCourse) {
				return res
					.status(403)
					.json({ message: 'Ошибка: вы не подписаны на этот курс!' })
			}

			const teacher = await User.findOne({ _id: course.teacher })
			if (!teacher) {
				return res.status(403).json({
					message: 'Ошибка: учитель курса не найден',
				})
			}

			const dates = []
			course.lessons.forEach((e) => {
				dates.push(e.date)
			})
			const now = new Date()
			const minDate = getMinDate(dates)

			if (
				minDate.getTime() < now.getTime() ||
				minDate.getTime() === now.getTime()
			) {
				return res.status(403).json({
					message:
						'Ошибка: нельзя отписаться от курса после его начала. Свяжитесь с учителем для возврата средств',
				})
			}

			const { price } = studCourse
			await course.students.pull(userId)
			await student.courses.pull(studCourse)
			student.balance += price
			teacher.balance -= price

			await course.save()
			await student.save()
			await teacher.save()
			return res.json({
				message: 'Вы успешно отписались от курса',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При отписке с курса произошла ошибка',
			})
		}
	}

	async refund(req, res) {
		try {
			const { course } = req
			const id = course._id

			const students = await User.find({ _id: { $in: course.students } })
			if (!students) {
				return res.json({
					message: 'У этого курса нет подписчиков!',
				})
			}

			const teacher = await User.findOne({ _id: course.teacher })
			if (!teacher) {
				return res.status(403).json({
					message: 'Ошибка: учитель курса не найден',
				})
			}

			students.forEach(async (e) => {
				let eCourse
				e.courses.forEach(async (el) => {
					if (el.id === id.toString()) {
						eCourse = el
					}
				})
				if (eCourse) {
					const { price } = eCourse
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
				message: 'Вы успешно вернули средства за этот курс!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При возрврате средств произошла ошибка',
			})
		}
	}

	async refundID(req, res) {
		try {
			const { course } = req
			const id = course._id
			const { id: studID } = req.params

			const student = await User.findOne({ _id: studID })
			if (!student) {
				return res.json({ message: 'Ошибка: неверный id' })
			}

			const teacher = await User.findOne({ _id: course.teacher })
			if (!teacher) {
				return res.status(403).json({
					message: 'Ошибка: учитель курса не найден',
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
					message:
						'Ошибка: курс не найден в списке курсов пользователя',
				})
			}

			const { price } = eCourse
			await course.students.pull(studID)
			await student.courses.pull(eCourse)
			student.balance += price
			teacher.balance -= price

			await student.save()
			await course.save()
			await teacher.save()
			return res.json({
				message: 'Вы успешно вернули средства за этот курс!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При возврате средств произошла ошибка',
			})
		}
	}

	async review(req, res) {
		try {
			const { id } = req.user
			const { teacher, rating, text } = req.body // teacher's 'src' field/teacher's user id field

			if (id === teacher) {
				return res.status(403).json({
					message:
						'Ошибка: нельзя оставлять отзывы в собственном профиле!',
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
					.json({ message: 'Ошибка: неверный рейтинг!' })
			}

			const target = await Teacher.findOne({ src: teacher })
			if (!target) {
				return res
					.status(403)
					.json({ message: 'Ошибка: неверный id учителя!' })
			}

			let old
			target.reviews.forEach(async (e) => {
				if (e.author === id) {
					old = e
				}
			})

			if (old) {
				old.rating = rating
				old.text = text
				await target.save()
				return res
					.status(201)
					.json({ message: 'Отзыв был успешно изменён!' })
			}

			await target.reviews.push({ author: id, rating, text })
			await target.save()
			return res
				.status(201)
				.json({ message: 'Отзыв был успешно опубликован!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'При отправке отзыва произошла ошибка!' })
		}
	}

	async delreview(req, res) {
		try {
			const { id } = req.user
			const { teacher } = req.body // teacher's 'src' field/teacher's user id field

			const target = await Teacher.findOne({ src: teacher })
			if (!target) {
				return res
					.status(403)
					.json({ message: 'Ошибка: неверный id учителя!' })
			}

			let old
			target.reviews.forEach(async (e) => {
				if (e.author === id) {
					old = e
				}
			})

			if (!old) {
				return res
					.status(403)
					.json({ message: 'Ошибка: обзор не найден!' })
			}

			await target.reviews.pull(old)
			await target.save()
			return res
				.status(201)
				.json({ message: 'Отзыв был удалён успешно!' })
		} catch (e) {
			return res.status(500).json({
				message: 'При удалении отзыва произошла ошибка',
			})
		}
	}

	async newassignment(req, res) {
		try {
			const { course } = req
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
					.json({ message: 'Ошибка: недостаточно данных!' })
			}

			const d1 = new Date(date)
			const d2 = new Date(endDate)
			const now = new Date()

			if (d1.getTime() < now.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message: 'Задание нельзя назначить в прошлом!',
				})
			}

			if (d1.getTime() > d2.getTime() || d1.getTime() === d2.getTime()) {
				return res.status(403).json({
					message: 'Дата окончания не может быть ранее даты начала!',
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
				}
			})

			if (isMulviol) {
				return res.status(403).json({
					message:
						'Одноответные вопросы не могут иметь несколько верных ответов!',
				})
			}

			if (isTitles) {
				return res.status(403).json({
					message: 'У всех вопросов и ответов должен быть текст!',
				})
			}

			if (isPoints) {
				return res.status(403).json({
					message: 'У всех вопросов должна быть оценка!',
				})
			}

			if (isAnswers) {
				return res.status(403).json({
					message:
						'Все вопросы должны иметь хотя-бы 2 варианта ответа!',
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
				message: 'Задание добавлено успешно!',
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'При добавлении задания произошла ошибка' })
		}
	}

	async delassignment(req, res) {
		try {
			const { assignmentID } = req.body
			const { id } = req.user

			const assignment = await Assignments.findOne({ _id: assignmentID })
			if (!assignment) {
				return res.status(403).json({ message: 'Задание не найдено!' })
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			if (course.teacher !== id) {
				return res.status(403).json({
					message: 'Вы не являетесь владельцем данного курса!',
				})
			}

			await course.assignments.pull(assignmentID)
			await assignment.delete()
			await course.save()

			return res.json({ message: 'Задание удалено успешно!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'При удалении задания произошла ошибка' })
		}
	}

	async getassignment(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body

			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res.status(403).json({ message: 'Задание не найдено!' })
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			let isSubbed = false
			course.students.forEach((e) => {
				if (e === id) {
					isSubbed = true
				}
			})
			if (!isSubbed) {
				return res
					.status(403)
					.json({ message: 'Ошибка: вы не подписаны на этот курс!' })
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

			const questions = []

			asg.questions.forEach((e) => {
				const answers = []
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
				.json({ message: 'При получении задания произошла ошибка' })
		}
	}

	async getassignmentTeacher(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body

			const assignment = await Assignments.findOne({ _id: assignmentID })
			if (!assignment) {
				return res.status(403).json({ message: 'Задание не найдено!' })
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			if (course.teacher !== id) {
				return res.status(403).json({
					message: 'Вы не являетесь учителем данного курса!',
				})
			}

			return res.json({
				assignment,
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'При получении задания произошла ошибка' })
		}
	}

	// async getAssignmentSchedule(req, res) {
	// 	try {
	// 	} catch (e) {
	// 		console.log(e);
	// 		return res.status(500).json({ message: 'При добавлении задания произошла ошибка' });
	// 	}
	// }

	async submit(req, res) {
		try {
			const { id } = req.user
			const { assignmentID, questions } = req.body

			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res.status(403).json({ message: 'Задание не найдено!' })
			}

			const now = new Date().getTime()
			const dateStart = new Date(asg.date).getTime()
			const dateEnd = new Date(asg.date).getTime()

			if (now < dateStart) {
				return res
					.status(403)
					.json({ message: 'Ошибка: задание еще не началось!' })
			}

			if (!asg.allowOvertime && now > dateEnd) {
				return res.status(403).json({
					message:
						'Ошибка: это задание невозможно сдать после окончания времени!',
				})
			}

			const course = await Courses.findOne({ assignments: assignmentID })
			let isSubbed = false
			course.students.forEach((e) => {
				if (e === id) {
					isSubbed = true
				}
			})

			if (!isSubbed) {
				return res
					.status(403)
					.json({ message: 'Ошибка: вы не подписаны на этот курс!' })
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
						const isMul = asg.questions[i].isMulAnswers

						for (
							let n = 0;
							n < asg.questions[i].answers.length;
							n++
						) {
							for (
								let m = 0;
								m < asg.questions[i].answers.length;
								m++
							) {
								if (
									asg.questions[i].answers[n].nID ===
									questions[j].answers[m].nID
								) {
									questions[j].answers[m].text =
										asg.questions[i].answers[n].text
									questions[j].answers[m].isCorrect =
										asg.questions[i].answers[n].isTrue ===
										questions[j].answers[m].isChecked
									corAnsCnt +=
										questions[j].answers[m].isCorrect
									ansCnt += questions[j].answers[m].isChecked
								}
							}
						}

						if (!ansCnt) {
							return res.status(403).json({
								message:
									'Ошибка: каждый вопрос должен иметь хотя-бы один ответ!',
							})
						}

						if (!isMul && ansCnt > 1) {
							return res.status(403).json({
								message:
									'Ошибка: вопросы с одним ответом не могут иметь несколько ответов!',
							})
						}

						questions[j].isCorrect =
							asg.questions[i].answers.length === corAnsCnt
						if (questions[j].isCorrect) {
							points += asg.questions[i].points
						}

						qLeft--
					}
				}
			}

			if (qLeft) {
				return res
					.status(403)
					.json({ message: 'Вы должны ответить на каждый вопрос!' })
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
			return res.status(201).json({ message: 'Задание сдано успешно!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'При сдаче задания произошла ошибка!' })
		}
	}

	async delsubmit(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body
			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res.status(403).json({ message: 'Задание не найдено!' })
			}

			if (!asg.submits) {
				return res.status(403).json({ message: 'Нет сданных заданий!' })
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
					message: 'Вы не сдавали данное задание!',
				})
			}

			await asg.submits.pull(submit)

			await asg.save()

			return res.json({ message: 'Сданое задание было успешно удалено!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При удалении сданого задания произошла ошибка!',
			})
		}
	}

	async getsubmit(req, res) {
		try {
			const { id } = req.user
			const { assignmentID } = req.body
			const asg = await Assignments.findOne({ _id: assignmentID })
			if (!asg) {
				return res.status(403).json({ message: 'Задание не найдено!' })
			}

			if (!asg.submits) {
				return res.status(403).json({ message: 'Нет сданных заданий!' })
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
					message: 'Вы не сдавали данное задание!',
				})
			}

			return res.json({ submit })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При получении сданого задания произошла ошибка',
			})
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
					.json({ message: 'Ошибка: задание не найдено!' })
			}

			if (!asg.submits) {
				return res.status(403).json({ message: 'Нет сданных заданий!' })
			}

			const course = await Courses.findOne({ assignments: asg._id })

			if (!course) {
				return res
					.status(403)
					.json({ message: 'Ошибка: не найден курс задания!' })
			}

			if (course.teacher !== id) {
				return res.status(403).json({
					message: 'Ошибка: вы не являетесь учителем данного курса!',
				})
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
					message: 'Данный пользователь не ответил на это задание!',
				})
			}

			return res.json({ submit })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'При получении сданного задания произошла ошибка!',
			})
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
					.json({ message: 'Ошибка: несуществующее задание!' })
			}

			if (!asg.submits) {
				return res.status(403).json({
					message: 'Нет сданных заданий!',
				})
			}

			const course = await Courses.findOne({ assignments: asg._id })

			if (!course) {
				return res
					.status(403)
					.json({ message: 'Ошибка: курс не обнаружен!' })
			}

			if (course.teacher !== id) {
				return res.status(403).json({
					message: 'Ошибка: вы не являетесь учителем этого курса!',
				})
			}

			const usersToFind = []
			for (let i = 0; i < asg.submits.length; i++) {
				usersToFind.push(asg.submits[i].submitter)
			}

			const allStudents = await User.find({ _id: { $in: usersToFind } })

			const statistics = {
				best_students: [],
				hardest_questions: [],
			}
			for (let i = 0; i < asg.submits.length; i++) {
				const submit = asg.submits[i]

				// const student = await User.findOne({ _id: submit.submitter });
				// if (!student) {
				// 	return res.status(403).json({
				// 		message: 'Ошибка: найдена анкета несуществующего пользователя!',
				// 	});
				// }

				let student
				for (let j = 0; j < allStudents.length; j++) {
					if (
						submit.submitter.toString() ===
						allStudents[j]._id.toString()
					) {
						student = allStudents[j]
						allStudents.splice(j, 1)
						break
					}
				}

				// WAS ABLE TO FIX USER DOCUMENT RELATED OPTIMIZATION ISSUE IN
				// THIS CASE WITHOUT REWORKING IMAGE LOGIC SINCE WE ONLY NEED TO
				// LOAD ALREADY KNOWN SET OF USERS INSTEAD OF ENTIRE DOCUMENT

				statistics.best_students[i] = {
					points: submit.points,
					_id: student._id,
					username: student.username,
					avatar: student.avatar,
					email: student.email,
				}
				for (let j = 0; j < submit.questions.length; j++) {
					const question = submit.questions[j]

					let existsHQ = -1
					for (
						let n = 0;
						n < statistics.hardest_questions.length;
						n++
					) {
						if (
							statistics.hardest_questions[n].qID === question.qID
						) {
							existsHQ = n
							break
						}
					}

					if (existsHQ > -1) {
						statistics.hardest_questions[
							existsHQ
						].correct_answers += question.isCorrect
						for (
							let n = 0;
							n <
							statistics.hardest_questions[existsHQ].answers
								.length;
							n++
						) {
							for (let m = 0; m < question.answers.length; m++) {
								if (
									statistics.hardest_questions[existsHQ]
										.answers[n].nID ===
									question.answers[m].nID
								) {
									statistics.hardest_questions[
										existsHQ
									].answers[n].picked +=
										question.answers[m].isChecked
								}
							}
						}
					} else {
						const answers = []
						for (let n = 0; n < question.answers.length; n++) {
							const cAnswer = question.answers[n]
							answers[n] = {
								text: cAnswer.text,
								nID: cAnswer.nID,
								isTrue: cAnswer.isChecked === cAnswer.isCorrect,
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
				message: 'При получении статистики произошла ошибка',
			})
		}
	}
}

// statistics: Users by points, questions by ansers

module.exports = new SchoolController()
