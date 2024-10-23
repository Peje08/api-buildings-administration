const express = require('express')
const router = express.Router()
const documentController = require('../controllers/document.controller')

// Get allDocuments
router.get('/', documentController.getAllDocuments)

// Create a new document and upload the file to the hosting
router.post('/createDocument', documentController.createDocument)

// Get a document by ID
router.get('/:id', documentController.getDocumentById)

// Update a document by ID
router.put('/:id', documentController.updateDocument)

// Delete a document by ID
router.delete('/:id', documentController.deleteDocument)

// Get all documents from a functional Unit by ID
router.get('/getFromFU/:id', documentController.getDocumentsFromFU)

// Get all documents from a building Unit by ID
router.get('/getFromBuilding/:id', documentController.getDocumentsFromBuilding)

module.exports = router
