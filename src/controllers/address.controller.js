const Address = require('../models/Address')

// Obtener todas las direcciones
exports.getAllAddresses = async (req, res) => {
	try {
		const addresses = await Address.find()
		res.status(200).json(addresses)
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener las direcciones.' })
	}
}

// Obtener una dirección por ID
exports.getAddressById = async (req, res) => {
	try {
		const address = await Address.findById(req.params.id)
		if (!address) {
			return res.status(404).json({ error: 'Dirección no encontrada.' })
		}
		res.status(200).json(address)
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener la dirección.' })
	}
}

// Crear una nueva dirección
exports.createAddress = async (req, res) => {
	try {
		const newAddress = new Address(req.body)
		const savedAddress = await newAddress.save()
		res.status(201).json(savedAddress)
	} catch (error) {
		res.status(400).json({ error: 'Error al crear la dirección.' })
	}
}

// Actualizar una dirección existente
exports.updateAddress = async (req, res) => {
	try {
		const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})
		if (!updatedAddress) {
			return res.status(404).json({ error: 'Dirección no encontrada.' })
		}
		res.status(200).json(updatedAddress)
	} catch (error) {
		res.status(400).json({ error: 'Error al actualizar la dirección.' })
	}
}

// Eliminar una dirección
exports.deleteAddress = async (req, res) => {
	try {
		const deletedAddress = await Address.findByIdAndDelete(req.params.id)
		if (!deletedAddress) {
			return res.status(404).json({ error: 'Dirección no encontrada.' })
		}
		res.status(200).json({ message: 'Dirección eliminada exitosamente.' })
	} catch (error) {
		res.status(500).json({ error: 'Error al eliminar la dirección.' })
	}
}
