// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check } = require('express-validator')
const { isAdmin, isSameUserOrAdmin } = require('../middleware')
const { loggerUtil } = require('../utils/logger')
const { fileUploader } = require("../utils/fileUploader");
const Content = require("../models/contentModel")
const { content, getAllList } = require('../controllers/admin')

const adminRoute = express.Router()

const upload = fileUploader("/WORK/NODEJS/wellness-spoiled-backend/Assets/User");
console.log(__dirname)
adminRoute.post(
    '/admin/addContent',
    upload.fields([{ name: 'media', maxCount: 1 }]),
    isAdmin,
    content
)

// adminRoute.get(
//     '/user/get/:userId',
//     isSameUserOrAdmin,
//     getUserById
// )

adminRoute.get(
    '/admin/get-all',
    isAdmin,
    getAllList
)

// adminRoute.patch(
//     '/user/block/:userId',
//     isAdmin, 
//     blockUser
// )

module.exports = adminRoute