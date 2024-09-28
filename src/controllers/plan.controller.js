const Plan = require('../models/Plan')
const { v4: uuidv4 } = require('uuid')

// Create a new plan
exports.createPlan = async (req, res) => {
	try {
		const { name, description, featuresFlags, functionUnitsAmount } = req.body

		// Base price for Plan A
		const basePrice = 100

		// Calculate the price based on the functionUnitsAmount (UF)
		const price = basePrice * Math.pow(1.5, Math.ceil(functionUnitsAmount / 10) - 1)

		// Generate a random friendlyId
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
		res.status(201).json(newPlan)
	} catch (error) {
		res.status(500).json({ message: 'Error creating plan', error })
	}
}

// Get all plans
exports.getAllPlans = async (req, res) => {
	try {
		const plans = await Plan.find()
		res.status(200).json(plans)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving plans', error })
	}
}

// Get a plan by ID
exports.getPlanById = async (req, res) => {
	try {
		const plan = await Plan.findById(req.params.id)
		if (!plan) {
			return res.status(404).json({ message: 'Plan not found' })
		}
		res.status(200).json(plan)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving plan', error })
	}
}

// Update a plan
exports.updatePlan = async (req, res) => {
	try {
		const { name, description, price, featuresFlags, functionUnitsAmount } = req.body

		const plan = await Plan.findById(req.params.id)
		if (!plan) {
			return res.status(404).json({ message: 'Plan not found' })
		}

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
		res.status(200).json(plan)
	} catch (error) {
		res.status(500).json({ message: 'Error updating plan', error })
	}
}

// Delete a plan
exports.deletePlan = async (req, res) => {
	try {
		const plan = await Plan.findById(req.params.id)
		if (!plan) {
			return res.status(404).json({ message: 'Plan not found' })
		}

		await plan.deleteOne()
		res.status(200).json({ message: 'Plan deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error deleting plan', error })
	}
}
