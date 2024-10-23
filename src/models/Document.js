const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema(
    {
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        functionalUnitId: { type: mongoose.Schema.Types.ObjectId, ref: 'FunctionalUnit' },
        buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
        type: {
            type: String,
            enum: ['SUMMARY', 'CLAIM', 'REQUEST', 'VOUCHER'],
            required: true
        },
        documentUrl: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Document', DocumentSchema)