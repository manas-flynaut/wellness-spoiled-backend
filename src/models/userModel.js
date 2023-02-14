const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: [true, "Please add userId."] },
    role: { type: Number, required: [true, "Please add User - Type"] },
    name: { type: String, required: [true, "Please add Name."], trim: true, },
    countryCode: { type: Number, required: [true, "Please add Country Code."], },
    phone: { type: Number, unique: [true, "Phone Number already registered."], required: [true, "Please add Phone Number"] },
    email: { type: String, unique: [true, "Email already registered."], required: [true, "Please add Email."], trim: true, },
    dob: { type: String },
    blocked: { type: Boolean, default: false },
    gender: { type: Number },
    encrypted_password: { type: String, required: [true, "Please add password"] },
    onboardingQuestions: [
        {
            levelOfSelfCare: {
                type: String,
                trim: true,
                default: null
            },
            expressGratitude: {
                type: String,
                trim: true,
                default: null
            },
            startDay: {
                type: String,
                trim: true,
                default: null
            },
            bedTime: {
                type: String,
                trim: true,
                default: null
            }
        }

    ]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User