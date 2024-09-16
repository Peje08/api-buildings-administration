const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['COMPROBANTE', 'RESUMEN'],
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  relation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
