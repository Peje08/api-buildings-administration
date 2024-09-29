const { v4: uuidv4 } = require('uuid')
const Building = require('../models/Building')
const Administration = require('../models/Administration')
const FunctionalUnit = require('../models/FunctionalUnit')
const Plan = require('../models/Plan')
const Tower = require('../models/Tower')
const User = require('../models/User')

// Create a new Building with towers and functional units
exports.createFullBuilding = async (req, res) => {
	try {
		const { administrationId, planId, streetName, streetNumber, towers, ownerUserId } = req.body

		// Check if the administration exists
		const administration = await Administration.findById(administrationId)
		if (!administration) {
			return res
				.status(400)
				.json({ message: 'Invalid administrationId. Administration does not exist.' })
		}

		// Check if the plan exists
		const planExists = await Plan.findById(planId)
		if (!planExists) {
			return res.status(400).json({ message: 'Invalid planId. Plan does not exist.' })
		}

		// Check if ownerUserId is valid
		const ownerUser = await User.findById(ownerUserId)
		if (!ownerUser || ['SUPERUSER', 'ADMINISTRATION', 'OWNER'].indexOf(ownerUser.type) === -1) {
			return res
				.status(400)
				.json({ message: 'Invalid ownerUserId. Must be a SUPERUSER, ADMINISTRATION, or OWNER.' })
		}

		// Generate a friendlyId for the building
		const randomString = uuidv4().slice(-4)
		const friendlyId = `${administration.friendlyId}-${randomString}`

		// Create the building
		const newBuilding = new Building({
			administrationId,
			planId,
			friendlyId,
			streetName,
			streetNumber,
			towersData: []
		})

		// Save the building
		await newBuilding.save()

		// Create towers and functional units if provided
		if (towers && towers.length > 0) {
			const towerIds = []

			for (const towerData of towers) {
				// Generate a friendlyId for the tower based on the building's friendlyId
				const towerFriendlyId = `${newBuilding.friendlyId}-${uuidv4().slice(-4)}`

				const newTower = new Tower({
					buildingId: newBuilding._id,
					friendlyId: towerFriendlyId,
					floorsNumber: towerData.floorsNumber,
					premisesAmount: towerData.premisesAmount || 0,
					functionalUnitsData: []
				})

				// Save the tower first
				await newTower.save()

				// Create functional units within each tower
				if (towerData.functionalUnits && towerData.functionalUnits.length > 0) {
					const functionalUnitIds = []

					for (const functionalUnitData of towerData.functionalUnits) {
						// Generate a friendlyId for the functional unit based on the tower's friendlyId
						const functionalUnitFriendlyId = `${newTower.friendlyId}-${uuidv4().slice(-4)}`

						// Determine the tenant or owner of the functional unit
						let tenantUserId = null
						const unitOwnerUserId = functionalUnitData.ownerUserId || ownerUser._id

						if (functionalUnitData.tenantUserId) {
							const tenantExists = await User.findById(functionalUnitData.tenantUserId)
							if (!tenantExists || tenantExists.type !== 'TENANT') {
								return res
									.status(400)
									.json({ message: 'Invalid tenantUserId or user is not a tenant.' })
							}
							tenantUserId = functionalUnitData.tenantUserId
						}

						// Create the functional unit
						const newFunctionalUnit = new FunctionalUnit({
							friendlyId: functionalUnitFriendlyId,
							name: functionalUnitData.name,
							type: functionalUnitData.type,
							occupied: functionalUnitData.occupied || false,
							tenantUserId,
							ownerUserId: unitOwnerUserId
						})

						// Save the functional unit
						await newFunctionalUnit.save()

						// Add the functional unit ID to the tower
						functionalUnitIds.push(newFunctionalUnit._id)
					}

					// Update the tower with the functional units
					newTower.functionalUnitsData = functionalUnitIds
					await newTower.save()
				}

				// Add the tower ID to the building
				towerIds.push(newTower._id)
			}

			// Update the building with the towers
			newBuilding.towersData = towerIds
			await newBuilding.save()
		}

		res.status(201).json(newBuilding)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error creating full building', error: error.message })
	}
}

