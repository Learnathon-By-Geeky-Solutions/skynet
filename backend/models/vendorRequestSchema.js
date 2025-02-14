const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  userID: {
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

const VendorRequest = mongoose.model('Vendor_Request', messageSchema);
module.exports = { VendorRequest };
