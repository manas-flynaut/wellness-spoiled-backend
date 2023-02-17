const CareNotes = require('../models/careNotes');
const User = require('../models/userModel');
const { loggerUtil } = require('../utils/logger');
const { BAD_REQUEST, OK, NOT_FOUND } = require('../utils/statusCode');
const { addNotification } = require('./notification');

const getCareNotesOfUser = async (req, res) => {
    try {
        const authId = req.auth._id
        const limit = req.query.limit || 10
        const skip = req.query.skip || 0
        User.findOne({ _id: authId })
            .then(user => {
                CareNotes
                    .find({ "user": user._id })
                    .limit(limit)
                    .skip(limit * skip)
                    .sort({ createdAt: -1 })
                    .then(careNotes => {
                        if (!careNotes) {
                            return res.status(NOT_FOUND).json({
                                error: 'No Care Notes were found in a DB!'
                            })
                        }
                        res.status(OK).json({
                            status: OK,
                            message: 'Care Notes Fetched Successfully!',
                            data: careNotes
                        })
                    })
            })
            .catch(err => {
                loggerUtil(err)
                res.status(BAD_REQUEST).json({
                    status: BAD_REQUEST,
                    err: err
                })
            })
    }
    catch (err) {
        loggerUtil({ err: err })
    }
    finally {
        loggerUtil("Get Care Notes of User API called.")
    }
}

const addCareNoteForUser = async (req, res) => {
    try {
        const { name, time, note } = req.body
        const userId = req.params.userId
        User.findOne({ userId: userId }).then(user => {
            const newCareNote = new CareNotes({
                user: user._id,
                name: name,
                time: time,
                note: note
            })
            newCareNote
                .save()
                .then(reminder => {
                    addNotification(user._id, "Your Care Note has been successfully Added.")
                    res.status(OK).json({
                        status: OK,
                        message: "Care Note Added Successfully.",
                        data: reminder
                    })
                })
                .catch(err => res.status(BAD_REQUEST).json({
                    status: BAD_REQUEST,
                    message: err.message
                }))
        }).catch(err => res.status(BAD_REQUEST).json({
            status: BAD_REQUEST,
            message: err
        }));
    }
    catch (err) {
        loggerUtil(err, 'ERROR')
    }
    finally {
        loggerUtil("Add Care Note API Called.")
    }
}

const updateCareNoteById = async (req, res) => {
    try {
        const careNoteId = req.params.careNoteId
        CareNotes.findOneAndUpdate({ _id: careNoteId }, req.body, { new: true })
            .then(updatedReminder => res.status(OK).json({
                status: OK,
                message: "Care Note successfully updated.",
                data: updatedReminder
            }))
            .catch(err => res.status(BAD_REQUEST).json({
                status: BAD_REQUEST,
                message: err.message
            }));
    }
    catch (err) {
        loggerUtil(err, 'ERROR')
    }
    finally {
        loggerUtil("Update Care Note API Called.")
    }
}

const deleteCareNoteById = async (req, res) => {
    try {
        const careNoteId = req.params.careNoteId
        CareNotes.findByIdAndDelete({ _id: careNoteId })
            .then((careNote) => {
                if (!careNote) {
                    return res.status(NOT_FOUND).json({
                        status: NOT_FOUND,
                        message: "Care Note not Found.",
                    })
                }
                res.status(OK).json({
                    status: OK,
                    message: "Care Note deleted Succesfully.",
                })
            })
            .catch(err => res.status(BAD_REQUEST).json({
                status: BAD_REQUEST,
                message: err.message
            }));
    }
    catch (err) {
        loggerUtil(err, 'ERROR')
    }
    finally {
        loggerUtil("Delete Care Note API Called.")
    }
}


module.exports = { getCareNotesOfUser, addCareNoteForUser, updateCareNoteById, deleteCareNoteById }