const User = require("../../models/User")
const Teacher = require("../../models/Teacher")
const Role = require("../../models/Roles")
const Token = require("../../models/Token")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const config = require("config")
const secret = config.get("server.secret")

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    }

    return jwt.sign(payload, secret, {
        expiresIn: "1h",
    })
}

class authController {
    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Registration error!", errors })
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
                    .json({ message: "This email is occupied!" })
            }

            const hashPass = await bcrypt.hash(password, 7)
            let userRole
            if (isTeacher) {
                userRole = await Role.findOne({ value: "TCHR" })
            } else {
                userRole = await Role.findOne({ value: "USER" })
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

            return res
                .status(201)
                .json({ message: "You've been registered succesfully!" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Registration failed!" })
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
                .json({ message: "Roles assigned succesfully!" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Failed to assign roles!" })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email })
            if (!user) {
                return res.status(401).json({ message: "Invalid email!" })
            }

            const validPass = await bcrypt.compare(password, user.password)
            if (!validPass) {
                return res.status(401).json({ message: "Invalid password!" })
            }

            const token = generateAccessToken(user._id, user.roles)
            const refToken = jwt.sign(
                {
                    id: user._id,
                    roles: user.roles,
                },
                config.get("server.refreshSecret")
            )

            const refToDB = new Token({ value: refToken, src: user._id })
            await refToDB.save()

            return res.json({
                message: "You have succesfully logged in!",
                token: token,
                refreshToken: refToken,
                id: user._id,
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Login failed!" })
        }
    }

    async userdata(req, res) {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const { id: usid, roles: roles } = req.user
            const user = await User.findOne({ _id: usid })
            let isTeacher
            const teacher = await Teacher.findOne({ src: usid })

            if (teacher) {
                isTeacher = true
                return res.json({
                    _id: usid,
                    username: user.username,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    avatar: user.avatar,
                    roles: roles,
                    phone: teacher.phone,
                    desc: teacher.desc,
                    education: teacher.education,
                    exprerience: teacher.exprerience,
                    city: teacher.city,
                })
            } else {
                isTeacher = false
                return res.json({
                    _id: usid,
                    username: user.username,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    avatar: user.avatar,
                    roles: roles,
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
                return res.status(400).json({ message: "Edit error!", errors })
            }

            const { id: _id } = req.user

            let user = await User.findOne({ _id: _id })
            if (!user) {
                return res
                    .status(403)
                    .json({ message: "Error: can't find user by id!" })
            }

            const { username, dateOfBirth, avatar } = req.body
            user.username = username
            user.dateOfBirth = dateOfBirth
            user.avatar = avatar
            await user.save()

            return res.json({ message: "Changes applied succesfully!" })
        } catch (e) {
            console.log(e)
            return res
                .status(500)
                .json({ message: "Error occured while editing user data!" })
        }
    }

    async editteacher(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Edit error!", errors })
            }

            const { id: _id, roles: roles } = req.user

            let isTeacher = false

            roles.forEach(async (role) => {
                if (role === "TCHR") {
                    isTeacher = true
                }
            })

            if (!isTeacher) {
                return res.status(403).json({
                    message: "Error: can't find teacher entity in database!",
                })
            }

            let teacher = await Teacher.findOne({ src: _id })
            const { phone, desc, education, experience, city } = req.body
            teacher.phone = phone
            teacher.desc = desc
            teacher.education = education
            teacher.experience = experience
            teacher.city = city
            await teacher.save()

            return res.json({ message: "Changes applied succesfully!" })
        } catch (e) {
            console.log(e)
            return res
                .status(500)
                .json({ message: "Error occured while editing teacher data!" })
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken: refToken } = req.body

            if (!refToken) {
                return res
                    .status(403)
                    .json({ message: "Error: invalid refresh token!" })
            }

            await Token.findOneAndDelete({ value: refToken })

            return res
                .status(205)
                .json({ message: "You have succesfully logged out!" })
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Error occured while logging out!" })
        }
    }

    async token(req, res) {
        try {
            const { refreshToken: refToken } = req.body
            const candidate = Token.findOne({ value: refToken })
            if (!candidate) {
                return res
                    .status(401)
                    .json({ message: "Error: invalid refresh token!" })
            }

            const decToken = req.refreshToken

            const acToken = generateAccessToken(decToken.id, decToken.roles)

            return res.json({
                message: "Succesfully generated new access token!",
                token: acToken,
            })
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Error occured while getting new token!" })
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

            return res.json({ message: "Other sessions have been terminated!" })
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Error occured while ending other sessions!" })
        }
    }
}

module.exports = new authController()
