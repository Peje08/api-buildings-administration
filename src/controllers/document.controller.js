const Document = require("../models/Document");
const { deleteFileFromHosting, uploadFileToHosting } = require('./fileHostingController')

// Create a new document and upload the file to the hosting
exports.createDocument = async (req, res) => {
    const { ownerId, functionalUnitId, buildingId, type, date, file } = req.body
    let documentId = ""
    try {
        const documentUrl = uploadFileToHosting(file)
        const newDocument = new Document({
            ownerId,
            functionalUnitId,
            buildingId,
            type,
            documentUrl,
            date
        })
        await newDocument.save()
        documentId = newDocument._id
        res.status(201).json({ message: 'Document created. ', id: documentId })
    } catch (error) {
        console.log({ error })
        res.status(500).json({ message: 'Error uploading file.' + error.message })
    }
}

// Create a new document and upload the file to the hosting
exports.getAllDocuments = async (req, res) => {
    const documents = await Document.find();
    res.status(200).json(documents)
}

// Get a document by ID
exports.getDocumentById = async (req, res) => {
    const documentId = req.params.id
    const currentDocument = await Document.findById(documentId)
    if (!currentDocument) {
        return res.status(404).json({ message: 'Document unit not found' })
    }
    return res.status(200).json(currentDocument)
}

// Update a document by ID
exports.updateDocument = async (req, res) => {
    const documentId = req.params.id
    const {  type, date, file } = req.body
    try {

        const currentDocument = await Document.findById(documentId)
        if (!currentDocument) {
            return res.status(404).json({ message: 'Document not found' })
        }
        currentDocument.type = type
        currentDocument.date = date
        const newFileUrl = uploadFileToHosting(file);
        deleteFileFromHosting(file)
        currentDocument.documentUrl = newFileUrl
        await currentDocument.save()

        return res.status(200).json(currentDocument)
    }
    catch (error) {
        console.log({ error })
        res.status(500).json({ message: 'Error updating file.' + error.message })
    }
}


// Delete a document by ID
exports.deleteDocument = async (req, res) => {
    const currentDocument = await Document.findById(req.params.id)
    if (!currentDocument) {
        return res.status(404).json({ message: 'Document not found' })
    }
    deleteFileFromHosting(currentDocument)
    await currentDocument.deleteOne()
    res.status(200).json({ message: 'Document unit deleted successfully' })

}

// Get all documents from a functional Unit by ID
exports.getDocumentsFromFU = async (req, res) => {
    const functionalUnitId = req.params.id
    const documents = await Document.find({ functionalUnitId })
    res.status(200).json(documents)
}

// Get all documents from a building Unit by ID
exports.getDocumentsFromBuilding = async (req, res) => {
    const buildingId = req.params.id
    const documents = await Document.find({ buildingId })
    res.status(200).json(documents)
}