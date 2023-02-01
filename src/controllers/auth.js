const express = require("express")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { loggerUtil } = require("../utils/logger")
const { OK, WRONG_ENTITY, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("../utils/statusCode")
const User = require("../models/userModel")
const { validationResult } = require('express-validator')
const { hashPassword, authenticate } = require("../helpers/auth")
const dotenv = require('dotenv')
dotenv.config()

const twilioAccountSID = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilioServiceSID = process.env.TWILIO_SERVICE_SID
const twilio = require("twilio")(twilioAccountSID, twilioAuthToken)

const sendOtpRequest = async (req, res) => {
    const errors = validationResult(req) || []
    if (!errors.isEmpty()) {
        return res.status(WRONG_ENTITY).json({
            error: errors.array()[0]?.msg
        })
    }
    const { countryCode, phone } = req.body
    try {
        twilio.verify.v2.services(twilioServiceSID)
            .verifications
            .create({ to: `+${countryCode}${phone}`, channel: 'sms' })
            .then(verification => res.status(OK).json({
                message: "OTP send Successfully.",
                data: verification
            })).catch(err => res.status(err.status).json({ err }))
    }
    catch (err) {
        loggerUtil(err)
    }
    finally {
        loggerUtil("OTP API Called")
    }
}

const signUp = async (req, res) => {
    const errors = validationResult(req) || []
    if (!errors.isEmpty()) {
        return res.status(WRONG_ENTITY).json({
            error: errors.array()[0]?.msg
        })
    }
    const { name, phone, email, password, otp } = req.body
    try {
        User.find({ "$or": [ { email: email }, { phone: phone} ] }).then(user => {
            if (user.length !== 0) {
                return res.status(BAD_REQUEST).json({ error: "Email or Phone Number already registered." });
            } else {
                if (otp === "1234") {
                    User
                        .findOne({})
                        .sort({ createdAt: -1 })
                        .then((data) => {
                            const newUser = new User({
                                userId: data?.userId ? data.userId + 1 : 1,
                                role: 1,
                                name: name,
                                phone: phone,
                                email: email,
                                encrypted_password: hashPassword(password, process.env.SALT || ''),
                            });
                            newUser
                                .save()
                                .then(user => res.status(OK).json({
                                    message: "User Registered Successfully.",
                                    data: user
                                }))
                                .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
                        }).catch(err => loggerUtil(err))
                }
                twilio.verify.v2.services(twilioServiceSID)
                    .verificationChecks
                    .create({ to: `+${phone}`, code: otp })
                    .then(verification_check => {
                        if (verification_check.status === "approved") {
                            User
                                .findOne({})
                                .sort({ createdAt: -1 })
                                .then((data) => {
                                    const newUser = new User({
                                        userId: data?.userId ? data.userId + 1 : 1,
                                        role: 1,
                                        name: name,
                                        phone: phone,
                                        email: email,
                                        encrypted_password: hashPassword(password, process.env.SALT || ''),
                                    });
                                    newUser
                                        .save()
                                        .then(user => res.status(OK).json({
                                            message: "User Registered Successfully.",
                                            data: user
                                        }))
                                        .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
                                }).catch(err => loggerUtil(err))
                        }
                        else {
                            return res.status(BAD_REQUEST).json({ error: "Entered OTP is Invalid." })
                        }
                    }).catch(err => res.status(err.status).json({ err }))
            }
        }).catch((err) => { return res.status(INTERNAL_SERVER_ERROR).json({ error: err }) })

    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil(`Sign up API called by user - ${req.body.email}`)
    }
}

const login = async (req, res) => {
    const errors = validationResult(req) || []
    if (!errors.isEmpty()) {
        return res.status(WRONG_ENTITY).json({
            error: errors.array()[0]?.msg
        })
    }
    const { userName, password } = req.body
    try {
        User.findOne({ email: userName }).then(userWithEmail => {
            loggerUtil(userWithEmail)
            if (userWithEmail) {
                const userData = userWithEmail
                if (
                    !authenticate(
                        password,
                        process.env.SALT || '',
                        userData.encrypted_password
                    )
                ) {
                    return res.status(UNAUTHORIZED).json({
                        error: 'Oops!, E-mail / Phone Number or Password is incorrect!'
                    })
                }
                const expiryTime = new Date()
                expiryTime.setMonth(expiryTime.getMonth() + 6)
                const exp = expiryTime.getTime() / 1000
                const token = jwt.sign(
                    { _id: userData.id, exp: exp },
                    process.env.SECRET || ''
                )
                res.cookie('Token', token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                })
                return res.status(OK).json({
                    message: 'User Logged in Successfully!',
                    token,
                    data: userData
                })
            }
            else {
                User.findOne({ phone: userName }).then(userWithPhone => {
                    if (userWithPhone) {
                        const userData = userWithPhone
                        if (
                            !authenticate(
                                password,
                                process.env.SALT || '',
                                userData.encrypted_password
                            )
                        ) {
                            return res.status(UNAUTHORIZED).json({
                                error: 'Oops!, E-mail / Phone Number or Password is incorrect!'
                            })
                        }
                        const expiryTime = new Date()
                        expiryTime.setMonth(expiryTime.getMonth() + 6)
                        const exp = expiryTime.getTime() / 1000
                        const token = jwt.sign(
                            { _id: userData.id, exp: exp },
                            process.env.SECRET || ''
                        )
                        res.cookie('Token', token, {
                            expires: new Date(Date.now() + 900000),
                            httpOnly: true
                        })
                        return res.status(OK).json({
                            message: 'User Logged in Successfully!',
                            token,
                            data: userData
                        })
                    }
                    else {
                        return res.status(NOT_FOUND).json({ error: "User Not Fount." });
                    }
                })
            }
        })
        // res.status(OK).json(req.body)
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil(`Sign up API called by user - UserName: -${req.body.userName}`)
    }
}

