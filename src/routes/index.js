const express = require('express');
const indexController = require('../controllers/');

const appRouter = express.Router();

appRouter.get('/', indexController.index);
appRouter.get('/endpoint/:param1/:param2', indexController.controllerFuncSelect);
appRouter.post('/endpoint', indexController.controllerFuncExecute);
module.exports = appRouter;
