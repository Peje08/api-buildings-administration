const express = require('express')
const router = express.Router()
const towerController = require('../controllers/tower.controller')

// Create a new tower
router.post('/', towerController.createTower)

// Get all towers
router.get('/', towerController.getAllTowers)

// Get a tower by ID
router.get('/:id', towerController.getTowerById)

// Update a tower by ID
router.put('/:id', towerController.updateTower)

// Delete a tower by ID
router.delete('/:id', towerController.deleteTower)

module.exports = router
