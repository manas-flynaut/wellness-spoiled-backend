const express = require('express');
const { getAllNotificationsOfUser } = require('../controllers/notification');
const { isSameUserOrAdmin } = require('../middleware');

const notificationRoute = express.Router()

notificationRoute.get(
    "/notification/get-all/:userId",
    isSameUserOrAdmin,
    getAllNotificationsOfUser
)

module.exports = notificationRoute