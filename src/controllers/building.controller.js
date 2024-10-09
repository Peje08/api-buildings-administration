const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const Building = require('../models/Building')
const Administration = require('../models/Administration')
const FunctionalUnit = require('../models/FunctionalUnit')
const Plan = require('../models/Plan')
const Tower = require('../models/Tower')
const User = require('../models/User')

// Create a new Building with towers and functional units
exports.createFullBuilding = async (req, res) => {
	try {
		const { administrationId, ownerUserId, buildings } = req.body

		// Verify if the administration exists
		const administration = await Administration.findById(administrationId)
		if (!administration) {
			return res
				.status(400)
				.json({ message: 'Invalid administrationId. Administration does not exist.' })
		}

		// Verify if the ownerUserId is valid
		const ownerUser = await User.findById(ownerUserId)
		if (!ownerUser || !['SUPERUSER', 'ADMINISTRATION', 'OWNER'].includes(ownerUser.type)) {
			return res.status(400).json({
				message: 'Invalid ownerUserId. Must be a SUPERUSER, ADMINISTRATION, or OWNER.'
			})
		}

		// Object to store the results of created entities
		const result = {
			administration: {
				id: administration._id,
				name: administration.name,
				buildings: []
			}
		}

		// Iterate through each building in the buildings object
		for (const [_, buildingData] of Object.entries(buildings)) {
			const { street, number, towers } = buildingData

			// Generate a friendlyId for the building
			const friendlyId = `${administration.friendlyId}-${uuidv4().slice(-4)}`

			// Create the new building
			const newBuilding = new Building({
				administrationId: administration._id,
				friendlyId,
				streetName: street,
				streetNumber: number,
				towersData: []
			})
			await newBuilding.save()

			// Object to store the building's details and towers
			const buildingDetails = {
				id: newBuilding._id,
				friendlyId: newBuilding.friendlyId,
				streetName: newBuilding.streetName,
				streetNumber: newBuilding.streetNumber,
				towers: []
			}

			// Iterate through the towers
			for (const [_, towerData] of Object.entries(towers)) {
				const { towerName, floors, hasPremise, premise, groundFloor } = towerData

				// Create the tower
				const newTower = new Tower({
					name: towerName,
					buildingId: newBuilding._id,
					friendlyId: `${newBuilding.friendlyId}-${uuidv4().slice(-4)}`, // FriendlyId based on the building
					floorsNumber: floors,
					premisesAmount: hasPremise && premise ? Object.keys(premise).length : 0,
					functionalUnitsData: []
				})
				await newTower.save()

				// Object to store tower details and functional units
				const towerDetails = {
					id: newTower._id,
					friendlyId: newTower.friendlyId,
					name: newTower.name,
					floorsNumber: newTower.floorsNumber,
					functionalUnits: []
				}

				// Create functional units for the premises (if any)
				if (hasPremise && premise) {
					for (const [_, ufData] of Object.entries(premise)) {
						const newUser = await createUserForFunctionalUnit(ufData)
						const newFunctionalUnit = await createFunctionalUnit(
							newTower,
							ufData,
							newUser,
							'PREMISE'
						)
						newTower.functionalUnitsData.push(newFunctionalUnit._id)

						// Store details of the functional unit and user
						towerDetails.functionalUnits.push({
							id: newFunctionalUnit._id,
							name: newFunctionalUnit.name,
							type: newFunctionalUnit.type,
							occupied: newFunctionalUnit.occupied,
							ownerUser: newUser._id,
							userEmail: newUser.email
						})
					}
				}

				// Create functional units for the ground floor
				if (groundFloor) {
					for (const [_, ufData] of Object.entries(groundFloor)) {
						const newUser = await createUserForFunctionalUnit(ufData)
						const newFunctionalUnit = await createFunctionalUnit(
							newTower,
							ufData,
							newUser,
							'APARTMENT'
						)
						newTower.functionalUnitsData.push(newFunctionalUnit._id)

						// Store details of the functional unit and user
						towerDetails.functionalUnits.push({
							id: newFunctionalUnit._id,
							name: newFunctionalUnit.name,
							type: newFunctionalUnit.type,
							occupied: newFunctionalUnit.occupied,
							ownerUser: newUser._id,
							userEmail: newUser.email
						})
					}
				}

				// Create functional units for each floor
				for (let i = 1; i <= floors; i++) {
					const floorKey = `Floor-${i}`
					const floorData = towerData[floorKey]
					if (floorData) {
						for (const [_, ufData] of Object.entries(floorData)) {
							const newUser = await createUserForFunctionalUnit(ufData)
							const newFunctionalUnit = await createFunctionalUnit(
								newTower,
								ufData,
								newUser,
								'APARTMENT'
							)
							newTower.functionalUnitsData.push(newFunctionalUnit._id)

							// Store details of the functional unit and user
							towerDetails.functionalUnits.push({
								id: newFunctionalUnit._id,
								name: newFunctionalUnit.name,
								type: newFunctionalUnit.type,
								occupied: newFunctionalUnit.occupied,
								ownerUser: newUser._id,
								userEmail: newUser.email
							})
						}
					}
				}

				// Save the tower with its functional units
				await newTower.save()
				newBuilding.towersData.push(newTower._id)

				// Add tower details to the building
				buildingDetails.towers.push(towerDetails)
			}

			// Save the building with all towers
			await newBuilding.save()

			// Add the building to the administration's buildings array
			administration.buildings.push(newBuilding._id)
			await administration.save()

			// Add building details to the result
			result.administration.buildings.push(buildingDetails)
		}

		// Return the result with all created entities
		res.status(201).json({
			message: 'Building, towers, and functional units created successfully.',
			data: result
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error creating full building', error: error.message })
	}
}

// Function to create a user for each functional unit
const createUserForFunctionalUnit = async (ufData) => {
	const { userName, mail, cellularNumber } = ufData

	// Check if the user already exists
	let user = await User.findOne({ email: mail })
	if (!user) {
		const password = crypto.randomBytes(8).toString('hex')
		const hashedPassword = await bcrypt.hash(password, 10)

		// console.log({ email: mail, password })

		user = new User({
			name: userName,
			email: mail,
			password: hashedPassword,
			cellularNumer: cellularNumber || '',
			type: ufData.type // 'OWNER' or 'TENANT'
		})

		await user.save()
		// ! You can send the email with the password here (pending)
	}
	return user
}

// Function to create a functional unit
const createFunctionalUnit = async (tower, ufData, user, type) => {
	const { ufName, isRented } = ufData
	const functionalUnit = new FunctionalUnit({
		friendlyId: `${tower.friendlyId}-${uuidv4().slice(-4)}`,
		name: ufName,
		type, // 'PREMISE' or 'APARTMENT'
		occupied: isRented,
		ownerUserId: type === 'OWNER' ? user._id : null,
		tenantUserId: type === 'TENANT' ? user._id : null
	})
	await functionalUnit.save()
	return functionalUnit
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
