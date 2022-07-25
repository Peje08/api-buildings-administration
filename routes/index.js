const express = require("express");
const indexController = require("../controllers/");
// const apiController = require("../controllers/apiController");

const appRouter = express.Router();

appRouter.get("", indexController.index);
// appRouter.get(
//     "/apiController",
//     apiController.method
// );

module.exports = appRouter;
