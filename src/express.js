const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('src/swagger.yaml');
const routes = require('./routes');

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/base-path', routes);
app.use('/:var', ({ res }) => res.status(404).json({ code: 404, message: 'Not Found' }));
app.use('/', ({ res }) => res.status(200).json({ code: 200, message: 'Welcome to API Template Nodejs' }));
module.exports = app;
