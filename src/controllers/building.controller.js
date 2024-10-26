const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const Building = require('../models/Building')
const Administration = require('../models/Administration')
const FunctionalUnit = require('../models/FunctionalUnit')
const Plan = require('../models/Plan')
const Tower = require('../models/Tower')
const User = require('../models/User')
const { hashPassword } = require('../utils/hashPassword')
const { welcomeMail } = require('../utils/templates/welcomeMail')
const sendEmail = require('../utils/sendEmail')
const {
	administrationNotificationMail
} = require('../utils/templates/administrationNotificationMail')

// Create a new Building with towers and functional units
exports.createFullBuilding = async (req, res) => {
	try {
		const { administrationId, ownerUserId, street, number, towers, plan, ufLength } = req.body

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

		// Create a plan based on the information provided
		const newPlan = new Plan({
			friendlyId: `plan-${uuidv4().slice(-4)}`,
			description: plan.planDescription,
			price: plan.price,
			functionUnitsAmount: ufLength
		})
		await newPlan.save()

		// Generate a friendlyId for the building
		const friendlyId = `${administration.friendlyId}-${uuidv4().slice(-4)}`

		// Create the new building
		const newBuilding = new Building({
			administrationId: administration._id,
			planId: newPlan._id,
			friendlyId,
			streetName: street,
			streetNumber: number,
			towersData: []
		})
		await newBuilding.save()

		// Object to store the result details
		const buildingDetails = {
			id: newBuilding._id,
			friendlyId: newBuilding.friendlyId,
			streetName: newBuilding.streetName,
			streetNumber: newBuilding.streetNumber,
			towers: []
		}

		// Iterate through the towers
		for (const towerData of towers) {
			const { towerName, floors, hasPremise, premise, groundFloor } = towerData

			// Create the tower
			const newTower = new Tower({
				name: towerName,
				buildingId: newBuilding._id,
				friendlyId: `${newBuilding.friendlyId}-${uuidv4().slice(-4)}`,
				floorsNumber: floors,
				premisesAmount: hasPremise && premise ? Object.keys(premise).length : 0,
				functionalUnitsData: []
			})
			await newTower.save()

			const towerDetails = {
				id: newTower._id,
				friendlyId: newTower.friendlyId,
				name: newTower.name,
				floorsNumber: newTower.floorsNumber,
				functionalUnits: []
			}

			// Create functional units for premises (if any)
			if (hasPremise && premise) {
				for (const ufData of Object.values(premise)) {
					// Only create a user if an email is provided
					if (ufData.mail) {
						const newUser = await createUserForFunctionalUnit(
							ufData,
							administration.name,
							street,
							number
						)
						const newFunctionalUnit = await createFunctionalUnit(
							newTower,
							ufData,
							newUser,
							'PREMISE'
						)
						newTower.functionalUnitsData.push(newFunctionalUnit._id)
						towerDetails.functionalUnits.push({
							id: newFunctionalUnit._id,
							name: newFunctionalUnit.name,
							ownerUser: newUser._id,
							userEmail: newUser.email
						})
					}
				}
			}

			// Create functional units for the ground floor
			if (groundFloor) {
				for (const ufData of Object.values(groundFloor)) {
					// Only create a user if an email is provided
					if (ufData.mail) {
						const newUser = await createUserForFunctionalUnit(
							ufData,
							administration.name,
							street,
							number
						)
						const newFunctionalUnit = await createFunctionalUnit(
							newTower,
							ufData,
							newUser,
							'APARTMENT'
						)
						newTower.functionalUnitsData.push(newFunctionalUnit._id)
						towerDetails.functionalUnits.push({
							id: newFunctionalUnit._id,
							name: newFunctionalUnit.name,
							ownerUser: newUser._id,
							userEmail: newUser.email
						})
					}
				}
			}

			// Create functional units for each floor
			for (let i = 1; i <= floors; i++) {
				const floorKey = `Floor-${i}`
				const floorData = towerData[floorKey]
				if (floorData) {
					for (const ufData of Object.values(floorData)) {
						// Only create a user if an email is provided
						if (ufData.mail) {
							const newUser = await createUserForFunctionalUnit(
								ufData,
								administration.name,
								street,
								number
							)
							const newFunctionalUnit = await createFunctionalUnit(
								newTower,
								ufData,
								newUser,
								'APARTMENT'
							)
							newTower.functionalUnitsData.push(newFunctionalUnit._id)
							towerDetails.functionalUnits.push({
								id: newFunctionalUnit._id,
								name: newFunctionalUnit.name,
								ownerUser: newUser._id,
								userEmail: newUser.email
							})
						}
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

		// Send an email notification to the administration
		const subject = 'Edificio creado exitosamente'
		const htmlContent = administrationNotificationMail(administration.name, street, number)
		await sendEmail(ownerUser.email, subject, htmlContent)

		// Return the result with all created entities
		res.status(201).json({
			message: 'Building, towers, and functional units created successfully.',
			data: {
				...buildingDetails,
				plan: {
					id: newPlan._id,
					friendlyId: newPlan.friendlyId,
					description: newPlan.description,
					price: newPlan.price,
					functionUnitsAmount: newPlan.functionUnitsAmount
				}
			}
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error creating full building', error: error.message })
	}
}

// Function to create a user for each functional unit
const createUserForFunctionalUnit = async (ufData, adminName, streetAddress, numberAddress) => {
	const { fullName, mail, cellularNumber } = ufData

	// Check if the user already exists
	let user = await User.findOne({ email: mail })
	if (!user) {
		const password = crypto.randomBytes(8).toString('hex')
		const hashedPassword = await hashPassword(password)

		user = new User({
			username: fullName,
			email: mail,
			password: hashedPassword,
			cellularNumer: cellularNumber || '',
			type: ufData.type // 'OWNER' or 'TENANT'
		})

		await user.save()

		// Send an email with the user's credentials
		const subject = 'Bienvenido a la plataforma - Tus credenciales'
		const htmlContent = welcomeMail(
			adminName,
			fullName,
			mail,
			password,
			streetAddress,
			numberAddress
		)
		await sendEmail(mail, subject, htmlContent)
	}
	return user
}

// Function to create a functional unit
const createFunctionalUnit = async (tower, ufData, user, type) => {
	const { name, isRented } = ufData
	const functionalUnit = new FunctionalUnit({
		friendlyId: `${tower.friendlyId}-${uuidv4().slice(-4)}`,
		name,
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
