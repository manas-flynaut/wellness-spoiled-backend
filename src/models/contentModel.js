const mongoose = require("mongoose")

const contentSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please add Name."] },
    designation: { type: String, required: [true, "Please add designation."] },
    email: { type: String, required: [true, "Please add Email."] },
    website: { type: String, required: [true, "Please add description."] },
    description: { type: String, required: [true, "Please add description."] },
    content: { type: String, required: [true, "Please add content."] },
    image: { type: String, required: [false, "Please add content."] },
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Content = mongoose.model('Content', contentSchema)

module.exports = Content