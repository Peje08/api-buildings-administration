/* eslint-disable camelcase */
const Document = require("../models/Document");
const { deleteFileFromHosting, uploadFileToHosting } = require('./fileHostingController')

// Create a new document and upload the file to the hosting
exports.createDocument = async (req, res) => {
    const { ownerId, functionalUnitId, buildingId, type, date, docUrl } = req.body

    try {
        const uploadedDocument = await uploadFileToHosting(docUrl)
        const { url, public_id } = uploadedDocument
        const newDocument = new Document({
            ownerId,
            functionalUnitId,
            buildingId,
            type,
            documentUrl: url,
            documentPublicId: public_id,
            date
        })

        await newDocument.save()
        res.status(201).json({ message: 'Document created. ', id: newDocument._id })
    } catch (error) {
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
    const { type, date, file } = req.body

    const currentDocument = await Document.findById(documentId)
    if (!currentDocument) {
        return res.status(404).json({ message: 'Document not found' })
    }

    try {
        const oldId = currentDocument.documentPublicId

        currentDocument.type = type
        currentDocument.date = date

        const uploadedDocument = await uploadFileToHosting(file);
        currentDocument.documentUrl = uploadedDocument.url
        currentDocument.documentPublicId = uploadedDocument.public_id

        await deleteFileFromHosting(oldId)

        await currentDocument.save()

        return res.status(200).json(currentDocument)
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating file.' + error.message })
    }
}


// Delete a document by ID
exports.deleteDocument = async (req, res) => {

    const currentDocument = await Document.findById(req.params.id)
    if (!currentDocument) {
        return res.status(404).json({ message: 'Document not found' })
    }

    try {
        await deleteFileFromHosting(currentDocument.documentPublicId)
        await currentDocument.deleteOne()
        res.status(200).json({ message: 'Document unit deleted successfully' })
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting file' + error.message })
    }
}

// Helper function to get documents by query key (functionalUnitId, buildingId, ownerId)
const getDocumentsByQuery = async (res, id, type, key) => {
    const query = type ? { [key]: id, type } : { [key]: id };

    const documents = await Document.find(query);

    if (documents.length === 0) {
        return res.status(200).json({ message: "No documents found" });
    } else {
        return res.status(200).json(documents);
    }
};

// Get all documents from a functional Unit by ID
exports.getDocumentsFromFU = async (req, res) => {
    const functionalUnitId = req.params.id
    const { type } = req.body
    getDocumentsByQuery(res, functionalUnitId, type, "functionalUnitId");
}

// Get all documents from a building Unit by ID
exports.getDocumentsFromBuilding = async (req, res) => {
    const buildingId = req.params.id
    const { type } = req.body
    getDocumentsByQuery(res, buildingId, type, "buildingId");
}

// Get all documents from a user by ID
exports.getDocumentsFromUser = async (req, res) => {
    const ownerId = req.params.id
    const { type } = req.body
    getDocumentsByQuery(res, ownerId, type, "ownerId");
}