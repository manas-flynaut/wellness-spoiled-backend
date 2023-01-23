const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: [true, "Please add userId."] },
    role: { type: Number, required: [true, "Please add User - Type"] },
    name: { type: String, required: [true, "Please add Name."] },
    phone: { type: Number, unique: [true, "Phone Number already registered."], required: [true, "Please add Phone Number"] },
    email: { type: String, unique: [true, "Email already registered."], required: [true, "Please add Email."] },
    blocked: { type: Boolean, default: false },
    encrypted_password: { type: String, required: [true, "Please add password"] }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User