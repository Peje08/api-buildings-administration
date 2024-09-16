const express = require('express')
const addressController = require('../controllers/address.controller')
const userController = require('../controllers/user.controller')
const documentController = require('../controllers/document.controller')

const appRouter = express.Router()

// Rutas para la API raíz
appRouter.get('/', (req, res) => {
	res.send('API funcionando correctamente')
})

// Rutas para Users
appRouter.get('/users', userController.getAllUsers)
appRouter.post('/users', userController.createUser)
appRouter.get('/users/:id', userController.getUserById)
appRouter.put('/users/:id', userController.updateUser)
appRouter.delete('/users/:id', userController.deleteUser)

// Rutas para Addresses
appRouter.get('/addresses', addressController.getAllAddresses)
appRouter.post('/addresses', addressController.createAddress)
appRouter.get('/addresses/:id', addressController.getAddressById)
appRouter.put('/addresses/:id', addressController.updateAddress)
appRouter.delete('/addresses/:id', addressController.deleteAddress)

// Rutas para Documents
appRouter.get('/documents', documentController.getAllDocuments)
appRouter.post('/documents', documentController.createDocument)
appRouter.get('/documents/:id', documentController.getDocumentById)
appRouter.put('/documents/:id', documentController.updateDocument)
appRouter.delete('/documents/:id', documentController.deleteDocument)

module.exports = appRouter
