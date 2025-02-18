const cloudinary = require('cloudinary').v2
const logger = require('../utils/logger')
require('dotenv').config()

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const getResourceType = (filePath) => {
	const extension = filePath.split('.').pop().toLowerCase()

	if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
		return { resource_type: 'image' }
	} else if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extension)) {
		return { resource_type: 'video' }
	} else if (['pdf'].includes(extension)) {
		return { resource_type: 'raw' }
	} else {
		return { resource_type: 'raw' }
	}
}

const folderMapping = {
	SUMMARY: 'Cabildo/resumenes',
	CLAIM: 'Cabildo/reclamos',
	REQUEST: 'Cabildo/solicitudes',
	VOUCHER: 'Cabildo/comprobantes'
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.uploadToCloudinary = async (filePath, type) => {
	if (!filePath) {
		logger.warn('Falta la ruta del archivo en la subida a Cloudinary.')
		throw new Error('Se requiere la ruta del archivo.')
	}

	logger.info(`Subiendo archivo a Cloudinary. Tipo: ${type}, Ruta: ${filePath}`)

	const resourceType = getResourceType(filePath)
	const folder = folderMapping[type] || 'Cabildo/otros'

	const timestamp = Date.now()
	const publicId = `${type.toLowerCase()}-${timestamp}`

	try {
		const result = await cloudinary.uploader.upload(filePath, {
			...resourceType,
			folder,
			public_id: publicId
		})

		await unlinkFile(filePath)

		logger.info(`Archivo subido con éxito a Cloudinary. Public ID: ${result.public_id}`)
		return result
	} catch (error) {
		logger.error(`Error al subir el archivo a Cloudinary: ${error.message}`)
		throw new Error('Error al subir el archivo a Cloudinary.')
	}
}

exports.deleteFromCloudinary = async (fileId) => {
	if (!fileId) {
		logger.warn('Falta el ID del archivo en la eliminación de Cloudinary.')
		return
	}

	logger.info(`Eliminando archivo de Cloudinary. File ID: ${fileId}`)

	const resourceType = getResourceType(fileId)

	try {
		const result = await cloudinary.uploader.destroy(fileId, resourceType)

		logger.info(`Archivo con ID ${fileId} eliminado de Cloudinary.`)
		return result
	} catch (error) {
		logger.error(`Error al eliminar el archivo de Cloudinary: ${error.message}`)
		throw new Error('Error al eliminar el archivo de Cloudinary.')
	}
}
