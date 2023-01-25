// import { forgotPassword } from './../controllers/auth'
const express = require('express')
const { check } = require('express-validator')
const { isAdmin, isSameUserOrAdmin } = require('../middleware')
const { loggerUtil } = require('./../utils/logger')
const Role = require("../models/roleModel")
const { add, getAllRoles } = require('../controllers/role')

const roleRoute = express.Router()

roleRoute.post(
    '/role/add',
    isAdmin,
    add
)

roleRoute.get(
    '/role/get-all',
    isAdmin,
    getAllRoles
)

module.exports = roleRoute