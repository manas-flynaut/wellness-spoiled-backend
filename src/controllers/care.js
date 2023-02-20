const Ejournal = require("../models/ejournalModel")
const Board = require("../models/boardModel")
const { loggerUtil } = require("../utils/logger")
const { normalize } = require('path')
const { OK, WRONG_ENTITY, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("../utils/statusCode")
const { uploadFile }  = require("../utils/upload");

const getEjournal = async (req, res) => {
    try {
        const weekType = req.params.week
        let ejournal = await Ejournal.findOne({ "week" : weekType })
        if (!ejournal) {
            res.status(OK).json({
                status:OK,
                message: 'ejournal Not Found!',
                data: {}
            })
        }
        res.status(OK).json({
            status:OK,
            message: 'ejournal Fetched Successfully!',
            data: ejournal
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get ejournal Function is Executed!')
    }
}

const ejournalCreate = async (req, res) => {
    try {
        const weekType = req.params.week
        let ejournalData = await Ejournal.find( 
            { week : weekType }).count()
        // if (req.files.media) {
        //     req.files.media ? req.body.link =  req.files.media[0].path : '';
        //     var imageUrl = await uploadFile(req.files.media[0].path,"images/Content")
        // }
        const { user,
            ejournal,
            gratitude,
            gratitudeNote,
            hydration,
            rateYourDay,
            notes,
            week,
            score } = req.body
        if (!ejournalData) {
            console.log("insert")
            const newEjournal = new Ejournal({
                user: user,
                ejournal: ejournal, 
                gratitude: gratitude, 
                gratitudeNote: gratitudeNote, 
                hydration: hydration, 
                rateYourDay: rateYourDay,
                notes: notes, 
                week: week, 
                score: score
            });
            newEjournal.save().then(shop => res.status(OK).json({
                status:OK,
                message: "Ejournal Added Successfully.",
                data: shop
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
        } else {
            // console.log("update")
            Ejournal.findOneAndUpdate({ "week": weekType }, { "$set": { 
                ejournal: ejournal, 
                gratitude: gratitude, 
                gratitudeNote: gratitudeNote, 
                hydration: hydration, 
                rateYourDay: rateYourDay,
                notes: notes,
                score: score
            }}).exec(function(err, content){
                if(err) {
                    console.log(err);
                    res.status(NOT_FOUND).json({
                        status:NOT_FOUND,
                        error: err
                    })
                } else {
                    res.status(OK).json({
                        status:OK,
                        message: 'Ejournal Updated Successfully!'
                    })
                }
                });
        }
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update Ejournal info Function is Executed!')
    }
}

const createBoard = async (req, res) => {
    try {
        const { title, user } = req.body

        const newBoard = new Board({
            title: title,
            user: user
        });
        newBoard.save().then(board => res.status(OK).json({
            message: "Board Added Successfully.",
            data: board
        }))
        .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Board info Function is Executed!')
    }
}

const customizeBoard = async (req, res) => {
    try {
        const id = req.params.board
        const title = req.body.title
        let board = await Board.findById(id)

        if (!board.images) {
            var imageUrl = await uploadFile(req.files.media[0].path,"images/Board")
            const newContent = new Board({
                image: imageUrl,
                title: title
            });
            newContent.save().then(content => res.status(OK).json({
                message: "Image Added Successfully."
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
        } else {
            var imageUrl = await uploadFile(req.files.media[0].path,"images/Board")
            board.images = board.images.concat({ url: imageUrl, title: title })
            await board.save();
            res.status(OK).json({
                message: "Board Updated Successfully."
            })
        }
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update Ejournal info Function is Executed!')
    }
}

const getBoard = async (req, res) => {
    try {
        const user = req.params.user
        let board = await Board.findOne({ "user" : user })
        if (!board) {
            res.status(OK).json({
                status:OK,
                message: 'board Not Found!',
                data: {}
            })
        }
        res.status(OK).json({
            status:OK,
            message: 'board Fetched Successfully!',
            data: board
        })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Update Ejournal info Function is Executed!')
    }
}

module.exports = { 
    getEjournal,
    ejournalCreate,
    createBoard,
    customizeBoard,
    getBoard
 }