const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

// Register
router.post('/register', userController.register)

// Login
router.post('/login', userController.login)

// Refresh access token
router.post('/refresh-token', userController.refreshToken)

module.exports = router
