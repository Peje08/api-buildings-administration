const mongoose = require('mongoose')

const TowerSchema = new mongoose.Schema({
	buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
	friendlyId: {
		type: String,
		required: true
	},
	floorsNumber: {
		type: Number,
		required: true,
		default: 1
	},
	premisesAmount: {
		type: Number,
		default: 0
	},
	functionalUnitsData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FunctionalUnit' }]
})

module.exports = mongoose.model('Tower', TowerSchema)
