const expressJwt = require('express-jwt')
const { SC } = require('../utils/statusCode')
const { loggerUtil } = require('./../utils/logger')

const isSignedIn = () => expressJwt({
    secret: process.env.SECRET || '',
    algorithms: ['HS256', 'RS256'],
    userProperty: 'auth'
})

const isValidToken = (err, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(SC.UNAUTHORIZED).json({ error: 'Authentication Failed!' })
    }
    return next()
}

const isAuthenticated = (
    req,
    res,
    next,
) => {
    const checker = req.profile && req.auth && req.profile.id == req.auth.id
    if (!checker) {
        return res.status(SC.FORBIDDEN).json({
            error: 'ACCESS DENIED!'
        })
    }
    return next()
}

const isAdmin = async (req, res, next) => {
    const authId = req.auth._id

    if (authId) {
        await prisma.user
            .findFirst({
                where: {
                    id: authId
                }
            })
            .then(user => {
                if (!user) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No user was found in DB!'
                    })
                }
                if (user.role === 3) {
                    return next()
                }
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Not an admin!'
                })
            })
            .catch(err => {
                loggerUtil(err, 'ERROR')
            })
    }
}

const isSameUserOrAdmin = async (
    req,
    res,
    next
) => {
    const authId = req.auth._id
    const userId = req.params.userId
    if (authId) {
        await prisma.user
            .findFirst({
                where: {
                    id: authId
                }
            })
            .then(user => {
                if (!user) {
                    return res.status(SC.NOT_FOUND).json({
                        error: 'No user was found in DB!'
                    })
                }
                if (authId === +userId || user.role === 3) {
                    return next()
                }
                return res.status(SC.UNAUTHORIZED).json({
                    error: 'Not the same user or an admin!'
                })
            })
            .catch(err => {
                loggerUtil(err, 'ERROR')
            })
    }
}


module.exports = { isSignedIn, isValidToken, isAuthenticated, isAdmin, isSameUserOrAdmin }