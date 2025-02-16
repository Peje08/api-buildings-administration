/* eslint-disable camelcase */
const Document = require('../models/Document')
const upload = require('../services/multer')
const { deleteFileFromHosting, uploadFileToHosting } = require('./fileHosting.controller')
const logger = require('../utils/logger')

exports.uploadMiddleware = upload.single('file')

// Create a new document and upload the file to the hosting
exports.createDocument = async (req, res) => {
	const { ownerId, functionalUnitId, buildingId, type, date } = req.body

	if (!functionalUnitId && !buildingId) {
		logger.warn('Intento de creación fallido: No se proporcionó functionalUnitId ni buildingId.')
		return res.status(400).json({
			message: 'Debe proporcionar functionalUnitId o buildingId.'
		})
	}

	try {
		logger.info('Subiendo documento al hosting.')
		const uploadedDocument = await uploadFileToHosting(req.file.path, type)
		const { url, public_id } = uploadedDocument

		const newDocument = new Document({
			ownerId,
			functionalUnitId: functionalUnitId || null,
			buildingId: buildingId || null,
			type,
			documentUrl: url,
			documentPublicId: public_id,
			date
		})

		// Guardar en la base de datos
		await newDocument.save()

		logger.info(`Documento creado con éxito. ID: ${newDocument._id}`)
		res.status(201).json({ message: 'Documento creado con éxito.', id: newDocument._id })
	} catch (error) {
		logger.error(`Error al crear el documento: ${error.message}`)
		res.status(500).json({ message: 'Error al subir el archivo. ' + error.message })
	}
}

// Get all documents
exports.getAllDocuments = async (req, res) => {
	try {
		logger.info('Solicitud recibida para obtener todos los documentos.')

		const documents = await Document.find()

		logger.info(`Se recuperaron ${documents.length} documentos.`)
		res.status(200).json(documents)
	} catch (error) {
		logger.error(`Error al recuperar los documentos: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar los documentos.', error })
	}
}

// Get a document by ID
exports.getDocumentById = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para obtener el documento con ID ${req.params.id}.`)

		const documentId = req.params.id
		const currentDocument = await Document.findById(documentId)

		if (!currentDocument) {
			logger.warn(
				`Intento de obtener documento fallido: Documento con ID ${documentId} no encontrado.`
			)
			return res.status(404).json({ message: 'El documento no fue encontrado' })
		}

		logger.info(`Documento con ID ${documentId} recuperado correctamente.`)
		return res.status(200).json(currentDocument)
	} catch (error) {
		logger.error(`Error al recuperar el documento con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al recuperar el documento.', error })
	}
}

// Update a document by ID
exports.updateDocument = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para actualizar el documento con ID ${req.params.id}.`)

		const documentId = req.params.id
		const { type, date, file } = req.body

		const currentDocument = await Document.findById(documentId)
		if (!currentDocument) {
			logger.warn(`Intento de actualización fallido: Documento con ID ${documentId} no encontrado.`)
			return res.status(404).json({ message: 'El documento no fue encontrado' })
		}

		logger.info(
			`Actualizando documento con ID ${documentId}. Datos recibidos: ${JSON.stringify(req.body)}`
		)

		const oldId = currentDocument.documentPublicId

		currentDocument.type = type
		currentDocument.date = date

		const uploadedDocument = await uploadFileToHosting(file)
		currentDocument.documentUrl = uploadedDocument.url
		currentDocument.documentPublicId = uploadedDocument.public_id

		await deleteFileFromHosting(oldId)

		await currentDocument.save()

		logger.info(`Documento con ID ${documentId} actualizado con éxito.`)
		return res.status(200).json(currentDocument)
	} catch (error) {
		logger.error(`Error al actualizar el documento con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al actualizar el archivo. ' + error.message })
	}
}

// Delete a document by ID
exports.deleteDocument = async (req, res) => {
	try {
		logger.info(`Solicitud recibida para eliminar el documento con ID ${req.params.id}.`)

		const currentDocument = await Document.findById(req.params.id)
		if (!currentDocument) {
			logger.warn(
				`Intento de eliminación fallido: Documento con ID ${req.params.id} no encontrado.`
			)
			return res.status(404).json({ message: 'El documento no fue encontrado' })
		}

		await deleteFileFromHosting(currentDocument.documentPublicId)
		await currentDocument.deleteOne()

		logger.info(`Documento con ID ${req.params.id} eliminado correctamente.`)
		res.status(200).json({ message: 'El documento fue eliminado con éxito' })
	} catch (error) {
		logger.error(`Error al eliminar el documento con ID ${req.params.id}: ${error.message}`)
		res.status(500).json({ message: 'Error al eliminar el archivo. ' + error.message })
	}
}

// Helper function to get documents by query key (functionalUnitId, buildingId, ownerId)
const getDocumentsByQuery = async (res, id, type, key) => {
	try {
		logger.info(
			`Solicitud recibida para obtener documentos por ${key}: ${id}, tipo: ${type || 'todos'}.`
		)

		const query = type ? { [key]: id, type } : { [key]: id }
		const documents = await Document.find(query)

		if (documents.length === 0) {
			logger.info(`No se encontraron documentos con ${key}: ${id}.`)
			return res.status(200).json({ message: 'No se encontraron documentos' })
		}

		logger.info(`Se encontraron ${documents.length} documentos con ${key}: ${id}.`)
		return res.status(200).json(documents)
	} catch (error) {
		logger.error(`Error al obtener documentos con ${key}: ${id}: ${error.message}`)
		res.status(500).json({ message: 'Error al obtener documentos.', error })
	}
}

// Get all documents from a functional Unit by ID
exports.getDocumentsFromFU = (req, res) => {
	const functionalUnitId = req.params.id
	const { type } = req.body
	getDocumentsByQuery(res, functionalUnitId, type, 'functionalUnitId')
}

// Get all documents from a building Unit by ID
exports.getDocumentsFromBuilding = (req, res) => {
	const buildingId = req.params.id
	const { type } = req.body
	getDocumentsByQuery(res, buildingId, type, 'buildingId')
}

// Get all documents from a user by ID
exports.getDocumentsFromUser = (req, res) => {
	const ownerId = req.params.id
	const { type } = req.body
	getDocumentsByQuery(res, ownerId, type, 'ownerId')
}
