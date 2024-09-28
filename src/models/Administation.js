const mongoose = require('mongoose')

const AdministrationSchema = new mongoose.Schema(
    {
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        friendlyId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }]
    },
)

module.exports = mongoose.model('Administration', AdministrationSchema)
