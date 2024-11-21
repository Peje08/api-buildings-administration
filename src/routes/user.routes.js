const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

// Get user by ID
router.get('/:id', userController.getUserById)

// Register
router.post('/register', userController.register)

// Login
router.post('/login', userController.login)

// Refresh access token
router.post('/refresh-token', userController.refreshToken)

// Forgot password
router.post('/forgot-password', userController.forgotPassword)

// Verify reset token (GET route)`
router.get('/reset-password/:token', userController.verifyResetToken)

// Reset password
router.post('/reset-password/:token', userController.resetPassword)

// Deactivate user
router.put('/deactivate/:userId', userController.deactivateUser)

// Reactivate user (optional)
router.put('/reactivate/:userId', userController.reactivateUser)

// Edit user
router.put('/edit/:userId', userController.editUser)

module.exports = router
