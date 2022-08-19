const express = require('express');
const indexController = require('../controllers/');

const appRouter = express.Router();

appRouter.get('/', indexController.index);

module.exports = appRouter;
