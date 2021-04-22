const { Schema, model } = require("mongoose")

const Teacher = new Schema({
    phone: { type: String, required: true, unique: true },
    desc: { type: String },
    education: { type: String },
    experience: { type: String },
    city: { type: String, required: true },
    roles: [{ type: String, ref: "Role" }], //possible roles: 'USER', 'TCHR'
})

module.exports = model("Teacher", Teacher)