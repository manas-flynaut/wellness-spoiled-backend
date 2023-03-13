// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check } = require('express-validator')
const { isAdmin, isSameUserOrAdmin } = require('../middleware')
const { loggerUtil } = require('../utils/logger')
const { fileUploader } = require("../utils/fileUploader");
const {  ejournalCreate, getEjournal, createBoard, customizeBoard, getBoard } = require('../controllers/care')

const careRoute = express.Router()

const upload = fileUploader("/WORK/NODEJS/wellness-spoiled-backend/Assets/Care");

careRoute.post(
    '/care/ejournalCreate/:week',
    // upload.fields([{ name: 'media', maxCount: 1 }]),
    isSameUserOrAdmin,
    ejournalCreate
)

careRoute.get(
    '/care/getEjournal/:user',
    isSameUserOrAdmin,
    getEjournal
)

careRoute.post(
    '/care/createBoard',
    isSameUserOrAdmin,
    createBoard
)

careRoute.post(
    '/care/customizeBoard/:board',
    upload.fields([{ name: 'media', maxCount: 1 }]),
    isSameUserOrAdmin,
    customizeBoard
)

careRoute.get(
    '/care/getBoard/:user',
    isSameUserOrAdmin,
    getBoard
)

module.exports = careRoute