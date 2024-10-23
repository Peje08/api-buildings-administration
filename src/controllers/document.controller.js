const Document = require("../models/Document");
const { deleteFileFromHosting, uploadFileToHosting } =  require('./fileHostingController')

// Create a new document and upload the file to the hosting
exports.createDocument = async (req, res) => {
    const { ownerId, functionalUnitId, buildingId, type, date, file } = req.body

    try {
        var documentUrl = uploadFileToHosting(file)
    } catch (error) {
        console.log({ error })
        res.status(500).json({ message: 'Error uploading file.' + error.message })
    }

    document = new Document({
        ownerId,
        functionalUnitId,
        buildingId,
        type,
        documentUrl,
        date,
    })
    await document.save()
    res.status(201).json({ message: 'Document created.' })
}

// Create a new document and upload the file to the hosting
exports.getAllDocuments = async (req, res) => {

    let documents = await Document.find();
    res.status(200).json(documents)
}

// Get a document by ID
exports.getDocumentById = async (req, res) => {
    const documentId = req.params.id

    let document = await Document.findById(documentId)
    if (!document) {
        return res.status(404).json({ message: 'Document unit not found' })
    }
    return res.status(200).json(document)
}

// Update a document by ID
exports.updateDocument = async (req, res) => {
    const documentId = req.params.id

    let document = await Document.find(documentId)
    if (!document) {
        return res.status(404).json({ message: 'Document unit not found' })
    }

    let newFileUrl = uploadFileToHosting(file);
    deleteFileFromHosting(file)
    document.documentUrl = newFileUrl
    await document.save()

    return res.status(200).json(document)
}

// Delete a document by ID
exports.deleteDocument = async (req, res) => {
    const document = await document.findById(req.params.id)
    if (!document) {
        return res.status(404).json({ message: 'Document not found' })
    }
    deleteFileFromHosting(file)
    await document.deleteOne()
    res.status(200).json({ message: 'Document unit deleted successfully' })

}

// Get all documents from a functional Unit by ID
exports.getDocumentsFromFU = async (req, res) => {
    const functionalUnitId = req.params.id
    const documents = await document.find({ functionalUnitId: functionalUnitId })
    res.status(200).json(documents)
}

// Get all documents from a building Unit by ID
exports.getDocumentsFromBuilding = async (req, res) => {
    const buildingId = req.params.id
    const documents = await document.find({ buildingId: buildingId })
    res.status(200).json(documents)
}