// Create a new Building
exports.createBuilding = async (req, res) => {
	try {
		const { administrationId, planId, streetName, streetNumber, towers } = req.body

		// Check if the administration and plan exist
		const administration = await Administration.findById(administrationId)
		if (!administration) {
			return res
				.status(400)
				.json({ message: 'Invalid administrationId. Administration does not exist.' })
		}

		const planExists = await Plan.findById(planId)
		if (!planExists) {
			return res.status(400).json({ message: 'Invalid planId. Plan does not exist.' })
		}

		// Generate a friendlyId for the building
		const randomString = uuidv4().slice(-4)
		const friendlyId = `${administration.friendlyId}-${randomString}`

		// Create the building without towers yet
		const newBuilding = new Building({
			administrationId,
			planId,
			friendlyId,
			streetName,
			streetNumber,
			towersData: []
		})

		// Save the building
		await newBuilding.save()

		// If there are towers provided, create them
		if (towers && towers.length > 0) {
			const towerIds = []

			for (const towerData of towers) {
				// Generate a friendlyId for the tower based on the building's friendlyId
				const towerFriendlyId = `${newBuilding.friendlyId}-${uuidv4().slice(-4)}`

				const tower = new Tower({
					friendlyId: towerFriendlyId,
					floorsNumber: towerData.floorsNumber,
					premisesAmount: towerData.premisesAmount || 0,
					functionalUnitsData: []
				})

				await tower.save()
				towerIds.push(tower._id)
			}

			// Update building with towerIds
			newBuilding.towersData = towerIds
			await newBuilding.save()
		}

		res.status(201).json(newBuilding)
	} catch (error) {
		res.status(500).json({ message: 'Error creating building', error })
	}
}

// Get all Buildings
exports.getAllBuildings = async (req, res) => {
	try {
		const buildings = await Building.find().populate('administrationId').populate('planId')
		res.status(200).json(buildings)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving buildings', error: error.message })
	}
}

// Get a Building by ID
exports.getBuildingById = async (req, res) => {
	try {
		const building = await Building.findById(req.params.id)
			.populate('administrationId')
			.populate('planId')
		if (!building) {
			return res.status(404).json({ message: 'Building not found' })
		}
		res.status(200).json(building)
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving building', error })
	}
}

// Update a Building by ID
exports.updateBuilding = async (req, res) => {
	try {
		const { streetName, streetNumber, planId, administrationId, towersToRemove } = req.body

		const building = await Building.findById(req.params.id)
		if (!building) {
			return res.status(404).json({ message: 'Building not found' })
		}

		// Check if the administration exists
		const administration = await Administration.findById(
			administrationId || building.administrationId
		)
		if (!administration) {
			return res
				.status(400)
				.json({ message: 'Invalid administrationId. Administration does not exist.' })
		}

		// Update fields and regenerate friendlyId if streetName is updated
		if (streetName) {
			building.streetName = streetName
			const randomString = uuidv4().slice(-4)
			building.friendlyId = `${administration.friendlyId}-${randomString}`
		}
		if (streetNumber) building.streetNumber = streetNumber

		// If a planId is provided, validate and update it
		if (planId) {
			const planExists = await Plan.findById(planId)
			if (!planExists) {
				return res.status(400).json({ message: 'Invalid planId. Plan does not exist.' })
			}
			building.planId = planId
		}

		// Remove specific towers if towersToRemove is provided
		if (towersToRemove && towersToRemove.length > 0) {
			// Filter out the towers that need to be removed
			building.towersData = building.towersData.filter(
				(towerId) => !towersToRemove.includes(towerId.toString())
			)
		}

		await building.save()
		res.status(200).json(building)
	} catch (error) {
		res.status(500).json({ message: 'Error updating building', error })
	}
}

// Delete a Building by ID
exports.deleteBuilding = async (req, res) => {
	try {
		const building = await Building.findById(req.params.id)
		if (!building) {
			return res.status(404).json({ message: 'Building not found' })
		}

		await building.deleteOne()
		res.status(200).json({ message: 'Building deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error deleting building', error })
	}
}
