const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  requesterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // References the User model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],  // Track request status
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const VendorRequest = mongoose.model('Vendor_Request', requestSchema);
module.exports = { VendorRequest };
