const mongoose = require('mongoose')

const PlanSchema = new mongoose.Schema({
	friendlyId: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	price: {
		type: Number
	},
	featuresFlags: {
		type: [String]
	},
	functionUnitsAmount: {
		type: Number
	}
})

module.exports = mongoose.model('Plans', PlanSchema)
