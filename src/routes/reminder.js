const express = require('express');
const { getReminderOfUser, addReminderForUser } = require('../controllers/reminder');
const { isSameUserOrAdmin } = require('../middleware');

const reminderRoute = express.Router()

reminderRoute.get(
    "/reminder/get-all/:userId",
    isSameUserOrAdmin,
    getReminderOfUser
)

reminderRoute.get(
    "/reminder/add/:userId",
    isSameUserOrAdmin,
    addReminderForUser
)

module.exports = reminderRoute