// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check, body } = require('express-validator')
const { isSignedIn, isValidToken, isAdmin } = require('./../middleware/index')
const { signUp, signout, login, forgotPassword, sendOtpRequest } = require('../controllers/auth')

const authRoute = express.Router()

authRoute.post(
    '/sendOtp',
    [
        check('countryCode')
            .isLength({
                min: 1
            })
            .withMessage('Please provide a Country Code.'),
        check('phone')
            .isLength({
                min: 3
            })
            .withMessage('Please provide a Phone Number.'),
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
        check('phone')
            .isMobilePhone()
            .withMessage('Please provide a valid Phone Number!'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password length should be minimum of 8 characters'),
        check('otp')
            .isLength({ min: 4 })
            .withMessage('OTP Length should be 4 digits')
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

authRoute.post('/forgot-password',
    [
        check('newPassword')
            .isLength({ min: 8 })
            .withMessage('Password length should be minimum of 8 characters'),
        check('phone')
            .isMobilePhone()
            .withMessage('Please provide a valid Phone Number!'),
        check('otp')
            .isLength({ min: 4 })
            .withMessage('OTP Length should be 4 digits')
    ],
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    forgotPassword)

module.exports = authRoute
