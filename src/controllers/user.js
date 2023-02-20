const User = require("../models/userModel")
const { loggerUtil } = require("../utils/logger")
const { OK, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../utils/statusCode")

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
        const limit = req.query.limit || 10
        const skip = req.query.skip || 0
        User
            .find({}, { salt: 0, encrypted_password: 0, profilePhoto: 0 })
            .limit(limit)
            .skip(limit * skip)
            .sort({ createdAt: -1 })
            .exec((err, user) => {
                if (err || !user) {
                    return res.status(NOT_FOUND).json({
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

const updateUserById = async (req, res) => {
    try {
        const id = req.params
        User.findOneAndUpdate(id, req.body, { new: true })
            .then(updatedUser => res.status(OK).json({
                status: OK,
                message: "User profile data successfully updated.",
                data: updatedUser
            }))
            .catch(err => res.status(BAD_REQUEST).json({
                status: BAD_REQUEST,
                message: err.message
            }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get User By Id Function is Executed!')
    }
}

const addOnboardingQuestions = async (req, res) => {
    const id = req.auth._id
    let result = req.body
    try {
        User.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            User
                .updateOne(
                    { _id: id }, { onboardingQuestions: result }
                )
                .then(() => {
                    res.status(OK).json({
                        status: OK,
                        message: 'Questions Added Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        error: 'User Updation Failed!'
                    })
                    loggerUtil(err, 'ERROR')
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Add Onboarding Questions Function is Executed')
    }
}

const addSavedAddress = async (req, res) => {
    const id = req.auth._id
    let result = req.body
    try {
        User.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            User
                .updateOne(
                    { _id: id },
                    {
                        $push: { savedUserAddress: result }
                    }
                )
                .then(() => {
                    res.status(OK).json({
                        status: OK,
                        message: 'Address Saved Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        error: 'User Updation Failed!'
                    })
                    loggerUtil(err, 'ERROR')
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Add Saved Address Function is Executed')
    }
}

const updateSavedAddressByUserId = async (req, res) => {
    const id = req.auth._id
    const addressId = req.params.addressId
    let newData = req.body
    try {
        User.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            const result = data.savedUserAddress.filter(val => val._id.toString() !== addressId.toString())
            if (result.length === data.savedUserAddress.length) {
                return res.status(NOT_FOUND).json({
                    status: NOT_FOUND,
                    message: 'Address not Found !'
                })
            }
            result.push(newData)
            User
                .updateOne(
                    { _id: id },
                    { savedUserAddress: result }
                )
                .then(() => {
                    res.status(OK).json({
                        status: OK,
                        message: 'Address updated Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        error: 'User Updation Failed!'
                    })
                    loggerUtil(err, 'ERROR')
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update Saved Address Function is Executed')
    }
}

const deleteSavedAddressByUserId = async (req, res) => {
    const id = req.auth._id
    const addressId = req.params.addressId
    try {
        User.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            const result = data.savedUserAddress.filter(val => val._id.toString() !== addressId.toString())
            if (result.length === data.savedUserAddress.length) {
                return res.status(NOT_FOUND).json({
                    status: NOT_FOUND,
                    message: 'Address not Found !'
                })
            }
            User
                .updateOne(
                    { _id: id },
                    { savedUserAddress: result }
                )
                .then(() => {
                    res.status(OK).json({
                        status: OK,
                        message: 'Address deleted Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        error: 'Address Updation Failed!'
                    })
                    loggerUtil(err, 'ERROR')
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Delete Saved Address Function is Executed')
    }
}

const addSavedUserCards = async (req, res) => {
    const id = req.auth._id
    let result = req.body
    try {
        User.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            User
                .updateOne(
                    { _id: id },
                    {
                        $push: { savedUserCards: result }
                    }
                )
                .then(() => {
                    res.status(OK).json({
                        status: OK,
                        message: 'Card Details Saved Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        error: 'Address deletion Failed!'
                    })
                    loggerUtil(err, 'ERROR')
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Add User Card Function is Executed')
    }
}

const updateSavedCardByUserId = async (req, res) => {
    const id = req.auth._id
    const cardId = req.params.cardId
    let newData = req.body
    try {
        User.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            const result = data.savedUserCards.filter(val => val._id.toString() !== cardId.toString())
            if (result.length === data.savedUserCards.length) {
                return res.status(NOT_FOUND).json({
                    status: NOT_FOUND,
                    message: 'Card not Found !'
                })
            }
            result.push(newData)
            User
                .updateOne(
                    { _id: id },
                    { savedUserCards: result }
                )
                .then(() => {
                    res.status(OK).json({
                        status: OK,
                        message: 'Card updated Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        error: 'Card Updation Failed!'
                    })
                    loggerUtil(err, 'ERROR')
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update Card Function is Executed')
    }
}


const deleteSavedCardByUserId = async (req, res) => {
    const id = req.auth._id
    const cardId = req.params.cardId
    try {
        User.findOne({ _id: id }).exec((err, data) => {
            if (err || !data) {
                return res.status(NOT_FOUND).json({
                    error: 'User Not Found!'
                })
            }
            const result = data.savedUserCards.filter(val => val._id.toString() !== cardId.toString())
            if (result.length === data.savedUserCards.length) {
                return res.status(NOT_FOUND).json({
                    status: NOT_FOUND,
                    message: 'Card not Found !'
                })
            }
            User
                .updateOne(
                    { _id: id },
                    { savedUserCards: result }
                )
                .then(() => {
                    res.status(OK).json({
                        status: OK,
                        message: 'Card deleted Successfully!'
                    })
                })
                .catch((err) => {
                    res.status(INTERNAL_SERVER_ERROR).json({
                        error: 'Card deletion Failed!'
                    })
                    loggerUtil(err, 'ERROR')
                })
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Delete Card Function is Executed')
    }
}

module.exports = {
    getUserById,
    getAllUsers,
    updateUserById,
    addOnboardingQuestions,
    addSavedAddress,
    updateSavedAddressByUserId,
    deleteSavedAddressByUserId,
    addSavedUserCards,
    updateSavedCardByUserId,
    deleteSavedCardByUserId
}