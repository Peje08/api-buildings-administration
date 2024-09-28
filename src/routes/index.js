const express = require('express')

const appRouter = express.Router()

const administrationRoutes = require('./administration.routes')
const planRoutes = require('./plan.routes')
const userRoutes = require('./user.routes')
const authMiddleware = require('../middlewares/auth.middleware')

appRouter.use('/administrations', authMiddleware, administrationRoutes)
appRouter.use('/plans', authMiddleware, planRoutes)
appRouter.use('/user', userRoutes)

module.exports = appRouter
