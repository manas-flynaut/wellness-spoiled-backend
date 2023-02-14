const mongoose = require("mongoose")

const shopSchema = new mongoose.Schema({
    url: { type: String, required: [true, "Please add Url."] },
    type: { type: String, enum: ["Amazon","Other"],default: "Amazon"},
    playstoreLink: { type: String, required: [false, "Please add designation."] },
    appstoreLink: { type: String, required: [false, "Please add Email."] },
    phone: { type: String, required: [false, "Please add description."] },
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop