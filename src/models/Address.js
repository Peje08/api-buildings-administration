const mongoose = require('mongoose');

const TowerSchema = new mongoose.Schema({
  floor: {
    type: Number,
    required: true
  },
  groundFloor: {
    type: Boolean,
    default: false
  },
  units: {
    type: Number, 
    default: 0
  }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  inhabitantId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  },
  towers: {
    type: [TowerSchema],
    default: []
  },
  numberOfFloors: {
    type: Number,
    required: true
  },
  numberOfUnitsOnGroundFloor: {
    type: Number,
    required: true
  },
  numberOfUnits: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  plan: {
    type: String,
    required: true,
    trim: true
  },
  emails: {
    type: [String],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 2']
  },
  whatsApp: {
    type: [String],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 2']
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 2;
}

module.exports = mongoose.model('Address', AddressSchema);
