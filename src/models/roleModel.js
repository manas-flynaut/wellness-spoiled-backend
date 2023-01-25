const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please add Name."] },
    description: { type: String, required: [true, "Please add description."] },
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Role = mongoose.model('Role', roleSchema)

module.exports = Role