// Dependencies
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Route for handling login
loginRouter.post('/', async (request, response) => {
	const { username, password } = request.body

	// Find user from database
	const user = await User.findOne({ username })

	// Check password validity
	const passwordCorrect = user === null
		? false
		: await bcrypt.compare(password, user.passwordHash)

	// Handle authentication success/failure
	if (!(user && passwordCorrect)) {
		return response.status(401).json({
			error: 'invalid username or password'
		})
	}

	// Create token for authenticated user
	const userForToken = {
		username: user.username,
		id: user._id,
	}
	const token = jwt.sign(userForToken, process.env.SECRET)

	// Respond with token and user info
	response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter