const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Notification message too long']
  }
});

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: { 
      type: String,
      required: function() { return !this.googleId; },
      minlength: [8, 'Password must be at least 8 characters']
    },
    googleId: { type: String }, // For Google OAuth users
    bio: { type: String },
    address: { type: String, trim: true },
    phone: { 
      type: String,
      match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
    },
    birthdate: { type: Date },
    lastLogin: { type: Date, default: null },
    role: { type: String, enum: ['User', 'Vendor', 'Admin'], default: 'User' },

    // // user's properties
    // wishlist: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    pendingStatus: { type: String, enum: ['pending', 'not_pending'], default: 'not_pending' },
    notifications: [ notificationSchema ],
    // bookings: [{ type: Schema.Types.ObjectId, ref: 'Bookings' }],

    // // vendor's properties
    // listings: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    // earnings: { type: Number, default: 0 },

    // // admin's properties
    approvedVendors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // approvedListings: [{ type: Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// mongoose capitalize the collection name and add an 's' to the end of the model name
// so the collection name for User will be 'users',  another example is Property will be 'properties'
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
};