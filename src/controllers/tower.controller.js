const { v4: uuidv4 } = require('uuid')
const Building = require('../models/Building')
const Tower = require('../models/Tower')
const FunctionalUnit = require('../models/FunctionalUnit')
const logger = require('../utils/logger')

// Create a new Tower
exports.createTower = async (req, res) => {
	try {
		const { buildingId, floorsNumber, premisesAmount, functionalUnits } = req.body

		logger.info(`Solicitud recibida para crear una torre en el edificio ID ${buildingId}`)

		// Check if the building exists
		const building = await Building.findById(buildingId)
		if (!building) {
			logger.warn(`Intento de crear torre fallido: Edificio con ID ${buildingId} no encontrado.`)
			return res.status(400).json({ message: 'Invalid buildingId. Building does not exist.' })
		}

		// Generate a friendlyId for the tower based on the building's friendlyId
		const randomString = uuidv4().slice(-4)
		const friendlyId = `${building.friendlyId}-${randomString}`

		logger.info(`Generando Tower con friendlyId: ${friendlyId}`)

		// Create the tower with the buildingId reference
		const newTower = new Tower({
			buildingId,
			friendlyId,
			floorsNumber,
			premisesAmount,
			functionalUnitsData: []
		})

		if (functionalUnits && functionalUnits.length > 0) {
			logger.info(`Se proporcionaron ${functionalUnits.length} unidades funcionales para la torre.`)

			const functionalUnitIds = []

			for (const functionalUnitData of functionalUnits) {
				const functionalUnitFriendlyId = `${newTower.friendlyId}-${uuidv4().slice(-4)}`

				const functionalUnit = new FunctionalUnit({
					friendlyId: functionalUnitFriendlyId,
					...functionalUnitData
				})

				await functionalUnit.save()
				functionalUnitIds.push(functionalUnit._id)

				logger.info(`Unidad funcional creada con friendlyId: ${functionalUnitFriendlyId}`)
			}

			newTower.functionalUnitsData = functionalUnitIds
		} else {
			logger.info(`No se proporcionaron unidades funcionales para la torre.`)
		}

		// Save the new tower
		await newTower.save()
		logger.info(`Torre creada con éxito en el edificio ID ${buildingId}, friendlyId: ${friendlyId}`)

		// Update the building with the new towerId
		building.towersData.push(newTower._id)
		await building.save()
		logger.info(`Edificio ID ${buildingId} actualizado con la nueva torre ID ${newTower._id}`)

		res.status(201).json(newTower)
	} catch (error) {
		logger.error(`Error al crear torre en el edificio ID ${req.body.buildingId}: ${error.message}`)
		res.status(500).json({ message: 'Error creating tower', error })
	}
}

// Get all Towers
exports.getAllTowers = async (req, res) => {
	try {
		logger.info('Solicitud recibida para obtener todas las torres.')

		const towers = await Tower.find().populate('buildingId')

		logger.info(`Se recuperaron ${towers.length} torres.`)
		res.status(200).json(towers)
	} catch (error) {
		logger.error(`Error al recuperar torres: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar torres', error: error.message })
	}
}

// Get a Tower by ID
exports.getTowerById = async (req, res) => {
	try {
		const { id } = req.params
		logger.info(`Solicitud recibida para obtener la torre con ID ${id}.`)

		const tower = await Tower.findById(id).populate('buildingId')
		if (!tower) {
			logger.warn(`Intento de obtener torre fallido: Torre con ID ${id} no encontrada.`)
			return res.status(404).json({ message: 'Torre no encontrada' })
		}

		logger.info(`Torre con ID ${id} recuperada correctamente.`)
		res.status(200).json(tower)
	} catch (error) {
		logger.error(`Error al recuperar la torre con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar la torre', error: error.message })
	}
}

// Update a Tower by ID
exports.updateTower = async (req, res) => {
	try {
		const { id } = req.params
		const { floorsNumber, premisesAmount } = req.body

		logger.info(`Solicitud recibida para actualizar la torre con ID ${id}.`)

		// Find the tower by ID
		const tower = await Tower.findById(id)
		if (!tower) {
			logger.warn(`Intento de actualización fallido: Torre con ID ${id} no encontrada.`)
			return res.status(404).json({ message: 'Torre no encontrada' })
		}

		// Update tower details
		if (floorsNumber) tower.floorsNumber = floorsNumber
		if (premisesAmount) tower.premisesAmount = premisesAmount

		// Save updated tower
		await tower.save()

		logger.info(`Torre con ID ${id} actualizada con éxito.`)
		res.status(200).json(tower)
	} catch (error) {
		logger.error(`Error al actualizar la torre con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al actualizar la torre', error })
	}
}

// Delete a Tower by ID
exports.deleteTower = async (req, res) => {
	try {
		const { id } = req.params
		logger.info(`Solicitud recibida para eliminar la torre con ID ${id}.`)

		const tower = await Tower.findById(id)
		if (!tower) {
			logger.warn(`Intento de eliminación fallido: Torre con ID ${id} no encontrada.`)
			return res.status(404).json({ message: 'Tower not found' })
		}

		const building = await Building.findOne({ towersData: tower._id })
		if (building) {
			building.towersData = building.towersData.filter(
				(towerId) => towerId.toString() !== tower._id.toString()
			)
			await building.save()
			logger.info(`Referencia de la torre ID ${id} eliminada del edificio ID ${building._id}.`)
		}

		await tower.deleteOne()
		logger.info(`Torre con ID ${id} eliminada correctamente.`)

		res.status(200).json({ message: 'Torre eliminada correctamente' })
	} catch (error) {
		logger.error(`Error al eliminar la torre con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al eliminar la torre', error: error.message })
	}
}
