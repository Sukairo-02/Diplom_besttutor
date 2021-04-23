const { Schema, model } = require("mongoose")

const Teacher = new Schema({
    phone: { type: String, required: true, unique: true, default: "TBA" },
    desc: { type: String },
    education: { type: String },
    experience: { type: String },
    city: { type: String, required: true, default: "TBA" }
})

module.exports = model("Teacher", Teacher)