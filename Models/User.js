const { Schema, model } = require("mongoose")

const User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    avatar: { type: String },
    roles: [{ type: String, ref: "Role" }], //possible roles: 'USER', 'TCHR'
})

module.exports = model("User", User)
