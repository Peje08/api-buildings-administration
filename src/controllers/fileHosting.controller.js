const { uploadToCloudinary, deleteFromCloudinary } = require('./cloudinary.controller')
const logger = require('../utils/logger')

// Upload file to hosting
exports.uploadFileToHosting = async (file, type) => {
	try {
		logger.info(`Solicitud recibida para subir un archivo de tipo ${type}.`)

		const result = await uploadToCloudinary(file, type)

		logger.info(`Archivo subido con éxito. URL: ${result.url}`)
		return result
	} catch (error) {
		logger.error(`Error al subir el archivo: ${error.message}`)
		throw new Error('Error al subir el archivo al hosting')
	}
}

// Delete file from hosting
exports.deleteFileFromHosting = (document) => {
	try {
		logger.info(`Solicitud recibida para eliminar un archivo con URL: ${document}.`)

		const result = deleteFromCloudinary(document)

		logger.info('Archivo eliminado con éxito.')
		return result
	} catch (error) {
		logger.error(`Error al eliminar el archivo: ${error.message}`)
		throw new Error('Error al eliminar el archivo del hosting')
	}
}
