const Plan = require('../models/Plan')
const { v4: uuidv4 } = require('uuid')
const logger = require('../utils/logger')

// Create a new plan
exports.createPlan = async (req, res) => {
	try {
		const { name, description, featuresFlags, functionUnitsAmount } = req.body

		logger.info(`Solicitud recibida para crear un plan con nombre: ${name}`)

		const basePrice = 100
		const price = basePrice * Math.pow(1.5, Math.ceil(functionUnitsAmount / 10) - 1)

		const randomString = uuidv4().slice(-4)
		const friendlyId = `${name.toLowerCase().replace(/\s+/g, '-')}-${randomString}`

		const newPlan = new Plan({
			friendlyId,
			name,
			description,
			price,
			featuresFlags,
			functionUnitsAmount
		})

		await newPlan.save()

		logger.info(`Plan creado con éxito: ${friendlyId}`)
		res.status(201).json(newPlan)
	} catch (error) {
		logger.error(`Error al crear el plan: ${error.message}`)
		res.status(500).json({ message: 'Error al crear el plan', error })
	}
}

// Get all plans
exports.getAllPlans = async (req, res) => {
	try {
		logger.info('Solicitud recibida para obtener todos los planes.')

		const plans = await Plan.find()

		logger.info(`Se recuperaron ${plans.length} planes.`)
		res.status(200).json(plans)
	} catch (error) {
		logger.error(`Error al recuperar los planes: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar los planes', error })
	}
}

// Get a plan by ID
exports.getPlanById = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para obtener el plan con ID ${req.params.id}.`)

		const plan = await Plan.findById(req.params.id)
		if (!plan) {
			logger.warn(`Intento de obtener plan fallido: Plan con ID ${req.params.id} no encontrado.`)
			return res.status(404).json({ message: 'El plan no fue encontrado' })
		}

		logger.info(`Plan con ID ${req.params.id} recuperado correctamente.`)
		res.status(200).json(plan)
	} catch (error) {
		logger.error(`Error al recuperar el plan con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar el plan', error })
	}
}

// Update a plan
exports.updatePlan = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para actualizar el plan con ID ${req.params.id}.`)

		const { name, description, price, featuresFlags, functionUnitsAmount } = req.body

		const plan = await Plan.findById(req.params.id)
		if (!plan) {
			logger.warn(`Intento de actualización fallido: Plan con ID ${req.params.id} no encontrado.`)
			return res.status(404).json({ message: 'El plan no fue encontrado' })
		}

		logger.info(
			`Actualizando plan con ID ${req.params.id}. Datos recibidos: ${JSON.stringify(req.body)}`
		)

		if (name) {
			plan.name = name
			const randomString = uuidv4().slice(-4)
			plan.friendlyId = `${name.toLowerCase().replace(/\s+/g, '-')}-${randomString}`
		}
		if (description) plan.description = description
		if (price) plan.price = price
		if (featuresFlags) plan.featuresFlags = featuresFlags
		if (functionUnitsAmount) plan.functionUnitsAmount = functionUnitsAmount

		await plan.save()

		logger.info(`Plan con ID ${req.params.id} actualizado con éxito.`)
		res.status(200).json(plan)
	} catch (error) {
		logger.error(`Error al actualizar el plan con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al actualizar el plan', error })
	}
}

// Delete a plan
exports.deletePlan = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para eliminar el plan con ID ${req.params.id}.`)

		const plan = await Plan.findById(req.params.id)
		if (!plan) {
			logger.warn(`Intento de eliminación fallido: Plan con ID ${req.params.id} no encontrado.`)
			return res.status(404).json({ message: 'El plan no fue encontrado' })
		}

		await plan.deleteOne()

		logger.info(`Plan con ID ${req.params.id} eliminado correctamente.`)
		res.status(200).json({ message: 'El plan fue eliminado con éxito' })
	} catch (error) {
		logger.error(`Error al eliminar el plan con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al eliminar el plan', error })
	}
}
