const Role = require("../models/roleModel")
const { loggerUtil } = require("../utils/logger")
const { OK, NOT_FOUND } = require("../utils/statusCode")

const add = async (req, res) => {
    try {
        const { name, description } = req.body

        const newRole = new Role({
            name: name,
            description: description
        });
        newRole.save().then(role => res.status(OK).json({
                message: "Role Added Successfully.",
                data: role
            }))
            .catch(err => res.status(BAD_REQUEST).json({ message: err.message }));
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All Roles Function is Executed')
    }
}

const getAllRoles = async (req, res) => {
    try {
        Role
            .find({})
            .sort({ createdAt: -1 })
            .exec((err, role) => {
                if (err || !role) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No roles were found in a DB!'
                    })
                }
                res.status(OK).json({
                    message: 'Roles Fetched Successfully!',
                    data: role
                })
            })
    } catch (err) {
        loggerUtil(err, 'ERROR')
    } finally {
        loggerUtil('Get All Roles Function is Executed')
    }
}

module.exports = { add, getAllRoles }