const User = require('../../models/User')
const Teacher = require('../../models/Teacher')
const Role = require('../../models/Roles')
const Token = require('../../models/Token')
const Validation = require('../../models/Validation')
const Resetpass = require('../../models/Resetpass')
const Subjects = require('../../models/Subjects')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const config = require('config')
const secret = config.get('server.secret')
const transporter = require('../mailtransporter/transporter')

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles,
	}

	return jwt.sign(payload, secret, {
		expiresIn: '1h',
	})
}

class authController {
	async register(req, res) {
		try {
			console.log('Body:', req.body)
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Ошибка регистрации!', errors })
			}

			const { username, password, email, dateOfBirth, isTeacher } =
				req.body //isTeacher is a boolean value. Is set to true if user decided
			//to register as teacher, false otherwise.

			const candidate = await User.findOne({ email: email })
			if (candidate) {
				return res
					.status(400)
					.json({ message: 'Этот email уже зарегистрирован!' })
			}

			const hashPass = await bcrypt.hash(password, 7)
			let userRole
			if (isTeacher) {
				userRole = await Role.findOne({ value: 'TCHR' })
			} else {
				userRole = await Role.findOne({ value: 'USER' })
			}

			const user = new User({
				username: username,
				password: hashPass,
				email: email,
				dateOfBirth: dateOfBirth,
				roles: [userRole.value],
			})

			if (isTeacher) {
				let tchr = new Teacher()
				tchr.src = user._id //mongodb has no relations, will use _id to find teacher's data if user is teacher.
				await tchr.save()
			}

			await user.save()

			return res.status(201).json({
				message:
					'Вы были успешно зарегистрированы. Прежде чем продолжить, подтвердите вашу почту.',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: 'Registration failed!' })
		}
	}

	async sendValidation(req, res) {
		try {
			const { email } = req.body
			const user = await User.findOne({ email: email })
			if (!user) {
				return res.status(401).json({ message: 'Неверный email!' })
			}

			if (user.isActive) {
				return res
					.status(403)
					.json({ message: 'Вы уже подтвердили свой email!' })
			}

			await Validation.findOneAndDelete({ src: user._id })

			const validToken = jwt.sign(
				{ id: user._id, roles: user.roles },
				config.get('server.mailSecret'),
				{ expiresIn: '15m' }
			)
			const validToDB = new Validation({
				value: validToken,
				src: user._id,
			})
			await validToDB.save()

			let isMailError = false

			await transporter.sendMail(
				{
					from: config.get('email.address'),
					to: email,
					subject: 'Besttutor email verification',
					html: `
						Для подтверждения почты, перейдите по ссылке:
						<a href="${
							config.get('server.address') +
							'api/auth/verify/' +
							validToken
						}">Подтвердить почту</a>
					`, //Will be a proper front-end link instead of back-end.
				},
				function (error, info) {
					if (error) {
						console.log(error)
						isMailError = true
					} else {
						console.log('Email sent: ' + info.response)
					}
				}
			)

			if (isMailError) {
				return res.status(500).json({
					message:
						'Произошла ошибка во время отправки письма. Попробуйте позже',
				})
			}

			return res.status(201).json({
				message: 'Письмо подтверждения было отправлено на ваш email',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message:
					'Произошла ошибка во время отправки письма. Попробуйте позже',
			})
		}
	}

	async verifyEmail(req, res) {
		try {
			if (!req.params.token) {
				return res
					.status(403)
					.json({ message: 'Ошибка: токен не обнаружен!' })
			}

			const { token } = req.params
			const decData = jwt.verify(token, config.get('server.mailSecret'))

			const candidate = await User.findOne({ _id: decData.id })
			if (!candidate) {
				return res
					.status(403)
					.json({ message: 'Ошибка: токен недействительный!' })
			}

			candidate.isActive = true
			await candidate.save()

			return res.redirect(`${config.get('client.address')}login`)
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Во время верификации почты произошла ошибка',
			})
		}
	}

	async sendRestorationEmail(req, res) {
		try {
			const { email } = req.body
			const user = await User.findOne({ email: email })
			if (!user) {
				return res.status(401).json({ message: 'Неверный email!' })
			}

			if (!user.isActive) {
				return res
					.status(403)
					.json({ message: 'Сначала подтвердите свой email!' })
			}

			await Resetpass.findOneAndDelete({ src: user._id })

			const validToken = jwt.sign(
				{ id: user._id, roles: user.roles },
				config.get('server.passSecret'),
				{ expiresIn: '15m' }
			)
			const validToDB = new Resetpass({
				value: validToken,
				src: user._id,
			})
			await validToDB.save()

			let isMailError = false
			await transporter.sendMail(
				{
					from: config.get('email.address'),
					to: email,
					subject: 'Besttutor password reset code',
					text: `To reset your password, use this code: ${validToken}`, //Will be a proper front-end link instead of back-end.
				},
				function (error, info) {
					if (error) {
						console.log(error)
						isMailError = true
					} else {
						console.log('Email sent: ' + info.response)
					}
				}
			)

			if (isMailError) {
				return res.status(500).json({
					message:
						'Произошла ошибка во время отправки письма. Попробуйте позже',
				})
			}

			return res.status(201).json({
				message:
					'Сообщение для подтверждения было отправлено на ваш email',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message:
					'Произошла ошибка во времяя отправьки письма. Попробуйте позже',
			})
		}
	}

	async restorePass(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Ошибка восстановления пароля!', errors })
			}

			const { resToken, password } = req.body
			if (!resToken) {
				return res
					.status(403)
					.json({ message: 'Ошибка: токен недействителен!' })
			}

			const decData = jwt.verify(
				resToken,
				config.get('server.passSecret')
			)

			const candidate = await User.findOne({ _id: decData.id })
			if (!candidate) {
				return res
					.status(403)
					.json({ message: 'Ошибка: этот аккаунт не существует!' })
			}
			candidate.password = await bcrypt.hash(password, 7)
			await candidate.save()

			return res.status(201).json({ message: 'Пароль сменён усешно!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Во время смены пароля произошла ошибка',
			})
		}
	}

	async initRoles(req, res) {
		//dev function, will be deleted in prod version. Used to initialize list of available roles.
		try {
			const { roles } = req.body
			console.log(roles)
			roles.forEach(async (element) => {
				console.log(element)
				const role = new Role({ value: element })
				await role.save()
			})
			return res
				.status(201)
				.json({ message: 'Roles assigned succesfully!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: 'Failed to assign roles!' })
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body
			const user = await User.findOne({ email: email })
			if (!user) {
				return res
					.status(401)
					.json({ message: 'Ошибка: неверная почта!' })
			}

			const validPass = await bcrypt.compare(password, user.password)
			if (!validPass) {
				return res
					.status(401)
					.json({ message: 'Ошибка: неверный пароль!' })
			}

			if (!user.isActive) {
				return res
					.status(403)
					.json({
						message: 'Ошибка: сначала подтвердите свой email!',
					})
			}

			const token = generateAccessToken(user._id, user.roles)
			const refToken = jwt.sign(
				{
					id: user._id,
					roles: user.roles,
				},
				config.get('server.refreshSecret')
			)

			const refToDB = new Token({ value: refToken, src: user._id })
			await refToDB.save()

			return res.json({
				message: 'Вы успешно вошли в аккаунт!',
				token: token,
				refreshToken: refToken,
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Произошла ошибка при авторизации' })
		}
	}

	async userdata(req, res) {
		try {
			const { id: usid, roles: roles } = req.user
			const user = await User.findOne({ _id: usid })
			const teacher = await Teacher.findOne({ src: usid })

			if (teacher) {
				return res.json({
					_id: usid,
					username: user.username,
					email: user.email,
					dateOfBirth: user.dateOfBirth,
					avatar: user.avatar,
					phone: user.phone,
					area: user.area,
					city: user.city,
					address: user.address,
					roles: roles,
					courses: user.courses,
					balance: user.balance,
					desc: teacher.desc,
					education: teacher.education,
					experience: teacher.experience,
					subject: teacher.subject,
					teacherCourses: teacher.courses,
					reviews: teacher.reviews
				})
			} else {
				return res.json({
					_id: usid,
					username: user.username,
					email: user.email,
					dateOfBirth: user.dateOfBirth,
					avatar: user.avatar,
					phone: user.phone,
					area: user.area,
					city: user.city,
					address: user.address,
					roles: roles,
					courses: user.courses,
					balance: user.balance,
				})
			}
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'Произошла ошибка во время получения данных пользователя!',
				})
		}
	}

	async lightdata(req, res) {
		try {
			const { id: usid, roles: roles } = req.user
			const user = await User.findOne({ _id: usid })
			return res.json({
				_id: usid,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				roles: roles,
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'Произошла ошибка во время получения данных пользователя!',
				})
		}
	}

	async edit(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Ошибка редактирования!', errors })
			}

			const { id: _id } = req.user

			let user = await User.findOne({ _id })
			if (!user) {
				return res
					.status(403)
					.json({ message: 'Ошибка: не найден пользователь по id!' })
			}

			const {
				username,
				dateOfBirth,
				avatar,
				area,
				city,
				address,
				phone,
			} = req.body
			user.username = username
			user.dateOfBirth = dateOfBirth
			user.avatar = avatar
			user.area = area
			user.city = city
			user.address = address
			user.phone = phone
			await user.save()

			return res.json({ message: 'Изменения успешно сохранены!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'Во время редактирования данных пользователя произошла ошибка!',
				})
		}
	}

	async editteacher(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Ошибка редактиования!', errors })
			}

			const { id: _id, roles: roles } = req.user

			let isTeacher = false

			roles.forEach(async (role) => {
				if (role === 'TCHR') {
					isTeacher = true
				}
			})

			if (!isTeacher) {
				return res.status(403).json({
					message: 'Ошибка: вы не являетесь учителем!',
				})
			}

			let teacher = await Teacher.findOne({ src: _id })
			const { desc, education, experience, subject } = req.body

			const dbSubject = await Subjects.findOne({ name: subject })
			if (!dbSubject) {
				return res
					.status(403)
					.json({ message: 'Ошибка: несуществующий предмет!' })
			}

			if (teacher.subject) {
				if (teacher.subject !== dbSubject.name) {
					const oldSubject = await Subjects.findOne({
						name: teacher.subject,
					})

					oldSubject.Teachers.pull(teacher.src)
					await oldSubject.save()
				}
			}

			dbSubject.Teachers.push(teacher.src)
			teacher.subject = dbSubject.name
			await dbSubject.save()

			teacher.desc = desc
			teacher.education = education
			teacher.experience = experience
			teacher.isActive = true
			await teacher.save()

			return res.json({ message: 'Изменения сохранены!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'Во время редактирования данных учителя произошла ошибка',
				})
		}
	}

	async logout(req, res) {
		try {
			const { refreshToken: refToken } = req.body

			if (!refToken) {
				return res
					.status(403)
					.json({ message: 'Ошибка: неверный токен возобновления!' })
			}

			await Token.findOneAndDelete({ value: refToken })

			return res
				.status(205)
				.json({ message: 'Вы успешно вышли из аккаунта!' })
		} catch (e) {
			return res
				.status(500)
				.json({
					message: 'Во время выхода из аккаунта произошла ошибка!',
				})
		}
	}

	async token(req, res) {
		try {
			const { refreshToken: refToken } = req.body
			const candidate = await Token.findOne({ value: refToken })
			if (!candidate) {
				return res
					.status(401)
					.json({ message: 'Ошибка: неверный токен возобновления!' })
			}

			const decToken = req.refreshToken

			const acToken = generateAccessToken(decToken.id, decToken.roles)

			return res.json({
				message: 'Успешно сгенерирован новый токен доступа!',
				token: acToken,
			})
		} catch (e) {
			return res
				.status(500)
				.json({
					message:
						'Во время обновления токена доступа произошла ошибка',
				})
		}
	}

	async killIntruders(req, res) {
		try {
			const { refreshToken: refToken } = req.body
			const decToken = req.refreshToken

			const sessions = await Token.find({ src: decToken.id })
			sessions.forEach(async (element) => {
				if (element.value !== refToken) {
					await element.delete()
				}
			})

			return res.json({
				message: 'Другие сессии были успешно завершены!',
			})
		} catch (e) {
			return res
				.status(500)
				.json({
					message:
						'Во время завершения других сессий произошла ошибка',
				})
		}
	}

	async lightdataID(req, res) {
		try {
			const { id: usid } = req.params
			const user = await User.findOne({ _id: usid })
			return res.json({
				_id: usid,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				roles: user.roles,
			})
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'При получении данных пользователей произошла ошибка',
				})
		}
	}

	async userdataID(req, res) {
		try {
			const { id: usid } = req.params
			const user = await User.findOne({ _id: usid })
			const teacher = await Teacher.findOne({ src: usid })

			if (teacher) {
				return res.json({
					_id: usid,
					username: user.username,
					email: user.email,
					dateOfBirth: user.dateOfBirth,
					avatar: user.avatar,
					phone: user.phone,
					area: user.area,
					city: user.city,
					address: user.address,
					roles: user.roles,
					courses: user.courses,
					desc: teacher.desc,
					education: teacher.education,
					experience: teacher.experience,
					subject: teacher.subject,
					teacherCourses: teacher.courses,
					reviews: teacher.reviews
				})
			} else {
				return res.json({
					_id: usid,
					username: user.username,
					email: user.email,
					dateOfBirth: user.dateOfBirth,
					avatar: user.avatar,
					phone: user.phone,
					area: user.area,
					city: user.city,
					address: user.address,
					roles: user.roles,
					courses: user.courses,
				})
			}
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'При получении данных пользователей произошла ошибка',
				})
		}
	}

	async lightdataArr(req, res) {
		try {
			const { ids } = req.body

			if (!ids) {
				return res
					.status(403)
					.json({ message: 'Ошибка: отсутствуют id!' })
			}

			const usersRaw = await User.find({ _id: { $in: ids } })

			let users = []

			for (let i = 0; i < usersRaw.length; i++) {
				users.push({
					_id: usersRaw[i]._id,
					username: usersRaw[i].username,
					email: usersRaw[i].email,
					avatar: usersRaw[i].avatar,
					roles: usersRaw[i].roles,
				})
			}

			return res.json({ users })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'При получении данных пользователей произошла ошибка',
				})
		}
	}

	async userdataArr(req, res) {
		try {
			const { ids } = req.body

			if (!ids) {
				return res
					.status(403)
					.json({ message: 'Ошибка: отсутствуют id!' })
			}

			const usersRaw = await User.find({ _id: { $in: ids } })
			const teachers = await Teacher.find({ src: { $in: ids } })

			let users = []

			for (let i = 0; i < usersRaw.length; i++) {
				let isTeacher = false
				usersRaw[i].roles.forEach((el) => {
					if (el === 'TCHR') {
						isTeacher = true
					}
				})

				if (isTeacher) {
					let teacher

					teachers.forEach((el) => {
						if (el.src === usersRaw[i]._id.toString()) {
							teacher = el

							return
						}
					})

					users.push({
						_id: usersRaw[i]._id,
						username: usersRaw[i].username,
						email: usersRaw[i].email,
						dateOfBirth: usersRaw[i].dateOfBirth,
						avatar: usersRaw[i].avatar,
						phone: usersRaw[i].phone,
						area: usersRaw[i].area,
						city: usersRaw[i].city,
						address: usersRaw[i].address,
						roles: usersRaw[i].roles,
						courses: usersRaw[i].courses,
						desc: teacher.desc,
						education: teacher.education,
						experience: teacher.experience,
						subject: teacher.subject,
						teacherCourses: teacher.courses,
						reviews: teacher.reviews
					})
				} else {
					users.push({
						_id: usersRaw[i]._id,
						username: usersRaw[i].username,
						email: usersRaw[i].email,
						dateOfBirth: usersRaw[i].dateOfBirth,
						avatar: usersRaw[i].avatar,
						phone: usersRaw[i].phone,
						area: usersRaw[i].area,
						city: usersRaw[i].city,
						address: usersRaw[i].address,
						roles: usersRaw[i].roles,
						courses: usersRaw[i].courses,
					})
				}
			}

			return res.json({ users })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'При получении данных пользователей произошла ошибка',
				})
		}
	}

	async userlist(req, res) {
		try {
			const { role } = req.params
			let users = []
			let usersRaw
			if (role) {
				const dbRole = await Role.findOne({ value: role })
				if (!dbRole) {
					return res
						.status(403)
						.json({ message: 'Указанная роль не найдена!' })
				}
				usersRaw = await User.find({ roles: role })
			} else {
				usersRaw = await User.find()
			}

			const teachers = await Teacher.find()

			for (let i = 0; i < usersRaw.length; i++) {
				let isTeacher = false
				usersRaw[i].roles.forEach((el) => {
					if (el === 'TCHR') {
						isTeacher = true
					}
				})

				if (isTeacher) {
					let teacher
					teachers.forEach((el) => {
						if (el.src === usersRaw[i]._id.toString()) {
							teacher = el
							return
						}
					})

					users.push({
						_id: usersRaw[i]._id,
						username: usersRaw[i].username,
						email: usersRaw[i].email,
						dateOfBirth: usersRaw[i].dateOfBirth,
						avatar: usersRaw[i].avatar,
						phone: usersRaw[i].phone,
						area: usersRaw[i].area,
						city: usersRaw[i].city,
						address: usersRaw[i].address,
						roles: usersRaw[i].roles,
						courses: usersRaw[i].courses,
						reviews: teacher.reviews,
						desc: teacher.desc,
						education: teacher.education,
						experience: teacher.experience,
						subject: teacher.subject,
						teacherCourses: teacher.courses,
					})
				} else {
					users.push({
						_id: usersRaw[i]._id,
						username: usersRaw[i].username,
						email: usersRaw[i].email,
						dateOfBirth: usersRaw[i].dateOfBirth,
						avatar: usersRaw[i].avatar,
						phone: usersRaw[i].phone,
						area: usersRaw[i].area,
						city: usersRaw[i].city,
						address: usersRaw[i].address,
						roles: usersRaw[i].roles,
						courses: usersRaw[i].courses,
					})
				}
			}

			return res.json({ users })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({
					message:
						'При получении данных пользователей произошла ошибка',
				})
		}
	}
}

module.exports = new authController()
