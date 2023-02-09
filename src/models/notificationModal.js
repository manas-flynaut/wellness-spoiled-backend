const mongoose = require("mongoose")

const notificationSceham = new mongoose.Schema({
    description: { type: String, required: [true, "Please Insert Description of the Notification"] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true })

const Notification = mongoose.model('Notification', notificationSceham)

module.exports = Notification