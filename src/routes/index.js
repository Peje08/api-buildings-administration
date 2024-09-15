const express = require('express')
const indexController = require('../controllers')

const appRouter = express.Router()

appRouter.get('/', indexController.index)
appRouter.get('/posts', indexController.controllerFuncSelectPosts)
appRouter.get('/users', indexController.controllerFuncSelectUsers)
appRouter.post('/users', indexController.controllerFuncExecute)

module.exports = appRouter
