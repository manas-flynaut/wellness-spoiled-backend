const express = require('express');
const { getCareNotesOfUser, addCareNoteForUser, updateCareNoteById, deleteCareNoteById } = require('../controllers/careNotes');
const { isSameUserOrAdmin } = require('../middleware');

const careNotesRoute = express.Router()

careNotesRoute.get(
    "/care-notes/get-all/:userId",
    isSameUserOrAdmin,
    getCareNotesOfUser
)

careNotesRoute.post(
    "/care-notes/add/:userId",
    isSameUserOrAdmin,
    addCareNoteForUser
)

careNotesRoute.put(
    "/care-notes/update/:userId/:careNoteId",
    isSameUserOrAdmin,
    updateCareNoteById
)

careNotesRoute.delete(
    "/care-notes/update/:userId/:careNoteId",
    isSameUserOrAdmin,
    deleteCareNoteById
)

module.exports = careNotesRoute