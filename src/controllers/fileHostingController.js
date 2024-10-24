const { uploadToCloudinary, deleteFromCloudinary } = require("./cloudinaryController");

exports.uploadFileToHosting = (file) => {
    try {
        const result = uploadToCloudinary(file)
        console.log('File uploaded:', result);
        return result
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

exports.deleteFileFromHosting = (document) => {
    try {
        const result = deleteFromCloudinary(document)
        console.log('File deleted');
        return result
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}