const { Schema, model } = require("mongoose")

const User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    avatar: { type: String },
    teacher: {
        phone: { type: String, required: true, default: "Insert your phone number.", unique: true },
        desc: { type: String },
        education: { type: String },
        experience: { type: String },
        city: { type: String, required: true, default:"Insert your city." },
    },
    roles: [{ type: String, ref: "Role" }], //possible roles: 'USER', 'TCHR'
})

module.exports = model("User", User)
