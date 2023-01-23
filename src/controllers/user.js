const User = require("../models/userModel")
const { loggerUtil } = require("../utils/logger")
const { OK, NOT_FOUND } = require("../utils/statusCode")

const getUserById = async (req, res) => {
    try {
        const id = req.params
        User
            .findOne(
                id,
                { salt: 0, encrypted_password: 0, __v: 0, profilePhoto: 0 }
            )
            .exec((err, user) => {
                if (err || !user) {
                    return res.status(NOT_FOUND).json({
                        error: 'No user was found in DB!'
                    })
                }
                res.status(OK).json({
                    message: 'User Fetched Successfully!',
                    data: user
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get User By Id Function is Executed!')
    }
}

const getAllUsers = async (req, res) => {
    try {
        User
            .find({}, { salt: 0, encrypted_password: 0, profilePhoto: 0 })
            .sort({ createdAt: -1 })
            .exec((err, user) => {
                if (err || !user) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No users were found in a DB!'
                    })
                }
                res.status(OK).json({
                    message: 'Users Fetched Successfully!',
                    data: user
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All Users Function is Executed')
    }
}

const blockUser = async (req, res) => {
    try {
        const id = req.params
        User.findOneAndUpdate({ "userId": uid }, { blocked: req.body.block }, { new: true })
            .then(updatedUser => res.status(OK).json({
                message: "Block Status of User updated Successfully.",
                data: updatedUser
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Block User By Id Function is Executed!')
    }
}

module.exports = { getUserById, getAllUsers, blockUser }