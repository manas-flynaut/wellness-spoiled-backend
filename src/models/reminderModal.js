const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    type: { type: Number, required: [true, "Please add Reminder Type."] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: [true, "Please add Reminder Name."], trim: true, },
    reminderData: { type: String },
    time: { type: String, required: [true, "Please add Time."] },
    note: { type: String },
}, { timestamps: true })

const Reminder = mongoose.model("Reminder", reminderSchema)

module.exports = Reminder