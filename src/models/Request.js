const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        friendlyId: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            enum: ['CLAIM', 'REQUEST', 'DEBTFREE'],
            required: true
        },
        text: {
            type: String,
            required: true
        },
        documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    },
    { timestamps: true }
)

module.exports = mongoose.model('Request', RequestSchema)