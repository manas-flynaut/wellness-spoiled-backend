// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check } = require('express-validator')
const { isAdmin, isSameUserOrAdmin } = require('../middleware')
const { loggerUtil } = require('./../utils/logger')
const User = require("../models/userModel")
const { getUserById, getAllUsers, updateUserById, addOnboardingQuestions, userAction } = require('../controllers/user')

const userRoute = express.Router()

userRoute.get(
    '/user/get/:userId',
    isSameUserOrAdmin,
    getUserById
)

userRoute.put(
    '/user/update/:userId',
    isSameUserOrAdmin,
    updateUserById
)

userRoute.get(
    '/user/get-all',
    isAdmin,
    getAllUsers
)

userRoute.put('/user/update/questions/:userId',
    isSameUserOrAdmin,
    addOnboardingQuestions
)


// userRoute.patch(
//     '/user/action/:userId',
//     isAdmin, 
//     userAction
// )

module.exports = userRoute