const cloudinary = require('cloudinary').v2
require('dotenv').config()

const getResourceType = (filePath) => {
	const extension = filePath.substr(filePath.length - 4)
	const resourceType = {}
	if (extension === '.pdf') {
		resourceType.resource_type = 'raw'
	}
	return resourceType
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
		console.error('missing file path')
		return
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
