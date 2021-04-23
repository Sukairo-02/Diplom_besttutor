const User = require("./models/User")
const Teacher = require("./models/Teacher")
const Role = require("./models/Role")
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
        expiresIn: "24h",
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

            const hashPass = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ value: "USER" })
            const user = new User({
                username: username,
                password: hashPass,
                email: email,
                dateOfBirth: dateOfBirth,
                roles: [userRole.value]
            })
            
            if(isTeacher)
            {
                let tchr = new Teacher()
                tchr._id = user._id //mongodb has no relations, will use _id to find teacher's data if user is teacher.
                await tchr.save()  //teacher must be forced into teacher data edit right after registration.
            }

            await user.save()

            return res.json({ message: "You've been registered succesfully!" })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: "Registration failed!" })
        }
    }

    async initRoles(req, res) { //dev function, will be deleted in prod version. Used to initialize list of available roles.
        try {
            req.roles.foreach(item => {
                const role = new Roles({value: role})
                await role.save()
            })
        } catch (e) {
            console.log(e)
            req.status(400).json({message: "Failed to assign roles!"})
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username: username })
            if (!user) {
                return res.status(400).json({
                    message: `Can't find account with username ${username}!`,
                })
            }

            const validPass = bcrypt.compareSync(password, user.password)
            if (!validPass) {
                return res.status(400).json({ message: "Invalid password!" })
            }

            const token = generateAccessToken(user._id, user.roles)

            return res.json({ token })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: "Login failed!" })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: "Info gather failed!" })
        }
    }
}

module.exports = new authController()
