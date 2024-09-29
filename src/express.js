const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const routes = require('./routes')
const swaggerDocument = require('./swagger/swaggerConfig')

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api', routes)

// Root path handler
app.get('/', (req, res) => {
	res.send('Welcome to API Buildings Administration - CABILDO')
})

// Catch all for undefined routes (404 handler)
app.use((req, res, next) => {
	res.status(404).json({ error: 'Route not found' })
})

// General error handler for other server errors
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({ error: 'Server error' })
})

module.exports = app
