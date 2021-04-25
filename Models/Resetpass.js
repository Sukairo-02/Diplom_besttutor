const { Schema, model } = require("mongoose")

const Resetpass = new Schema({
    value: { type: String, unique: true, required: true},
    src: {type: String, required: true}
})

module.exports = model("Resetpass", Resetpass)