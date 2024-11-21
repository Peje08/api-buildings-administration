const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Administration = require('../models/Administration')
const crypto = require('crypto')
const { recoveryMail } = require('../utils/templates/recoveryMail')
const { hashPassword } = require('../utils/hashPassword')
const sendEmail = require('../utils/sendEmail')
const { activationMail } = require('../utils/templates/activationMail')

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
	const { username, email, password, cellularNumer, type } = req.body

	try {
		// Verify if the user already exists
		let user = await User.findOne({ email })
		let newAdministration = {}
		if (user) {
			return res.status(400).json({ message: 'Email is already registered.' })
		}

		// Hash the password
		const hashedPassword = await hashPassword(password)

		// Create a new user
		user = new User({
			username,
			email,
			password: hashedPassword,
			cellularNumer,
			type,
			isActive: false
		})

		await user.save()

		// Check if the user type is 'ADMINISTRATION' to create a corresponding administration
		if (type === 'ADMINISTRATION' || type === 'SUPERUSER') {
			const friendlyId = `${user._id.toString().slice(-4)}`

			// Create the administration
			newAdministration = new Administration({
				name: username,
				ownerId: user._id,
				friendlyId,
				buildings: []
			})

			await newAdministration.save()
		}

		// Send activation email with a link to the frontend activation page
		const activationLink = `${process.env.CABILDO_FRONT_URL}/activate-account/${user._id}`
		const emailContent = activationMail(username, activationLink)
		await sendEmail(user.email, 'Confirma tu cuenta en Cabildo', emailContent)

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user._id, user.type)

		const response = { accessToken, refreshToken, userId: user._id }

		if (type === 'ADMINISTRATION' || type === 'SUPERUSER')
			response.administrationId = newAdministration._id

		res.status(201).json(response)
	} catch (error) {
		console.log({ error })
		res.status(500).json({ message: 'Error registering user. ' + error.message })
	}
}

// User login
exports.login = async (req, res) => {
	const { email, password } = req.body

	try {
		// Verify if the user exists
		const user = await User.findOne({ email })
		if (!user || !user.isActive) {
			return res.status(400).json({ message: 'Invalid credentials or inactive user.' })
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials.' })
		}

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user._id, user.type)

		// Prepare the response object
		const response = { accessToken, refreshToken, userId: user._id }

		// If the user type is 'ADMINISTRATION', retrieve the corresponding administration
		if (user.type === 'ADMINISTRATION' || user.type === 'SUPERUSER') {
			const administration = await Administration.findOne({ ownerId: user._id })

			if (administration) {
				response.administrationId = administration._id
			}
		}

		// Send the response
		res.status(200).json(response)
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
		const resetUrl = `${process.env.CABILDO_FRONT_URL}/reset-password/${resetToken}`

		const subject = 'Solicitud de restablecimiento de contraseña'
		const htmlContent = recoveryMail(resetUrl, user.username)

		await sendEmail(user.email, subject, htmlContent)

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

// Deactivate user (soft delete)
exports.deactivateUser = async (req, res) => {
	const { userId } = req.params

	try {
		// Find the user by ID and set isActive to false
		const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true }).select(
			'-password'
		)

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		res.status(200).json({ message: 'User deactivated successfully', user })
	} catch (error) {
		res.status(500).json({ message: 'Error deactivating user', error })
	}
}

// Reactivate user
exports.reactivateUser = async (req, res) => {
	const { userId } = req.params

	try {
		// Find the user by ID and set isActive to true
		const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true }).select(
			'-password'
		)

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		res.status(200).json({ message: 'User reactivated successfully', user })
	} catch (error) {
		res.status(500).json({ message: 'Error reactivating user', error })
	}
}


exports.editUser = async (req, res) => {
	const { userId } = req.params
	const { username, oldPassword, newPassword, cellularNumber } = req.body

	try {
		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		// Compare the password
		const isMatch = await bcrypt.compare(oldPassword, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials.' })
		}

		// Hash the password
		const newHashedPassword = await hashPassword(newPassword)

		user.password = newHashedPassword
		user.username = username
		user.cellularNumber = cellularNumber

		await user.save()

		res.status(200).json({ message: 'User edited successfully', user })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error editing user', error })
	}
}
