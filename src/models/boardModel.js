const mongoose = require("mongoose")
const Schema = mongoose.Schema

const boardSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String },
    images: [{
        url : {type: String },
        title: {type: String } 
    }],
    status: { type: Boolean, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Board = mongoose.model('Board', boardSchema)

module.exports = Board