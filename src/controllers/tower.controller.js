const { v4: uuidv4 } = require('uuid')
const Building = require('../models/Building')
const Tower = require('../models/Tower')
const FunctionalUnit = require('../models/FunctionalUnit')

// Create a new Tower
exports.createTower = async (req, res) => {
	try {
		const { buildingId, floorsNumber, premisesAmount, functionalUnits } = req.body

		// Check if the building exists
		const building = await Building.findById(buildingId)
		if (!building) {
			return res.status(400).json({ message: 'Invalid buildingId. Building does not exist.' })
		}

		// Generate a friendlyId for the tower based on the building's friendlyId
		const randomString = uuidv4().slice(-4)
		const friendlyId = `${building.friendlyId}-${randomString}`

		// Create the tower with the buildingId reference
		const newTower = new Tower({
			buildingId, // New field to associate with the building
			friendlyId,
			floorsNumber,
			premisesAmount,
			functionalUnitsData: []
		})

		// If functionalUnits are provided, add them to the tower
		if (functionalUnits && functionalUnits.length > 0) {
			const functionalUnitIds = []

			for (const functionalUnitData of functionalUnits) {
				// Generate a friendlyId for the functional unit based on the tower's friendlyId
				const functionalUnitFriendlyId = `${newTower.friendlyId}-${uuidv4().slice(-4)}`

				const functionalUnit = new FunctionalUnit({
					friendlyId: functionalUnitFriendlyId,
					...functionalUnitData
				})

				await functionalUnit.save()
				functionalUnitIds.push(functionalUnit._id)
			}

			// Update the tower with the functionalUnitIds
			newTower.functionalUnitsData = functionalUnitIds
		}

		// Save the new tower
		await newTower.save()

		// Update the building with the new towerId
		building.towersData.push(newTower._id)
		await building.save()

		res.status(201).json(newTower)
	} catch (error) {
		res.status(500).json({ message: 'Error creating tower', error })
	}
}

// Get all Towers
exports.getAllTowers = async (req, res) => {
	try {
		const towers = await Tower.find().populate('buildingId')
		res.status(200).json(towers)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving towers', error })
	}
}

// Get a Tower by ID
exports.getTowerById = async (req, res) => {
	try {
		const tower = await Tower.findById(req.params.id).populate('buildingId')
		if (!tower) {
			return res.status(404).json({ message: 'Tower not found' })
		}
		res.status(200).json(tower)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error retrieving tower', error: error.message })
	}
}

// Update a Tower by ID
exports.updateTower = async (req, res) => {
	try {
		const { floorsNumber, premisesAmount } = req.body

		// Find the tower by ID
		const tower = await Tower.findById(req.params.id)
		if (!tower) {
			return res.status(404).json({ message: 'Tower not found' })
		}

		// Update tower details
		if (floorsNumber) tower.floorsNumber = floorsNumber
		if (premisesAmount) tower.premisesAmount = premisesAmount

		// Save updated tower
		await tower.save()
		res.status(200).json(tower)
	} catch (error) {
		res.status(500).json({ message: 'Error updating tower', error })
	}
}

// Delete a Tower by ID
exports.deleteTower = async (req, res) => {
	try {
		const tower = await Tower.findById(req.params.id)
		if (!tower) {
			return res.status(404).json({ message: 'Tower not found' })
		}

		// Find the building that contains this tower
		const building = await Building.findOne({ towersData: tower._id })
		if (building) {
			// Remove the tower id from towersData array in the building
			building.towersData = building.towersData.filter(
				(towerId) => towerId.toString() !== tower._id.toString()
			)
			await building.save() // Save the building after removing the tower reference
		}

		await tower.deleteOne() // Now delete the tower
		res
			.status(200)
			.json({ message: 'Tower deleted successfully and reference removed from building' })
	} catch (error) {
		res.status(500).json({ message: 'Error deleting tower', error })
	}
}
