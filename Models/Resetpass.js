const { Schema, model } = require("mongoose")

const Resetpass = new Schema({
    value: { type: String, unique: true, required: true},
    src: {type: String, required: true},
    createdAt: { type: Date, expires: "15m", default: Date.now }
})

module.exports = model("Resetpass", Resetpass)