const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const logger = require('../utils/logger')
const Building = require('../models/Building')
const Administration = require('../models/Administration')
const FunctionalUnit = require('../models/FunctionalUnit')
const Plan = require('../models/Plan')
const Tower = require('../models/Tower')
const User = require('../models/User')
const { hashPassword } = require('../utils/hashPassword')
const sendEmail = require('../utils/sendEmail')
const { welcomeMail } = require('../utils/templates/welcomeMail')
const {
	administrationNotificationMail
} = require('../utils/templates/administrationNotificationMail')

// Create a new Building with towers and functional units
exports.createFullBuilding = async (req, res) => {
	try {
		const { administrationId, ownerUserId, street, number, towers, plan, ufLength } = req.body

		logger.info('Solicitud recibida para crear un edificio completo.')

		// Verify if the administration exists
		const administration = await Administration.findById(administrationId)
		if (!administration) {
			logger.warn(
				`Intento de creación fallido: Administración con ID ${administrationId} no encontrada.`
			)
			return res
				.status(400)
				.json({ message: 'ID de administración inválido. La administración no existe.' })
		}

		// Verify if the ownerUserId is valid
		const ownerUser = await User.findById(ownerUserId)
		if (!ownerUser || !['SUPERUSER', 'ADMINISTRATION', 'OWNER'].includes(ownerUser.type)) {
			logger.warn(`Intento de creación fallido: Usuario con ID ${ownerUserId} no válido.`)
			return res.status(400).json({
				message: 'ID de usuario propietario inválido. Debe ser SUPERUSER, ADMINISTRATION o OWNER.'
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

		logger.info(`Edificio creado con éxito. ID: ${newBuilding._id}, Friendly ID: ${friendlyId}`)

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

			logger.info(
				`Torre creada con éxito. ID: ${newTower._id}, Friendly ID: ${newTower.friendlyId}`
			)

			// Create functional units for premises (if any)
			if (hasPremise && premise) {
				for (const ufData of Object.values(premise)) {
					if (ufData.mail) {
						const newUser = await createUserForFunctionalUnit(
							ufData,
							administration.name,
							street,
							number,
							newBuilding._id
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
						logger.info(
							`Unidad funcional creada con éxito en torre ID ${newTower._id}, ID: ${newFunctionalUnit._id}`
						)
					}
				}
			}

			// Create functional units for the ground floor
			if (groundFloor) {
				for (const ufData of Object.values(groundFloor)) {
					if (ufData.mail) {
						const newUser = await createUserForFunctionalUnit(
							ufData,
							administration.name,
							street,
							number,
							newBuilding._id
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
						logger.info(
							`Unidad funcional creada con éxito en torre ID ${newTower._id}, ID: ${newFunctionalUnit._id}`
						)
					}
				}
			}

			// Create functional units for each floor
			for (let i = 1; i <= floors; i++) {
				const floorKey = `Floor-${i}`
				const floorData = towerData[floorKey]
				if (floorData) {
					for (const ufData of Object.values(floorData)) {
						if (ufData.mail) {
							const newUser = await createUserForFunctionalUnit(
								ufData,
								administration.name,
								street,
								number,
								newBuilding._id
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
							logger.info(
								`Unidad funcional creada con éxito en torre ID ${newTower._id}, ID: ${newFunctionalUnit._id}`
							)
						}
					}
				}
			}

			// Save the tower with its functional units
			await newTower.save()
			newBuilding.towersData.push(newTower._id)
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

		logger.info(`Edificio completo creado con éxito. ID: ${newBuilding._id}`)

		// Return the result with all created entities
		res.status(201).json({
			message: 'Edificio, torres y unidades funcionales creados con éxito.',
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
		logger.error(`Error al crear el edificio completo: ${error.message}`)
		res.status(500).json({ message: 'Error al crear el edificio completo', error: error.message })
	}
}

// Function to create a user for each functional unit
const createUserForFunctionalUnit = async (
	ufData,
	adminName,
	streetAddress,
	numberAddress,
	buildingId
) => {
	const { fullName, mail, cellularNumber } = ufData

	// Check if the user already exists
	let user = await User.findOne({ email: mail })
	if (!user) {
		// Generar una contraseña aleatoria para el usuario
		const password = crypto.randomBytes(8).toString('hex')
		const hashedPassword = await hashPassword(password)
		const resetToken = crypto.randomBytes(32).toString('hex')

		user = new User({
			username: fullName,
			buildingId,
			email: mail,
			password: hashedPassword,
			cellularNumber: cellularNumber || '',
			type: ufData.type, // 'OWNER' o 'TENANT'
			streetName: streetAddress,
			streetNumber: numberAddress,
			resetPasswordToken: resetToken
		})

		await user.save()

		// Enviar email con la contraseña generada (no el enlace de reset)
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

		logger.info('Solicitud recibida para crear un edificio.')

		// Check if the administration and plan exist
		const administration = await Administration.findById(administrationId)
		if (!administration) {
			logger.warn(
				`Intento de creación fallido: Administración con ID ${administrationId} no encontrada.`
			)
			return res
				.status(400)
				.json({ message: 'ID de administración inválido. La administración no existe.' })
		}

		const planExists = await Plan.findById(planId)
		if (!planExists) {
			logger.warn(`Intento de creación fallido: Plan con ID ${planId} no encontrado.`)
			return res.status(400).json({ message: 'ID de plan inválido. El plan no existe.' })
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

		logger.info(`Edificio creado con éxito. ID: ${newBuilding._id}, Friendly ID: ${friendlyId}`)

		// If there are towers provided, create them
		if (towers && towers.length > 0) {
			const towerIds = []

			for (const towerData of towers) {
				const towerFriendlyId = `${newBuilding.friendlyId}-${uuidv4().slice(-4)}`

				const tower = new Tower({
					friendlyId: towerFriendlyId,
					floorsNumber: towerData.floorsNumber,
					premisesAmount: towerData.premisesAmount || 0,
					functionalUnitsData: []
				})

				await tower.save()
				towerIds.push(tower._id)

				logger.info(`Torre creada con éxito. ID: ${tower._id}, Friendly ID: ${towerFriendlyId}`)
			}

			// Update building with towerIds
			newBuilding.towersData = towerIds
			await newBuilding.save()
		}

		res.status(201).json(newBuilding)
	} catch (error) {
		logger.error(`Error al crear el edificio: ${error.message}`)
		res.status(500).json({ message: 'Error al crear el edificio', error })
	}
}

// Get all Buildings
exports.getAllBuildings = async (req, res) => {
	try {
		logger.info('Solicitud recibida para obtener todos los edificios.')

		const buildings = await Building.find()
			.populate('administrationId')
			.populate('planId')
			.populate({
				path: 'towersData',
				populate: {
					path: 'functionalUnitsData'
				}
			})

		logger.info(`Se recuperaron ${buildings.length} edificios.`)
		res.status(200).json(buildings)
	} catch (error) {
		logger.error(`Error al recuperar los edificios: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar los edificios', error: error.message })
	}
}

// Get a Building by ID
exports.getBuildingById = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para obtener el edificio con ID ${req.params.id}.`)

		const building = await Building.findById(req.params.id)
			.populate('administrationId')
			.populate('planId')
			.populate({
				path: 'towersData',
				populate: {
					path: 'functionalUnitsData'
				}
			})

		if (!building) {
			logger.warn(
				`Intento de obtener edificio fallido: Edificio con ID ${req.params.id} no encontrado.`
			)
			return res.status(404).json({ message: 'El edificio no fue encontrado' })
		}

		logger.info(`Edificio con ID ${req.params.id} recuperado correctamente.`)
		res.status(200).json(building)
	} catch (error) {
		logger.error(`Error al recuperar el edificio con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar el edificio', error })
	}
}

// Update a Building by ID
exports.updateBuilding = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para actualizar el edificio con ID ${req.params.id}.`)

		const { streetName, streetNumber, planId, administrationId, towersToRemove } = req.body

		const building = await Building.findById(req.params.id)
		if (!building) {
			logger.warn(
				`Intento de actualización fallido: Edificio con ID ${req.params.id} no encontrado.`
			)
			return res.status(404).json({ message: 'El edificio no fue encontrado' })
		}

		// Check if the administration exists
		const administration = await Administration.findById(
			administrationId || building.administrationId
		)
		if (!administration) {
			logger.warn(
				`Intento de actualización fallido: Administración con ID ${administrationId} no encontrada.`
			)
			return res
				.status(400)
				.json({ message: 'ID de administración inválido. La administración no existe.' })
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
				logger.warn(`Intento de actualización fallido: Plan con ID ${planId} no encontrado.`)
				return res.status(400).json({ message: 'ID de plan inválido. El plan no existe.' })
			}
			building.planId = planId
		}

		// Remove specific towers if towersToRemove is provided
		if (towersToRemove && towersToRemove.length > 0) {
			building.towersData = building.towersData.filter(
				(towerId) => !towersToRemove.includes(towerId.toString())
			)
		}

		await building.save()

		logger.info(`Edificio con ID ${req.params.id} actualizado con éxito.`)
		res.status(200).json(building)
	} catch (error) {
		logger.error(`Error al actualizar el edificio con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al actualizar el edificio', error })
	}
}

// Delete a Building by ID
exports.deleteBuilding = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para eliminar el edificio con ID ${req.params.id}.`)

		const building = await Building.findById(req.params.id)
		if (!building) {
			logger.warn(`Intento de eliminación fallido: Edificio con ID ${req.params.id} no encontrado.`)
			return res.status(404).json({ message: 'El edificio no fue encontrado' })
		}

		await building.deleteOne()

		logger.info(`Edificio con ID ${req.params.id} eliminado correctamente.`)
		res.status(200).json({ message: 'El edificio fue eliminado con éxito' })
	} catch (error) {
		logger.error(`Error al eliminar el edificio con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al eliminar el edificio', error })
	}
}