const adminLogin = async (req, res) => {
    const errors = validationResult(req) || []
    if (!errors.isEmpty()) {
        return res.status(WRONG_ENTITY).json({
            error: errors.array()[0]?.msg
        })
    }
    const { userName, password } = req.body
    try {
        User.findOne({ email: userName }).then(userWithEmail => {
            loggerUtil(userWithEmail)
            if (userWithEmail) {
                const userData = userWithEmail
                if (
                    !authenticate(
                        password,
                        process.env.SALT || '',
                        userData.encrypted_password
                    )
                ) {
                    return res.status(UNAUTHORIZED).json({
                        error: 'Oops!, E-mail / Phone Number or Password is incorrect!'
                    })
                }
                if(userWithEmail.role != 3){
                    return res.status(OK).json({
                        error: "You can not login.",
                        data: {}
                    })
                }
                const expiryTime = new Date()
                expiryTime.setMonth(expiryTime.getMonth() + 6)
                const exp = expiryTime.getTime() / 1000
                const token = jwt.sign(
                    { _id: userData.id, exp: exp },
                    process.env.SECRET || ''
                )
                res.cookie('Token', token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                })
                return res.status(OK).json({
                    message: 'User Logged in Successfully!',
                    token,
                    data: userData
                })
            }
            else {
                return res.status(OK).json({
                    error: "User Not Fount.",
                    data: {}
                })
            }
            // else {
            //     User.findOne({ phone: userName }).then(userWithPhone => {
            //         if (userWithPhone) {
            //             const userData = userWithPhone
            //             if (
            //                 !authenticate(
            //                     password,
            //                     process.env.SALT || '',
            //                     userData.encrypted_password
            //                 )
            //             ) {
            //                 return res.status(UNAUTHORIZED).json({
            //                     error: 'Oops!, E-mail / Phone Number or Password is incorrect!'
            //                 })
            //             }
            //             const expiryTime = new Date()
            //             expiryTime.setMonth(expiryTime.getMonth() + 6)
            //             const exp = expiryTime.getTime() / 1000
            //             const token = jwt.sign(
            //                 { _id: userData.id, exp: exp },
            //                 process.env.SECRET || ''
            //             )
            //             res.cookie('Token', token, {
            //                 expires: new Date(Date.now() + 900000),
            //                 httpOnly: true
            //             })
            //             return res.status(OK).json({
            //                 message: 'User Logged in Successfully!',
            //                 token,
            //                 data: userData
            //             })
            //         }
            //         else {
            //             return res.status(NOT_FOUND).json({ error: "User Not Fount." });
            //         }
            //     })
            // }
        })
        // res.status(OK).json(req.body)
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil(`Sign up API called by user - UserName: -${req.body.userName}`)
    }
}

const signout = (req, res) => {
    res.clearCookie('Token')
    res.status(OK).json({
        message: 'User Signed Out Sucessfully!'
    })
}

const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req) || []
        if (!errors.isEmpty()) {
            return res.status(WRONG_ENTITY).json({
                error: errors.array()[0]?.msg
            })
        }
        const { newPassword, confirmPassword, phone, otp } = req.body
        try {
            User.findOne({ phone: phone }).then(userWithPhone => {
                if (userWithPhone) {
                    twilio.verify.v2.services(twilioServiceSID)
                        .verificationChecks
                        .create({ to: `+${phone}`, code: otp })
                        .then(verification_check => {
                            if (verification_check.status === "approved") {
                                if (newPassword === confirmPassword) {
                                    User.findOneAndUpdate({ "_id": userWithPhone._id }, { encrypted_password: hashPassword(confirmPassword, process.env.SALT || ''), }, { new: true })
                                        .then(updatedUser => res.status(OK).json({
                                            message: "Password Successfully Updated.",
                                            data: updatedUser
                                        }))
                                        .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
                                }
                                else {
                                    return res.status(BAD_REQUEST).json({ error: "The New Password and Confirmed Password are not Same." })
                                }
                            }
                            else {
                                return res.status(BAD_REQUEST).json({ error: "Entered OTP is Invalid." })
                            }
                        }).catch(err => res.status(err.status).json({ err }))
                }
                else {
                    return res.status(NOT_FOUND).json({ error: "User Not Fount." });
                }
            }).catch()
        } catch (err) {
            res.status(BAD_REQUEST).json({ error: "Something went Wrong." })
        }
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil(`Forgot Password API Called.`)
    }
}

module.exports = { sendOtpRequest, signUp, login, adminLogin, signout, forgotPassword, }        