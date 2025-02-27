const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  requesterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // References the User model
    required: true,
    index: true  // Add index for faster lookups
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, 'Message cannot be empty'],
    maxlength: [100, 'Message too long']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],  // Track request status
    default: 'pending',
    index: true  // Add index for status-based queries
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true  // Add index for time-based queries
  }
});

const VendorRequest = mongoose.model('VendorRequest', requestSchema);
module.exports = { VendorRequest };
