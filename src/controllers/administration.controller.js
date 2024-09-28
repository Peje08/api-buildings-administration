const Administration = require('../models/Administration')
const User = require('../models/User')

// Create an administration
exports.createAdministration = async (req, res) => {
	try {
		const { name, ownerId, buildings } = req.body

		// Check if the ownerId exists in the database
		const ownerExists = await User.findById(ownerId)

		if (!ownerExists) {
			return res.status(400).json({ message: 'Invalid ownerId. User does not exist.' })
		}

		// Generate a friendlyId using the name and the last 4 characters of ownerId
		const friendlyId = `${name.toLowerCase().replace(/\s+/g, '-')}-${ownerId.slice(-4)}`

		const newAdministration = new Administration({
			name,
			ownerId,
			friendlyId,
			buildings
		})

		await newAdministration.save()
		res.status(201).json(newAdministration)
	} catch (error) {
		res.status(500).json({ message: 'Error creating administration', error })
	}
}

// Obtain all administrations
exports.getAllAdministrations = async (req, res) => {
	try {
		// Fetch administrations and populate ownerId excluding the password field
		const administrations = await Administration.find().populate({
			path: 'ownerId',
			select: '-password'
		})

		// If no administrations are found, return a 404 message
		if (!administrations || administrations.length === 0) {
			return res.status(404).json({ message: 'No administrations found.' })
		}

		res.status(200).json(administrations)
	} catch (error) {
		console.error('Error obtaining administrations:', error)
		res.status(500).json({ message: 'Error obtaining administrations', error })
	}
}
// Obtain an administration by id
exports.getAdministrationById = async (req, res) => {
	try {
		const administration = await Administration.findById(req.params.id).populate({
			path: 'ownerId',
			select: '-password' // Exclude the password field
		})
		if (!administration) {
			return res.status(404).json({ message: 'Administración no encontrada' })
		}
		res.status(200).json(administration)
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener la administración', error })
	}
}

// Update an administration
exports.updateAdministration = async (req, res) => {
	try {
		const { name, buildings } = req.body

		const administration = await Administration.findById(req.params.id)
		if (!administration) {
			return res.status(404).json({ message: 'Administration not found' })
		}

		if (name) {
			administration.name = name
			const ownerIdPart = administration.ownerId.toString().slice(-4)
			administration.friendlyId = `${name.toLowerCase().replace(/\s+/g, '-')}-${ownerIdPart}`
		}

		if (buildings) {
			administration.buildings = buildings
		}

		// Save the updated administration
		await administration.save()
		res.status(200).json(administration)
	} catch (error) {
		res.status(500).json({ message: 'Error updating administration', error })
	}
}

// Delete an administration
exports.deleteAdministration = async (req, res) => {
	try {
		const administration = await Administration.findById(req.params.id)
		if (!administration) {
			return res.status(404).json({ message: 'Administration not found' })
		}

		await Administration.deleteOne({ _id: req.params.id })
		res.status(200).json({ message: 'Administration deleted successfully' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error deleting administration', error })
	}
}
