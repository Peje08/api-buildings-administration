const Administration = require('../models/Administration')
const User = require('../models/User')
const logger = require('../utils/logger')

// Create an administration
exports.createAdministration = async (req, res) => {
	try {
		const { name, ownerId, buildings } = req.body

		logger.info('Solicitud recibida para crear una administración.')

		// Check if the ownerId exists in the database
		const ownerExists = await User.findById(ownerId)

		if (!ownerExists) {
			logger.warn(`Intento de creación fallido: Usuario con ID ${ownerId} no encontrado.`)
			return res.status(400).json({ message: 'ID de usuario inválido. El usuario no existe.' })
		}

		// Generate a friendlyId using the name and the last 4 characters of ownerId
		const friendlyId = `${ownerId.slice(-4)}`

		const newAdministration = new Administration({
			name,
			ownerId,
			friendlyId,
			buildings
		})

		await newAdministration.save()

		logger.info(
			`Administración creada con éxito. ID: ${newAdministration._id}, Friendly ID: ${friendlyId}`
		)
		res.status(201).json(newAdministration)
	} catch (error) {
		logger.error(`Error al crear la administración: ${error.message}`)
		res.status(500).json({ message: 'Error al crear la administración', error })
	}
}

// Obtain all administrations
exports.getAllAdministrations = async (req, res) => {
	try {
		logger.info('Solicitud recibida para obtener todas las administraciones.')

		const administrations = await Administration.find().populate({
			path: 'ownerId',
			select: '-password'
		})

		if (!administrations || administrations.length === 0) {
			logger.warn('No se encontraron administraciones.')
			return res.status(404).json({ message: 'No se encontraron administraciones.' })
		}

		logger.info(`Se recuperaron ${administrations.length} administraciones.`)
		res.status(200).json(administrations)
	} catch (error) {
		logger.error(`Error al obtener las administraciones: ${error.message}`)
		res.status(500).json({ message: 'Error al obtener las administraciones', error })
	}
}

// Obtain an administration by ID
exports.getAdministrationById = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para obtener la administración con ID ${req.params.id}.`)

		const administration = await Administration.findById(req.params.id).populate({
			path: 'ownerId',
			select: '-password'
		})

		if (!administration) {
			logger.warn(
				`Intento de obtener administración fallido: Administración con ID ${req.params.id} no encontrada.`
			)
			return res.status(404).json({ message: 'Administración no encontrada' })
		}

		logger.info(`Administración con ID ${req.params.id} recuperada correctamente.`)
		res.status(200).json(administration)
	} catch (error) {
		logger.error(`Error al obtener la administración con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al obtener la administración', error })
	}
}

// Update an administration
exports.updateAdministration = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para actualizar la administración con ID ${req.params.id}.`)

		const { name, buildings } = req.body

		const administration = await Administration.findById(req.params.id)
		if (!administration) {
			logger.warn(
				`Intento de actualización fallido: Administración con ID ${req.params.id} no encontrada.`
			)
			return res.status(404).json({ message: 'La administración no fue encontrada' })
		}

		if (name) {
			administration.name = name
			const ownerIdPart = administration.ownerId.toString().slice(-4)
			administration.friendlyId = `${name.toLowerCase().replace(/\s+/g, '-')}-${ownerIdPart}`
		}

		if (buildings) {
			administration.buildings = buildings
		}

		// Save the updated administration
		await administration.save()

		logger.info(`Administración con ID ${req.params.id} actualizada con éxito.`)
		res.status(200).json(administration)
	} catch (error) {
		logger.error(`Error al actualizar la administración con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al actualizar la administración', error })
	}
}

// Delete an administration
exports.deleteAdministration = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para eliminar la administración con ID ${req.params.id}.`)

		const administration = await Administration.findById(req.params.id)
		if (!administration) {
			logger.warn(
				`Intento de eliminación fallido: Administración con ID ${req.params.id} no encontrada.`
			)
			return res.status(404).json({ message: 'La administración no fue encontrada' })
		}

		await Administration.deleteOne({ _id: req.params.id })

		logger.info(`Administración con ID ${req.params.id} eliminada correctamente.`)
		res.status(200).json({ message: 'La administración fue eliminada con éxito' })
	} catch (error) {
		logger.error(`Error al eliminar la administración con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al eliminar la administración', error })
	}
}
