
const mongoose = require('mongoose')

const FloorSchema = new mongoose.Schema(
    {
        towerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tower'
        },
        number: {
            type: Number,
            required: true,
            default: 1
        },
        type: {
            type: String,
            enum: ["APARTMENTS", "PREMISES"]
        },
        functionaleUnitsData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FunctionalUnit' }]
    });

module.exports = mongoose.model('Floor', FloorSchema)

