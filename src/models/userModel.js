const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: { type: String, required: [true, "Please add FirstName."] },
    lastName: { type: String },
    email: { type: String, required: [true, "Please add Email."] },
    password: { type: String, required: [true, "Please add password"] }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)