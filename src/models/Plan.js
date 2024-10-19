const mongoose = require('mongoose')

const PlanSchema = new mongoose.Schema({
	friendlyId: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String
	},
	price: {
		type: Number
	},
	functionUnitsAmount: {
		type: Number
	}
})

module.exports = mongoose.model('Plan', PlanSchema)
