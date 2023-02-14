const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    title: { type: String, required: [true, "Please add Title."] },
    image: { type: String, required: [false, "Please add Image."] },
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category