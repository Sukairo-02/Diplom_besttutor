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
					.json({ message: 'Registration error!', errors })
			}

			const {
				username,
				password,
				email,
				dateOfBirth,
				isTeacher,
			} = req.body //isTeacher is a boolean value. Is set to true if user decided
			//to register as teacher, false otherwise.

			const candidate = await User.findOne({ email: email })
			if (candidate) {
				return res
					.status(400)
					.json({ message: 'This email is occupied!' })
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
				return res.status(401).json({ message: 'Invalid email!' })
			}

			if (user.isActive) {
				return res
					.status(403)
					.json({ message: 'You have already validated your email!' })
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
						'Error occured while sending mail. Try again later.',
				})
			}

			return res.status(201).json({
				message:
					'Validation email has been sent to your e-mail address.',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error occured while sending validation mail!',
			})
		}
	}

	async verifyEmail(req, res) {
		try {
			if (!req.params.token) {
				return res
					.status(403)
					.json({ message: 'Error: no token found!' })
			}

			const { token } = req.params
			const decData = jwt.verify(token, config.get('server.mailSecret'))

			const candidate = await User.findOne({ _id: decData.id })
			if (!candidate) {
				return res
					.status(403)
					.json({ message: 'Error: invalid token!' })
			}

			candidate.isActive = true
			await candidate.save()

			return res.redirect(`${config.get('client.address')}login`)
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error occured while verifying mail!',
			})
		}
	}

	async sendRestorationEmail(req, res) {
		try {
			const { email } = req.body
			const user = await User.findOne({ email: email })
			if (!user) {
				return res.status(401).json({ message: 'Invalid email!' })
			}

			if (!user.isActive) {
				return res
					.status(403)
					.json({ message: 'Validate your email first!' })
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
						'Error occured while sending mail. Try again later.',
				})
			}

			return res.status(201).json({
				message:
					'Validation email has been sent to your e-mail address.',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error occured while verifying mail!',
			})
		}
	}

	async restorePass(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Password restoration error!', errors })
			}

			const { resToken, password } = req.body
			if (!resToken) {
				return res.status(403).json({ message: 'Invalid token!' })
			}

			const decData = jwt.verify(
				resToken,
				config.get('server.passSecret')
			)

			const candidate = await User.findOne({ _id: decData.id })
			if (!candidate) {
				return res
					.status(403)
					.json({ message: "This account doesn't exist!" })
			}
			candidate.password = await bcrypt.hash(password, 7)
			await candidate.save()

			return res
				.status(201)
				.json({ message: 'Password changed succesfully!' })
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Error occured while verifying mail!',
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
				return res.status(401).json({ message: 'Invalid email!' })
			}

			const validPass = await bcrypt.compare(password, user.password)
			if (!validPass) {
				return res.status(401).json({ message: 'Invalid password!' })
			}

			if (!user.isActive) {
				return res
					.status(403)
					.json({ message: 'You must validate your email first!' })
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
				message: 'You have succesfully logged in!',
				token: token,
				refreshToken: refToken,
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: 'Login failed!' })
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
					exprerience: teacher.exprerience,
					subject: teacher.subject,
					teacherCourses: teacher.courses,
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
				.json({ message: "Error occured while getting user's data!" })
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
				.json({ message: "Error occured while getting user's data!" })
		}
	}

	async edit(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Edit error!', errors })
			}

			const { id: _id } = req.user

			let user = await User.findOne({ _id })
			if (!user) {
				return res
					.status(403)
					.json({ message: "Error: can't find user by id!" })
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

			return res.json({ message: 'Changes applied succesfully!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error occured while editing user data!' })
		}
	}

	async editteacher(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Edit error!', errors })
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
					message: 'Error: this user is not teacher!',
				})
			}

			let teacher = await Teacher.findOne({ src: _id })
			const { desc, education, experience, subject } = req.body

			const dbSubject = await Subjects.findOne({ name: subject })
			if (!dbSubject) {
				return res
					.status(403)
					.json({ message: 'Error: non-existent subject!' })
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

			return res.json({ message: 'Changes applied succesfully!' })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: 'Error occured while editing teacher data!' })
		}
	}

	async logout(req, res) {
		try {
			const { refreshToken: refToken } = req.body

			if (!refToken) {
				return res
					.status(403)
					.json({ message: 'Error: invalid refresh token!' })
			}

			await Token.findOneAndDelete({ value: refToken })

			return res
				.status(205)
				.json({ message: 'You have succesfully logged out!' })
		} catch (e) {
			return res
				.status(500)
				.json({ message: 'Error occured while logging out!' })
		}
	}

	async token(req, res) {
		try {
			const { refreshToken: refToken } = req.body
			const candidate = await Token.findOne({ value: refToken })
			if (!candidate) {
				return res
					.status(401)
					.json({ message: 'Error: invalid refresh token!' })
			}

			const decToken = req.refreshToken

			const acToken = generateAccessToken(decToken.id, decToken.roles)

			return res.json({
				message: 'Succesfully generated new access token!',
				token: acToken,
			})
		} catch (e) {
			return res
				.status(500)
				.json({ message: 'Error occured while getting new token!' })
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

			return res.json({ message: 'Other sessions have been terminated!' })
		} catch (e) {
			return res
				.status(500)
				.json({ message: 'Error occured while ending other sessions!' })
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
				.json({ message: "Error occured while getting user's data" })
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
					experience: teacher.exprerience,
					subject: teacher.subject,
					teacherCourses: teacher.courses,
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
				.json({ message: "Error occured while getting user's data" })
		}
	}

	async userlist(req, res) {
		try {
			const { role } = req.params
			let users

			if (role) {
				const dbRole = await Role.findOne({ value: role })
				if (!dbRole) {
					return res
						.status(403)
						.json({ message: "Can't find requested role!" })
				}
				users = await User.find({ roles: role })

				return res.json({ users: users })
			}

			users = await User.find()
			return res.json({ users: users })
		} catch (e) {
			console.log(e)
			return res
				.status(500)
				.json({ message: "Error occured while getting user's data" })
		}
	}
}

module.exports = new authController()
