const mongoose = require('mongoose');

const savedUserAddress = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    countryName: { type: String, required: [true, "Please add Country Name."], trim: true, },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: [true, "Please add City Name."], trim: true, },
    state: { type: String, required: [true, "Please add State Name."], trim: true, },
    zipCode: { type: Number, required: [true, "Please add Zip-Code Name."] }
}, { timestamps: true })

const SavedUserAddress = mongoose.model("SavedUserAddress", savedUserAddress)

module.exports = SavedUserAddress