const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  
  username: {
    type: String,
    required: true,
    trim: true
  },
  
  // Discord ya no usa discriminator, lo dejamos opcional
  discriminator: String,
  
  avatar: String,
  
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  
  role: {
    type: String,
    enum: ['pending', 'whitelist', 'admin'],
    default: 'pending'
  },
  
  whitelistStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: Date,
    success: Boolean
  }],
  
  failedAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);