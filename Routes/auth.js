const Router = require("express")
const router = new Router()
const controller = require("./classes/authClass")
const { check } = require("express-validator")
const ensureRoles = require("./midware/ensureRoles")
const ensureAuth = require("./midware/ensureAuth")
const ensureDate = require("./midware/ensureDate")

router.post(
    "/register",
    [
        check("email", "Invalid email!").isEmail(),
        check("username", "You must enter a username!").notEmpty(),
        check(
            "password",
            "Password must have length between 4 and 24 characters!"
        ).isLength({ min: 4, max: 24 }),
        ensureDate
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

router.delete("/logout", ensureAuth, controller.logout)

router.post(
    "/edit",
    [
        check("username", "You must enter a username!").notEmpty(),
        ensureAuth,
        ensureDate
    ],
    controller.edit
)

router.post(
    "/editteacher",
    [
        check("phone", "Invalid phone number!").isMobilePhone(),
        check("city", "You must enter a city!").notEmpty(),
        ensureRoles(["TCHR"])
    ],
    controller.editteacher
)
    
router.post("/initroles", controller.initRoles)

router.get("/userdata", ensureAuth, controller.userdata)

router.get("/lightdata", ensureAuth, controller.lightdata)

router.post("/token", controller.token)

module.exports = router
