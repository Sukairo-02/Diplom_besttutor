const { Schema, model } = require("mongoose")

const Token = new Schema({
    value: { type: String, unique: true, required: true},
    src: {type: String, required: true}
})

module.exports = model("Token", Token)