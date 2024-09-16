const mongoose = require('mongoose')
require('dotenv').config()

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db'

console.log({ uri })

mongoose
	.connect(uri)
	.then(() => {
		console.log('Conexión a MongoDB establecida con éxito')
	})
	.catch((err) => {
		console.error('Error al conectar a MongoDB', err)
	})

module.exports = mongoose
