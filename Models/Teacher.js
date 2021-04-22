const { Schema, model } = require("mongoose")

const Teacher = new Schema({
    phone: { type: String, required: true, unique: true },
    desc: { type: String },
    education: { type: String },
    experience: { type: String },
    city: { type: String, required: true }
})

module.exports = model("Teacher", Teacher)