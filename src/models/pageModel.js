const mongoose = require("mongoose")

const pageSchema = new mongoose.Schema({
    content: { type: String, required: [true, "Please add description."] },
    pageType: { type: String, enum: ["Privacy","Terms"]},
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Page = mongoose.model('Page', pageSchema)

module.exports = Page