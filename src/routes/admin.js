// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check } = require('express-validator')
const { isAdmin, isSameUserOrAdmin } = require('../middleware')
const { loggerUtil } = require('../utils/logger')
const { fileUploader } = require("../utils/fileUploader");
const Content = require("../models/contentModel")
const { content, getShopById, getAllList, updateShop, updatePrivacy, updateTerms, getPageById, addCategory,
    getAllCategories,
    uploadAudio,
    getAllAudio, updateContent } = require('../controllers/admin')

const adminRoute = express.Router()

const upload = fileUploader("/WORK/NODEJS/wellness-spoiled-backend/Assets/Content");
const audio = fileUploader("/WORK/NODEJS/wellness-spoiled-backend/Assets/Audio");
const category = fileUploader("/WORK/NODEJS/wellness-spoiled-backend/Assets/Category");

adminRoute.post(
    '/admin/addContent',
    upload.fields([{ name: 'media', maxCount: 1 }]),
    isAdmin,
    content
)

adminRoute.patch(
    '/admin/updateContent/:contentId',
    upload.fields([{ name: 'media', maxCount: 1 }]),
    isAdmin, 
    updateContent
)

adminRoute.get(
    '/admin/getShopById/:shopId',
    isAdmin,
    getShopById
)

adminRoute.get(
    '/admin/getPageById/:pageId',
    isAdmin,
    getPageById
)

adminRoute.patch(
    '/admin/updatePrivacy/:pageId',
    isAdmin,
    updatePrivacy
)

adminRoute.patch(
    '/admin/updateTerms/:pageId',
    isAdmin,
    updateTerms
)

adminRoute.get(
    '/admin/get-all',
    isAdmin,
    getAllList
)

adminRoute.patch(
    '/admin/updateShop/:shopId',
    isAdmin, 
    updateShop
)

adminRoute.post(
    '/admin/addCategory',
    category.fields([{ name: 'media', maxCount: 1 }]),
    isAdmin,
    addCategory
)

adminRoute.get(
    '/admin/get-categories',
    isAdmin,
    getAllCategories
)

adminRoute.post(
    '/admin/uploadAudio',
    audio.fields([{ name: 'media', maxCount: 1 }]),
    isAdmin,
    uploadAudio
)

adminRoute.get(
    '/admin/get-audios',
    isAdmin,
    getAllAudio
)

module.exports = adminRoute