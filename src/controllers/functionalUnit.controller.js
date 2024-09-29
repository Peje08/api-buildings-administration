const { v4: uuidv4 } = require('uuid')
const FunctionalUnit = require('../models/FunctionalUnit')
const Tower = require('../models/Tower')
const User = require('../models/User')

// Create a new Functional Unit
exports.createFunctionalUnit = async (req, res) => {
	try {
		const { towerId, name, type, occupied, tenantUserId, ownerUserId } = req.body

		// Check if the tower exists
		const tower = await Tower.findById(towerId)
		if (!tower) {
			return res.status(400).json({ message: 'Invalid towerId. Tower does not exist.' })
		}

		// Check if the tenant exists and is of type TENANT
		if (tenantUserId) {
			const tenantExists = await User.findById(tenantUserId)
			if (!tenantExists || tenantExists.type !== 'TENANT') {
				return res.status(400).json({ message: 'Invalid tenantUserId or user is not a tenant.' })
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
			return res.status(400).json({ message: 'Invalid ownerUserId or missing user.' })
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

		res.status(201).json(newFunctionalUnit)
	} catch (error) {
		res.status(500).json({ message: 'Error creating functional unit', error })
	}
}

// Get all Functional Units
exports.getAllFunctionalUnits = async (req, res) => {
	try {
		const functionalUnits = await FunctionalUnit.find()
			.populate('tenantUserId', '-password')
			.populate('ownerUserId', '-password')
		res.status(200).json(functionalUnits)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving functional units', error })
	}
}

// Get a Functional Unit by ID
exports.getFunctionalUnitById = async (req, res) => {
	try {
		const functionalUnit = await FunctionalUnit.findById(req.params.id)
			.populate('tenantUserId', '-password')
			.populate('ownerUserId', '-password')

		if (!functionalUnit) {
			return res.status(404).json({ message: 'Functional unit not found' })
		}

		res.status(200).json(functionalUnit)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving functional unit', error })
	}
}

// Update a Functional Unit by ID
exports.updateFunctionalUnit = async (req, res) => {
	try {
		const { name, type, occupied, tenantUserId, ownerUserId } = req.body

		const functionalUnit = await FunctionalUnit.findById(req.params.id)
		if (!functionalUnit) {
			return res.status(404).json({ message: 'Functional unit not found' })
		}

		// Update details
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
		res.status(200).json(functionalUnit)
	} catch (error) {
		res.status(500).json({ message: 'Error updating functional unit', error })
	}
}

// Delete a Functional Unit by ID
exports.deleteFunctionalUnit = async (req, res) => {
	try {
		const functionalUnit = await FunctionalUnit.findById(req.params.id)
		if (!functionalUnit) {
			return res.status(404).json({ message: 'Functional unit not found' })
		}

		await functionalUnit.deleteOne()
		res.status(200).json({ message: 'Functional unit deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error deleting functional unit', error })
	}
}
