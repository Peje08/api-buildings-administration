const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Helper function to generate access and refresh tokens
const generateTokens = (userId, type) => {
	const accessToken = jwt.sign({ userId, type }, process.env.JWT_SECRET, { expiresIn: '1h' }) // 1 hour expiration
	const refreshToken = jwt.sign({ userId, type }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: '24h'
	}) // 24 hour expiration
	return { accessToken, refreshToken }
}

// User register
exports.register = async (req, res) => {
	const { name, lastname, email, password, cellularNumer, type } = req.body

	try {
		// Verify if the user already exists
		let user = await User.findOne({ email })
		if (user) {
			return res.status(400).json({ message: 'Email is already registered.' })
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Create a new user
		user = new User({
			name,
			lastname,
			email,
			password: hashedPassword,
			cellularNumer,
			type
		})

		await user.save()

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user._id, user.type)

		res.status(201).json({ accessToken, refreshToken, userId: user._id })
	} catch (error) {
		res.status(500).json({ message: 'Error registering user.', error })
	}
}

// User login
exports.login = async (req, res) => {
	const { email, password } = req.body

	try {
		// Verify if the user exists
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials.' })
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials.' })
		}

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user._id, user.type)

		res.status(200).json({ accessToken, refreshToken, userId: user._id })
	} catch (error) {
		res.status(500).json({ message: 'Error logging in.', error })
	}
}

// Refresh token logic
exports.refreshToken = (req, res) => {
	const { refreshToken } = req.body

	if (!refreshToken) {
		return res.status(401).json({ message: 'Refresh token is required.' })
	}

	try {
		// Verify the refresh token
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

		// Generate a new access token
		const accessToken = jwt.sign(
			{ userId: decoded.userId, type: decoded.type },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		res.status(200).json({ accessToken })
	} catch (error) {
		return res.status(403).json({ message: 'Invalid refresh token.' })
	}
}
