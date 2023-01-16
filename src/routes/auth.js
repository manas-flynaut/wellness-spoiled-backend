// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check } = require('express-validator')
const { isSignedIn, isValidToken, isAdmin } = require('./../middleware/index')
const { signUp, signout, login, forgotPassword, sendOtpRequest } = require('../controllers/auth')

const authRoute = express.Router()

authRoute.post(
    '/sendOtp',
    [
        check('phone')
            .isLength({
                min: 3
            })
            .withMessage('Please provide a phone'),
    ],
    sendOtpRequest
)

authRoute.post(
    '/signup',
    [
        check('name')
            .isLength({
                min: 3
            })
            .withMessage('Please provide a name'),
        check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password length should be minimum of 8 characters')
    ],
    signUp
)

authRoute.post(
    '/login',
    [
        check('userName').isLength({ min: 3 }).withMessage('Please provide a valid Email / Phone Number.'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password length should be minimum of 8 characters')
    ],
    login
)

authRoute.get('/signout', signout)

authRoute.post('/forgot-password', forgotPassword)

module.exports = authRoute
