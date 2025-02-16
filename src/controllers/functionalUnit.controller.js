const { v4: uuidv4 } = require('uuid')
const FunctionalUnit = require('../models/FunctionalUnit')
const Tower = require('../models/Tower')
const User = require('../models/User')
const logger = require('../utils/logger')

// Create a new Functional Unit
exports.createFunctionalUnit = async (req, res) => {
	try {
		const { towerId, name, type, occupied, tenantUserId, ownerUserId } = req.body

		logger.info(`Solicitud recibida para crear una unidad funcional en la torre ID ${towerId}`)

		// Check if the tower exists
		const tower = await Tower.findById(towerId)
		if (!tower) {
			logger.warn(`Intento de creación fallido: Torre con ID ${towerId} no encontrada.`)
			return res.status(400).json({ message: 'ID de torre inválido. La torre no existe.' })
		}

		// Check if the tenant exists and is of type TENANT
		if (tenantUserId) {
			const tenantExists = await User.findById(tenantUserId)
			if (!tenantExists || tenantExists.type !== 'TENANT') {
				logger.warn(
					`Intento de creación fallido: Usuario con ID ${tenantUserId} no es un inquilino válido.`
				)
				return res
					.status(400)
					.json({ message: 'ID de inquilino inválido o el usuario no es un inquilino.' })
			}
		}

		// Check if the owner exists and is of type OWNER, ADMINISTRATION, or SUPERUSER
		let ownerTypeValid = false
		if (ownerUserId) {
			const ownerExists = await User.findById(ownerUserId)
			if (ownerExists && ['OWNER', 'ADMINISTRATION', 'SUPERUSER'].includes(ownerExists.type)) {
				ownerTypeValid = true
			}
		}

		// If owner is not provided, default to SUPERUSER or ADMINISTRATION as the owner
		if (!ownerTypeValid && !ownerUserId) {
			logger.warn(`Intento de creación fallido: Propietario no válido o faltante.`)
			return res.status(400).json({ message: 'ID de propietario inválido o usuario faltante.' })
		}

		// Generate a friendlyId for the functional unit based on the tower's friendlyId
		const friendlyId = `${tower.friendlyId}-${uuidv4().slice(-4)}`

		// Create a new functional unit
		const newFunctionalUnit = new FunctionalUnit({
			tenantUserId: tenantUserId || null,
			ownerUserId,
			friendlyId,
			name,
			type,
			occupied: occupied || false
		})

		// Save the functional unit
		await newFunctionalUnit.save()

		// Optionally, update the tower with the new functional unit
		tower.functionalUnitsData.push(newFunctionalUnit._id)
		await tower.save()

		logger.info(
			`Unidad funcional creada con éxito en la torre ID ${towerId}, Friendly ID: ${friendlyId}`
		)
		res.status(201).json(newFunctionalUnit)
	} catch (error) {
		logger.error(`Error al crear la unidad funcional: ${error.message}`)
		res.status(500).json({ message: 'Error al crear la unidad funcional', error })
	}
}

// Get all Functional Units
exports.getAllFunctionalUnits = async (req, res) => {
	try {
		logger.info('Solicitud recibida para obtener todas las unidades funcionales.')

		const functionalUnits = await FunctionalUnit.find()
			.populate('tenantUserId', '-password')
			.populate('ownerUserId', '-password')

		logger.info(`Se recuperaron ${functionalUnits.length} unidades funcionales.`)
		res.status(200).json(functionalUnits)
	} catch (error) {
		logger.error(`Error al recuperar las unidades funcionales: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar las unidades funcionales', error })
	}
}

// Get a Functional Unit by ID
exports.getFunctionalUnitById = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para obtener la unidad funcional con ID ${req.params.id}.`)

		const functionalUnit = await FunctionalUnit.findById(req.params.id)
			.populate('tenantUserId', '-password')
			.populate('ownerUserId', '-password')

		if (!functionalUnit) {
			logger.warn(
				`Intento de obtener unidad funcional fallido: Unidad con ID ${req.params.id} no encontrada.`
			)
			return res.status(404).json({ message: 'La unidad funcional no fue encontrada' })
		}

		logger.info(`Unidad funcional con ID ${req.params.id} recuperada correctamente.`)
		res.status(200).json(functionalUnit)
	} catch (error) {
		logger.error(`Error al recuperar la unidad funcional con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar la unidad funcional', error })
	}
}

// Update a Functional Unit by ID
exports.updateFunctionalUnit = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para actualizar la unidad funcional con ID ${req.params.id}.`)

		const { name, type, occupied, tenantUserId, ownerUserId } = req.body

		const functionalUnit = await FunctionalUnit.findById(req.params.id)
		if (!functionalUnit) {
			logger.warn(
				`Intento de actualización fallido: Unidad funcional con ID ${req.params.id} no encontrada.`
			)
			return res.status(404).json({ message: 'La unidad funcional no fue encontrada' })
		}

		logger.info(
			`Actualizando unidad funcional con ID ${req.params.id}. Datos recibidos: ${JSON.stringify(
				req.body
			)}`
		)

		if (name) functionalUnit.name = name
		if (type) functionalUnit.type = type
		if (occupied !== undefined) functionalUnit.occupied = occupied

		// Update tenant and owner if provided
		if (tenantUserId) {
			const tenantExists = await User.findById(tenantUserId)
			if (tenantExists && tenantExists.type === 'TENANT') {
				functionalUnit.tenantUserId = tenantUserId
			}
		}

		if (ownerUserId) {
			const ownerExists = await User.findById(ownerUserId)
			if (ownerExists && ownerExists.type === 'OWNER') {
				functionalUnit.ownerUserId = ownerUserId
			}
		}

		await functionalUnit.save()

		logger.info(`Unidad funcional con ID ${req.params.id} actualizada con éxito.`)
		res.status(200).json(functionalUnit)
	} catch (error) {
		logger.error(
			`Error al actualizar la unidad funcional con ID ${req.params.id}: ${error.message}`
		)
		res.status(500).json({ message: 'Error al actualizar la unidad funcional', error })
	}
}

// Delete a Functional Unit by ID
exports.deleteFunctionalUnit = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para eliminar la unidad funcional con ID ${req.params.id}.`)

		const functionalUnit = await FunctionalUnit.findById(req.params.id)
		if (!functionalUnit) {
			logger.warn(
				`Intento de eliminación fallido: Unidad funcional con ID ${req.params.id} no encontrada.`
			)
			return res.status(404).json({ message: 'La unidad funcional no fue encontrada' })
		}

		await functionalUnit.deleteOne()

		logger.info(`Unidad funcional con ID ${req.params.id} eliminada correctamente.`)
		res.status(200).json({ message: 'La unidad funcional fue eliminada con éxito' })
	} catch (error) {
		logger.error(`Error al eliminar la unidad funcional con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al eliminar la unidad funcional', error })
	}
}
