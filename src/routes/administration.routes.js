const express = require('express')
const router = express.Router()
const administrationController = require('../controllers/administration.controller')

// Create an administration
router.post('/', administrationController.createAdministration)

// Obtain all administrations
router.get('/', administrationController.getAllAdministrations)

// Obtain an administration by id
router.get('/:id', administrationController.getAdministrationById)

// Update an administration
router.put('/:id', administrationController.updateAdministration)

// Eliminar una administración
router.delete('/:id', administrationController.deleteAdministration)

module.exports = router
