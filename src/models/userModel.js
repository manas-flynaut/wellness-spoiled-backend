const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: [true, "Please add userId."] },
    name: { type: String, required: [true, "Please add Name."] },
    phone: { type: Number, unique: [true, "Phone Number already registered."], required: [true, "Please add Phone Number"] },
    email: { type: String, unique: [true, "Email already registered."], required: [true, "Please add Email."] },
    encrypted_password: { type: String, required: [true, "Please add password"] }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User