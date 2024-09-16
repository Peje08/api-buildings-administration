const express = require('express')
const cors = require('cors')
const YAML = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = YAML.load('src/swagger.yaml')
const routes = require('./routes')

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api', routes)

app.use((req, res, next) => {
	res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({ error: 'Error del servidor' })
})

app.use((req, res) => res.status(404).json({ code: 404, message: 'Not Found' }))

module.exports = app
