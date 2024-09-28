const mongoose = require('mongoose')
require('dotenv').config()

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildings_administration'

mongoose
	.connect(uri)
	.then(() => {
		console.log('Connection to MongoDB successful!')
	})
	.catch((err) => {
		console.error('Error connecting with MongoDB', err)
	})

module.exports = mongoose
