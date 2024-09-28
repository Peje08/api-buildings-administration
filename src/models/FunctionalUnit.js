const mongoose = require('mongoose')

const FunctionalUnitSchema = new mongoose.Schema(
    {
        tenantUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        friendlyId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["APARTMENT", "PREMISE"]
        },
        occupied: {
            type: Boolean,
            default: false
        }
    },
)

module.exports = mongoose.model('FunctionalUnit', FunctionalUnitSchema)