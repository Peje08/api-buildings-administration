const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Administration = require('../models/Administration')
const crypto = require('crypto')
const { recoveryMail } = require('../utils/templates/recoveryMail')
const { hashPassword } = require('../utils/hashPassword')
const sendEmail = require('../utils/sendEmail')
const { activationMail } = require('../utils/templates/activationMail')
const { isEmptyOrNull } = require('../utils/utils')
const { passwordResetSuccessMail } = require('../utils/templates/passwordResetSuccessMail')
const logger = require('../utils/logger')

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
		const user = await User.findById(userId).select('-password')

		if (!user) {
			logger.warn(`Usuario con ID ${userId} no encontrado.`)
			return res.status(404).json({ message: 'Usuario no encontrado' })
		}

		logger.info(`Usuario con ID ${userId} recuperado correctamente.`)
		res.status(200).json(user)
	} catch (error) {
		logger.error(`Error al recuperar usuario ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar el usuario', error: error.message })
	}
}

// User register
exports.register = async (req, res) => {
	const { username, email, password, cellularNumber, type } = req.body

	try {
		let user = await User.findOne({ email })
		if (user) {
			logger.warn(`Intento de registro con email ya existente: ${email}`)
			return res.status(400).json({ message: 'El correo electrónico ya está registrado.' })
		}

		const hashedPassword = await hashPassword(password)
		user = new User({
			username,
			email,
			password: hashedPassword,
			resetPasswordToken: crypto.randomBytes(32).toString('hex'),
			cellularNumber,
			type,
			isActive: false
		})
		await user.save()

		let newAdministration = {}
		if (type === 'ADMINISTRATION' || type === 'SUPERUSER') {
			const friendlyId = `${user._id.toString().slice(-4)}`
			newAdministration = new Administration({
				name: username,
				ownerId: user._id,
				friendlyId,
				buildings: []
			})
			await newAdministration.save()
		}

		const activationLink = `${process.env.CABILDO_FRONT_URL}/activate-account/${user._id}`
		const emailContent = activationMail(username, activationLink)
		await sendEmail(user.email, 'Confirma tu cuenta en Cabildo', emailContent)

		logger.info(`Usuario registrado correctamente: ${email}`)
		res.status(201).json({ userId: user._id, administrationId: newAdministration._id })
	} catch (error) {
		logger.error(`Error al registrar usuario (${email}): ${error.message}`)
		res.status(500).json({ message: 'Error al registrar usuario.', error: error.message })
	}
}

// User login
exports.login = async (req, res) => {
	const { email, password } = req.body

	try {
		logger.info(`Solicitud de inicio de sesión para el correo: ${email}`)

		// Verify if the user exists
		const user = await User.findOne({ email })
		if (!user || !user.isActive) {
			logger.warn(
				`Intento de inicio de sesión fallido para ${email}: Usuario no encontrado o inactivo.`
			)
			return res.status(400).json({ message: 'Credenciales inválidas o usuario inactivo.' })
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			logger.warn(`Intento de inicio de sesión fallido para ${email}: Contraseña incorrecta.`)
			return res.status(400).json({ message: 'Credenciales inválidas.' })
		}

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user._id, user.type)

		// Prepare the response object
		const response = { accessToken, refreshToken, userId: user._id }

		// If the user type is 'ADMINISTRATION' or 'SUPERUSER', retrieve the corresponding administration
		if (user.type === 'ADMINISTRATION' || user.type === 'SUPERUSER') {
			const administration = await Administration.findOne({ ownerId: user._id })

			if (administration) {
				response.administrationId = administration._id
				logger.info(
					`Usuario ${email} es ADMINISTRATION. ID de administración: ${administration._id}`
				)
			}
		}

		logger.info(`Inicio de sesión exitoso para ${email}.`)
		res.status(200).json(response)
	} catch (error) {
		logger.error(`Error en el inicio de sesión para ${email}: ${error.message}`)
		res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message })
	}
}

// Refresh token logic
exports.refreshToken = (req, res) => {
	const { refreshToken } = req.body

	if (!refreshToken) {
		return res.status(401).json({ message: 'Se requiere un token de actualización.' })
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
		return res
			.status(403)
			.json({ message: 'Token de actualización inválido.', error: error.message })
	}
}

// Forgot password
exports.forgotPassword = async (req, res) => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })
		if (!user) {
			logger.warn(`Intento de recuperación de contraseña fallido: Usuario no encontrado (${email})`)
			return res.status(404).json({ message: 'No existe un usuario con este correo electrónico.' })
		}

		const resetToken = crypto.randomBytes(32).toString('hex')
		user.resetPasswordToken = resetToken
		user.resetPasswordExpires = Date.now() + 3600000
		await user.save()

		const resetUrl = `${process.env.CABILDO_FRONT_URL}/reset-password/${resetToken}`
		const subject = 'Solicitud de restablecimiento de contraseña'
		const htmlContent = recoveryMail(resetUrl, user.username)

		await sendEmail(user.email, subject, htmlContent)
		logger.info(`Correo de recuperación de contraseña enviado a ${email}`)
		res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado.' })
	} catch (error) {
		logger.error(`Error en forgotPassword para ${email}: ${error.message}`)
		res.status(500).json({
			message: 'Error al enviar el correo de restablecimiento de contraseña.',
			error: error.message
		})
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
			return res.status(400).json({ message: 'Token inválido o expirado.' })
		}

		res.status(200).json({ message: 'Token válido', token })
	} catch (error) {
		res.status(500).json({ message: 'Error validando token de reseteo.', error: error.message })
	}
}

// Reset password
exports.resetPassword = async (req, res) => {
	const { token } = req.params
	const { id, newPassword, oldPassword } = req.body

	try {
		let user = null

		if (token && token !== 'undefined') {
			user = await User.findOne({ resetPasswordToken: token })
		} else if (id) {
			user = await User.findById(id)
		}

		if (!user) {
			logger.warn(`Intento de reset de contraseña fallido: Usuario no encontrado o token inválido`)
			return res.status(400).json({ message: 'Usuario no encontrado o token inválido.' })
		}

		if (!token && oldPassword) {
			const isMatch = await bcrypt.compare(oldPassword, user.password)
			if (!isMatch) {
				logger.warn(`Intento de reset fallido: Old password incorrecta para usuario ID ${id}`)
				return res.status(400).json({ message: 'La contraseña antigua es incorrecta.' })
			}
		} else if (!token && !oldPassword) {
			return res
				.status(400)
				.json({ message: 'Se requiere un token de reseteo o la contraseña actual.' })
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10)
		user.password = hashedPassword
		if (token) user.resetPasswordToken = undefined
		await user.save()

		const subject = 'Tu contraseña ha sido actualizada con éxito'
		const htmlContent = passwordResetSuccessMail(user.username)
		await sendEmail(user.email, subject, htmlContent)

		logger.info(`Contraseña restablecida con éxito para el usuario ${user.email}`)
		res.status(200).json({ message: 'Contraseña restablecida con éxito.' })
	} catch (error) {
		logger.error(`Error en resetPassword para usuario ID ${id || 'N/A'}: ${error.message}`)
		res.status(500).json({ message: 'Error al restablecer la contraseña.', error: error.message })
	}
}

// Deactivate user (soft delete)
exports.deactivateUser = async (req, res) => {
	const { userId } = req.params

	try {
		const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true }).select(
			'-password'
		)

		if (!user) {
			logger.warn(`Intento de desactivación fallido: Usuario con ID ${userId} no encontrado.`)
			return res.status(404).json({ message: 'Usuario no encontrado' })
		}

		logger.info(`Usuario con ID ${userId} desactivado correctamente.`)
		res.status(200).json({ message: 'Usuario desactivado con éxito', user })
	} catch (error) {
		logger.error(`Error al desactivar usuario ID ${userId}: ${error.message}`)
		res.status(500).json({ message: 'Error al desactivar usuario', error: error.message })
	}
}

// Reactivate user
exports.reactivateUser = async (req, res) => {
	const { userId } = req.params

	try {
		const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true }).select(
			'-password'
		)

		if (!user) {
			logger.warn(`Intento de reactivación fallido: Usuario con ID ${userId} no encontrado.`)
			return res.status(404).json({ message: 'Usuario no encontrado' })
		}

		logger.info(`Usuario con ID ${userId} reactivado correctamente.`)
		res.status(200).json({ message: 'Usuario reactivado con éxito', user })
	} catch (error) {
		logger.error(`Error al reactivar usuario ID ${userId}: ${error.message}`)
		res.status(500).json({ message: 'Error al reactivar usuario', error: error.message })
	}
}

exports.editUser = async (req, res) => {
	const { userId } = req.params
	const { username, oldPassword, newPassword, cellularNumber, firstTime } = req.body

	try {
		const user = await User.findById(userId)

		if (!user) {
			logger.warn(`Intento de edición fallido: Usuario con ID ${userId} no encontrado.`)
			return res.status(404).json({ message: 'Usuario no encontrado' })
		}

		// Compare the password
		const isMatch = await bcrypt.compare(oldPassword, user.password)
		if (!isMatch) {
			logger.warn(`Intento de edición fallido: Contraseña incorrecta para usuario ID ${userId}`)
			return res.status(400).json({ message: 'Credenciales inválidas.' })
		}

		if (!isEmptyOrNull(newPassword)) {
			// Hash the password
			const newHashedPassword = await hashPassword(newPassword)
			user.password = newHashedPassword
		}

		if (!isEmptyOrNull(username)) {
			user.username = username
		}

		if (!isEmptyOrNull(cellularNumber)) {
			user.cellularNumber = cellularNumber
		}

		if (!isEmptyOrNull(firstTime)) {
			user.firstTime = firstTime
		}

		await user.save()

		logger.info(`Usuario con ID ${userId} editado con éxito.`)
		res.status(200).json({ message: 'Usuario editado con éxito', user })
	} catch (error) {
		logger.error(`Error al editar usuario ID ${userId}: ${error.message}`)
		res.status(500).json({ message: 'Error al editar usuario', error: error.message })
	}
}
