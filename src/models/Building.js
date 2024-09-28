const mongoose = require('mongoose')

const BuildingSchema = new mongoose.Schema(
    {
        administrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Administration' },
        planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plans' },
        friendlyId: {
            type: String,
            required: true,
            unique: true
        },
        streetName: {
            type: String,
            required: true,
            unique: true
        },
        streetNumber: {
            type: String,
            required: true
        },
        towersData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tower' }]
    },
)

module.exports = mongoose.model('Building', BuildingSchema)
