const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

// Helper function to generate access and refresh tokens
const generateTokens = (userId, type) => {
	const accessToken = jwt.sign({ userId, type }, process.env.JWT_SECRET, { expiresIn: '1h' }) // 1 hour expiration
	const refreshToken = jwt.sign({ userId, type }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: '24h'
	}) // 24 hour expiration
	return { accessToken, refreshToken }
}

// Get a user by ID
exports.getUserById = async (req, res) => {
	try {
		const userId = req.params.id

		// Find the user by ID
		const user = await User.findById(userId).select('-password')

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving user', error })
	}
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

// Forgot password
exports.forgotPassword = async (req, res) => {
	const { email } = req.body

	try {
		// Verify if the user exists
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ message: 'User with this email does not exist.' })
		}

		// Generate a reset token
		const resetToken = crypto.randomBytes(32).toString('hex')
		const resetTokenExpiry = Date.now() + 3600000 // 1 hour expiration

		// Save the reset token and its expiration to the user
		user.resetPasswordToken = resetToken
		user.resetPasswordExpires = resetTokenExpiry
		await user.save()

		// Create a reset URL
		const resetUrl = `${req.protocol}://${req.get('host')}/api/user/reset-password/${resetToken}`

		// Configure nodemailer
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			}
		})

		const mailOptions = {
			to: user.email,
			from: process.env.EMAIL_USER,
			subject: 'Password Reset Request',
			html: `
				<div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
					<h2>Password Reset Request</h2>
					<p>Hello ${user.name},</p>
					<p>You requested a password reset. Please click the button below to reset your password:</p>
					<div style="text-align: center;">
						<a href="${resetUrl}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
							Reset Password
						</a>
					</div>
					<p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
					<p><a href="${resetUrl}" style="color: #007BFF;">${resetUrl}</a></p>
					<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
					<p>Best regards,<br/>The Team</p>
				</div>
			`
		}

		// Send the email
		await transporter.sendMail(mailOptions)

		res.status(200).json({ message: 'Password reset email sent.' })
	} catch (error) {
		res.status(500).json({ message: 'Error sending password reset email.', error })
	}
}

// Verify reset token (GET)
exports.verifyResetToken = async (req, res) => {
	const { token } = req.params

	try {
		// Find the user with the reset token and check if it's still valid
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		})

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token.' })
		}

		res.status(200).json({ message: 'Valid token', token })
	} catch (error) {
		res.status(500).json({ message: 'Error validating reset token.', error })
	}
}

// Reset password
exports.resetPassword = async (req, res) => {
	const { token } = req.params
	const { newPassword } = req.body

	try {
		// Find the user with the reset token and check if it's still valid
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() } // Token is valid if it's still within the expiration time
		})

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token.' })
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(newPassword, salt)

		// Update the user's password and remove the reset token
		user.password = hashedPassword
		user.resetPasswordToken = undefined
		user.resetPasswordExpires = undefined
		await user.save()

		res.status(200).json({ message: 'Password reset successfully.' })
	} catch (error) {
		res.status(500).json({ message: 'Error resetting password.', error })
	}
}
