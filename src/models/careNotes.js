const mongoose = require('mongoose');

const careNotesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: [true, "Please add Reminder Name."], trim: true, },
    time: { type: String, required: [true, "Please add Time."] },
    note: { type: String },
}, { timestamps: true })

const CareNotes = mongoose.model("CareNotes", careNotesSchema)

module.exports = CareNotes