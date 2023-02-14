const Reminder = require('../models/reminderModal');
const User = require('../models/userModel');
const { loggerUtil } = require('../utils/logger');
const { BAD_REQUEST, OK, NOT_FOUND } = require('../utils/statusCode');
const { addNotification } = require('./notification');

const getReminderOfUser = async (req, res) => {
    try {
        const authId = req.auth._id
        const limit = req.query.limit || 10
        const skip = req.query.skip || 0
        User.findOne({ _id: authId })
            .then(user => {
                Reminder
                    .find({ "user": user._id })
                    .limit(limit)
                    .skip(limit * skip)
                    .sort({ createdAt: -1 })
                    .then(Reminder => {
                        if (!Reminder) {
                            return res.status(NOT_FOUND).json({
                                error: 'No Reminder were found in a DB!'
                            })
                        }
                        res.status(OK).json({
                            status: OK,
                            message: 'Reminders Fetched Successfully!',
                            data: Reminder
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
        loggerUtil("Get Reminder of User API called.")
    }
}

const addReminderForUser = async (req, res) => {
    try {
        const { type, name, reminderData, time, note } = req.body
        const userId = req.params.userId
        User.findOne({ userId: userId }).then(user => {
            const newReminder = new Reminder({
                user: user._id,
                type: type,
                name: name,
                reminderData: reminderData,
                time: time,
                note: note
            })
            newReminder
                .save()
                .then(reminder => {
                    addNotification(user._id, "Your Reminder has been successfully Setuped.")
                    res.status(OK).json({
                        status: OK,
                        message: "Reminder Added Successfully.",
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
        loggerUtil("Add Reminder API Called.")
    }
}

const updateReminderById = async (req, res) => {
    try {
        const reminderId = req.params.reminderId
        Reminder.findOneAndUpdate({ _id: reminderId }, req.body, { new: true })
            .then(updatedReminder => res.status(OK).json({
                status: OK,
                message: "Reminder successfully updated.",
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
        loggerUtil("Update Reminder API Called.")
    }
}

const deleteReminderById = async (req, res) => {
    try {
        const reminderId = req.params.reminderId
        Reminder.findByIdAndDelete({ _id: reminderId })
            .then(() => res.status(OK).json({
                status: OK,
                message: "Reminder deleted Succesfully.",
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
        loggerUtil("Delete Reminder API Called.")
    }
}


module.exports = { getReminderOfUser, addReminderForUser, updateReminderById, deleteReminderById }