const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const YAML = require("yamljs");
// Swagger User Interface
const swaggerUi = require("swagger-ui-express");
// Swagger Docs
const swaggerDocument = YAML.load("./swagger_config/swagger.yaml");
const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/routeName", routes);

module.exports = app;
