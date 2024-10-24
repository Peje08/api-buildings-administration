const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadToCloudinary = async (filePath) => {
    if (!filePath) {
        console.error("missing file path")
    }
    const extension = filePath.substr(filePath.length - 4);
    const resourceType = {}
    if (extension === ".pdf") {
        resourceType.resource_type = 'raw'
    }
    const result = await cloudinary.uploader.upload(filePath, resourceType);
    return result;
};

exports.deleteFromCloudinary = async (fileId) => {
    if (!fileId) {
        console.error("missing file id")
        return
    }
    const extension = fileId.substr(fileId.length - 4);
    const resourceType = {}
    if (extension === ".pdf") {
        resourceType.resource_type = 'raw'
    }
    const result = await cloudinary.uploader.destroy(fileId, resourceType);
    return result;
};