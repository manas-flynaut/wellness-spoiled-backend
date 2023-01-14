// import { forgotPassword } from './../controllers/auth'
const express =  require('express')
const { check } =require('express-validator')
const { isSignedIn, isValidToken, isAdmin  }= require('./../middleware/index')
const { signUp } =  require('../controllers/auth')

const authRoute = express.Router()

authRoute.post(
	'/signup',
	[
		check('name')
			.isLength({
				min: 3
			})
			.withMessage('Please provide a name'),
		check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
		check('password')
			.isLength({ min: 6 })
			.withMessage('Password length should be minimum of 8 characters')
	],
	signUp
)
authRoute.post(
	'/signin',
	[
		check('email').isEmail().withMessage('Please provide a valid E-Mail!'),
		check('password')
			.isLength({ min: 6 })
			.withMessage('Password length should be minimum of 8 characters')
	],
	// signin
)
authRoute.get('/signout' )
authRoute.put('/update/:userId')
authRoute.post('/forgot-password')
authRoute.put(
	'/user/update-points/:userId',
	isSignedIn,
	isValidToken,
	isAdmin,

)
authRoute.post(
	'/user/approve/:userId',
	isSignedIn,
	isValidToken,
	isAdmin,
)

module.exports = authRoute
