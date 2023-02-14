const mongoose = require("mongoose")

const faqSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Please add title."] },
    content: { type: String, required: [true, "Please add content."] },
    // image: { type: String, enum: ["Privacy","Terms"]},
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Faq = mongoose.model('Faq', faqSchema)

module.exports = Faq