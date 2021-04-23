const Router = require("express")
const router = new Router()
const controller = require("./classes/authClass")
const { check } = require("express-validator")
const authMidware = require("./midware/ensureAuth")
const roleMidware = require("./midware/ensureRoles")
const ensureAuth = require("./midware/ensureAuth")

router.post(
    "/register",
    [
        check("email", "Invalid email!").isEmail(),
        check("username", "You must enter a username!").notEmpty(),
        check(
            "password",
            "Password must have length between 4 and 24 characters!"
        ).isLength({ min: 4, max: 24 }),
    ],
    controller.register
)

router.post(
    "/login",
    [
        check("email", "Invalid email!").isEmail(),
        check(
            "password",
            "Password must have length between 4 and 24 characters!"
        ).isLength({ min: 4, max: 24 }),
    ],
    controller.login
)

router.post("/logout", controller.logout)

router.post(
    "/edit",
    [
        check("username", "You must enter a username!").notEmpty(),
        ensureAuth,
    ],
    controller.edit
)

router.post(
    "/editteacher",
    [
        check("phone", "Invalid phone number!").isMobilePhone(),
        check("city", "You must enter a city!").notEmpty(),
        ensureAuth,
    ],
    controller.editteacher
)
    


router.post("/initroles", controller.initRoles)

router.get("/userdata", ensureAuth, controller.userdata)

router.get("/lightdata", ensureAuth, controller.lightdata)

module.exports = router
