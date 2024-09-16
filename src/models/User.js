const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  principalId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  addressId: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
