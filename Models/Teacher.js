const { Schema, model } = require("mongoose")

const Teacher = new Schema({
    src: { type: String, required: true, unique: true },
    phone: { type: String, required: true, default: "TBA" },
    desc: { type: String },
    education: { type: String },
    experience: { type: String },
    city: { type: String, required: true, default: "TBA" },
})

module.exports = model("Teacher", Teacher)
