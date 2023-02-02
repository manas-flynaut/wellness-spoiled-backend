const Content = require("../models/contentModel")
const { loggerUtil } = require("../utils/logger")
const { OK, WRONG_ENTITY, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("../utils/statusCode")


const content = async (req, res) => {
    try {
        if (req.files) {
            req.files.media ? req.body.link =  req.files.media[0].path : '';
        }
        const { name, designation, email, website, description, content } = req.body

        const newContent = new Content({
            name: name,
            designation: designation, 
            email: email, 
            website: website, 
            description: description, 
            content: content,
            image : req.files.media[0].path
        });
        newContent.save().then(content => res.status(OK).json({
            message: "Content Added Successfully.",
            data: content
        }))
        .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All Roles Function is Executed')
    }
}

const getAllList = async (req, res) => {
    try {
        Content
            .find({}, { })
            .sort({ createdAt: -1 })
            .exec((err, content) => {
                if (err || !content) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No content were found in a DB!'
                    })
                }
                res.status(OK).json({
                    message: 'content Fetched Successfully!',
                    data: content
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All content Function is Executed')
    }
}

// const blockUser = async (req, res) => {
//     try {
//         const id = req.params
//         User.findOneAndUpdate({ "userId": uid }, { blocked: req.body.block }, { new: true })
//             .then(updatedUser => res.status(OK).json({
//                 message: "Block Status of User updated Successfully.",
//                 data: updatedUser
//             }))
//             .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
//     } catch (err) {
//         loggerUtil(err, 'ERROR')
//     } finally {
//         loggerUtil('Block User By Id Function is Executed!')
//     }
// }

module.exports = { content, getAllList }