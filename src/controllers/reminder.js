const Reminder = require('../models/reminderModal');
const User = require('../models/userModel');
const { loggerUtil } = require('../utils/logger');
const { BAD_REQUEST, OK, NOT_FOUND } = require('../utils/statusCode');

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

const addReminder = async (req,res) => {
    const newNotification = new Notification({
        user: userId,
        description: description
    })
    newNotification.save().then(() => { return })
        .catch(err => { loggerUtil({ err: err }) })
        .finally(() => loggerUtil("Add Notification API called."))
}



module.exports = { getReminderOfUser, }