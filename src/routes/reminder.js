const express = require('express');
const { getReminderOfUser, addReminderForUser, updateReminderById, deleteReminderById } = require('../controllers/reminder');
const { isSameUserOrAdmin } = require('../middleware');

const reminderRoute = express.Router()

reminderRoute.get(
    "/reminder/get-all/:userId",
    isSameUserOrAdmin,
    getReminderOfUser
)

reminderRoute.post(
    "/reminder/add/:userId",
    isSameUserOrAdmin,
    addReminderForUser
)

reminderRoute.put(
    "/reminder/update/:userId/:reminderId",
    isSameUserOrAdmin,
    updateReminderById
)

reminderRoute.delete(
    "/reminder/update/:userId/:reminderId",
    isSameUserOrAdmin,
    deleteReminderById
)

module.exports = reminderRoute