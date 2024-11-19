const { uploadToCloudinary, deleteFromCloudinary } = require('./cloudinary.controller')

exports.uploadFileToHosting = async (file, type) => {
	try {
		const result = await uploadToCloudinary(file, type)
		console.log('File uploaded:', result)
		return result
	} catch (error) {
		console.error('Error uploading file:', error)
		throw new Error('Failed to upload file to hosting')
	}
}

exports.deleteFileFromHosting = (document) => {
	try {
		const result = deleteFromCloudinary(document)
		console.log('File deleted')
		return result
	} catch (error) {
		console.error('Error deleting file:', error)
		throw new Error('Failed to delete file from hosting')
	}
}
