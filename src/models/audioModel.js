const mongoose = require("mongoose")
const Schema = mongoose.Schema

const audioSchema = new mongoose.Schema({
    audio: { type: String, required: [true, "Please add audio."] },
    // pageType: { type: String, enum: ["Privacy","Terms"]},
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Audio = mongoose.model('Audio', audioSchema)

module.exports = Audio