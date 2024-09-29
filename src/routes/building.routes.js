const express = require('express')
const router = express.Router()
const buildingController = require('../controllers/building.controller')

// Create a new building with towers and functional units
router.post('/create-full', buildingController.createFullBuilding)

// Create a new building
router.post('/', buildingController.createBuilding)

// Get all buildings
router.get('/', buildingController.getAllBuildings)

// Get a building by ID
router.get('/:id', buildingController.getBuildingById)

// Update a building by ID
router.put('/:id', buildingController.updateBuilding)

// Delete a building by ID
router.delete('/:id', buildingController.deleteBuilding)

module.exports = router
