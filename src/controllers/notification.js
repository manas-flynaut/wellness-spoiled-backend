const Notification = require('../models/notificationModal');
const User = require('../models/userModel');
const { loggerUtil } = require('../utils/logger');
const { BAD_REQUEST, OK, NOT_FOUND } = require('../utils/statusCode');


const addNotification = (userId, description) => {
    const newNotification = new Notification({
        user: userId,
        description: description
    })
    newNotification.save().then(() => { return })
        .catch(err => { loggerUtil({ err: err }) })
        .finally(() => loggerUtil("Add Notification API called."))
}

const getAllNotificationsOfUser = async (req, res) => {
    try {
        const authId = req.auth._id
        const limit = req.query.limit || 10
        const skip = req.query.skip || 0
        User.findOne({ _id: authId })
            .then(user => {
                Notification
                    .find({ "user": user._id })
                    .limit(limit)
                    .skip(limit * skip)
                    .sort({ createdAt: -1 })
                    .then(notification => {
                        if (!notification) {
                            return res.status(NOT_FOUND).json({
                                error: 'No Notifications were found in a DB!'
                            })
                        }
                        res.status(OK).json({
                            status: OK,
                            message: 'Notifications Fetched Successfully!',
                            data: notification
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
        loggerUtil("Get Notification API called.")
    }
}

module.exports = { addNotification, getAllNotificationsOfUser }