const cloudinary = require('cloudinary').v2
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
		console.error('Missing file path')
		throw new Error('File path is required')
	}
	const resourceType = getResourceType(filePath)
	const folder = folderMapping[type] || 'Cabildo/otros'

	const timestamp = Date.now()
	const publicId = `${type.toLowerCase()}-${timestamp}`

	const result = await cloudinary.uploader.upload(filePath, {
		...resourceType,
		folder,
		public_id: publicId
	})
	await unlinkFile(filePath)
	return result
}

exports.deleteFromCloudinary = async (fileId) => {
	if (!fileId) {
		console.error('missing file id')
		return
	}
	const resourceType = getResourceType(fileId)
	const result = await cloudinary.uploader.destroy(fileId, resourceType)
	return result
}
