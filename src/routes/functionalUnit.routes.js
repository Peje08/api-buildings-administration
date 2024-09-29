const express = require('express')
const router = express.Router()
const functionalUnitController = require('../controllers/functionalUnit.controller')

// Create a new FunctionalUnit
router.post('/', functionalUnitController.createFunctionalUnit)

// Get all FunctionalUnits
router.get('/', functionalUnitController.getAllFunctionalUnits)

// Get FunctionalUnit by ID
router.get('/:id', functionalUnitController.getFunctionalUnitById)

// Update FunctionalUnit by ID
router.put('/:id', functionalUnitController.updateFunctionalUnit)

// Delete FunctionalUnit by ID
router.delete('/:id', functionalUnitController.deleteFunctionalUnit)

module.exports = router
