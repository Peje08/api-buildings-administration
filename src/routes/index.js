const express = require('express')

const appRouter = express.Router()

const administrationRoutes = require('./administration.routes')
const buildingRoutes = require('./building.routes')
const towerRoutes = require('./tower.routes')
const functionalUnitRoutes = require('./functionalUnit.routes')
const planRoutes = require('./plan.routes')
const userRoutes = require('./user.routes')
const documentRoutes = require('./document.routes')

const authMiddleware = require('../middlewares/auth.middleware')

appRouter.use('/administrations', authMiddleware, administrationRoutes)
appRouter.use('/buildings', authMiddleware, buildingRoutes)
appRouter.use('/towers', authMiddleware, towerRoutes)
appRouter.use('/functional-units', authMiddleware, functionalUnitRoutes)
appRouter.use('/plans', authMiddleware, planRoutes)
appRouter.use('/documents', documentRoutes)
appRouter.use('/user', userRoutes)

module.exports = appRouter
