const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ejournalSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ejournal: { type: String },
    gratitude: { type: String },
    gratitudeNote: { type: String },
    hydration: {
        hydrationGoal: { type: String, default: "20oz" },
        actualIntake: { type: String, default: "14oz" }
    },
    rateYourDay: { type: String },
    notes: { type: String },
    week: { type: String },
    score: { type: String, default: "0" },
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Ejournal = mongoose.model('Ejournal', ejournalSchema)

module.exports = Ejournal