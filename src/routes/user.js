// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check } = require('express-validator')
const { isAdmin, isSameUserOrAdmin } = require('../middleware')
const { loggerUtil } = require('./../utils/logger')
const User = require("../models/userModel")
const { getUserById, getAllUsers, updateUserById, addOnboardingQuestions, addSavedAddress, updateSavedAddressByUserId, deleteSavedAddressByUserId, addSavedUserCards, updateSavedCardByUserId, deleteSavedCardByUserId } = require('../controllers/user')

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

userRoute.put('/user/update/saved-address/:userId',
    isSameUserOrAdmin,
    addSavedAddress
)

userRoute.put('/user/update/saved-address/update/:userId/:addressId',
    isSameUserOrAdmin,
    updateSavedAddressByUserId
)

userRoute.delete('/user/update/saved-address/delete/:userId/:addressId',
    isSameUserOrAdmin,
    deleteSavedAddressByUserId
)

userRoute.put('/user/update/saved-card/:userId',
    isSameUserOrAdmin,
    addSavedUserCards
)

userRoute.put('/user/update/saved-card/update/:userId/:cardId',
    isSameUserOrAdmin,
    updateSavedCardByUserId
)

userRoute.delete('/user/update/saved-card/delete/:userId/:cardId',
    isSameUserOrAdmin,
    deleteSavedCardByUserId
)

module.exports = userRoute