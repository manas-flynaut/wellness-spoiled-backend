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
            levelOfSelfCare: { type: String, trim: true, default: null },
            expressGratitude: { type: String, trim: true, default: null },
            startDay: { type: String, trim: true, default: null },
            bedTime: { type: String, trim: true, default: null }
        }
    ],
    savedUserAddress: [{
        countryName: { type: String, trim: true },
        addressLine1: { type: String, trim: true },
        addressLine2: { type: String, trim: true },
        city: { type: String, trim: true, },
        state: { type: String, trim: true, },
        zipCode: { type: Number, trim: true }
    }],
    savedUserCards: [{
        nameOnCard: { type: String, trim: true },
        cardNumber: { type: String, trim: true },
        expiryDate: { type: String, trim: true },
        cvv: { type: String, trim: true },
    }]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User