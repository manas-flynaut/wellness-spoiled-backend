const express = require("express")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { loggerUtil } = require("../utils/logger")
const { OK, WRONG_ENTITY, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } = require("../utils/statusCode")
const User = require("../models/userModel")
const { validationResult } = require('express-validator')
const { hashPassword, authenticate } = require("../helpers/auth")
const { response } = require("express")
const messagebird = require('messagebird')(process.env.MESSAGE_BIRD_API_KEY);

const sendOtpRequest = async (req, res) => {
    const { phone } = req.body
    const params = {
        template: "Your OTP for Wellness Spoiled is %token",
        timeout: 60
    }
    try {
        messagebird.verify.create(phone, params, function (err, response) {
            if (err) {
                return res.status(err.statusCode).json(err)
            }
            return res.status(OK).json({
                message: "OTP send Successfully.",
                data: response
            })
        })
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
    const { name, phone, email, password } = req.body
    try {
        User.findOne({ email: email }).then(user => {
            if (user)
                return res.status(BAD_REQUEST).json({ error: "Email already registered." });
        })
        User.findOne({ phone: phone }).then(user => {
            if (user)
                return res.status(BAD_REQUEST).json({ error: "Phone Number already regitered." });
        })
        const newUser = new User({
            userId: 1,
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
        User.findOne({ email: userName }).then(user => {
            if (!user) {
                User.findOne({ phone: userName }).then(userWithPhone => {
                    if (!userWithPhone)
                        return res.status(NOT_FOUND).json({ error: "User Not Fount." });
                    else {
                        const userData = user ? user : userWithPhone
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

const signout = (res) => {
    res.status(OK).json({
        message: 'User Signed Out Sucessfully!'
    })
}

const forgotPassword = async (req, res) => {
    try {
        res.status(OK).json(req.body)
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil(`Sign up API called by user - ${req.body.email}`)
    }
}

module.exports = { sendOtpRequest, signUp, login, signout, forgotPassword, }