const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const notificationSchema = new mongoose.Schema({
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String }, // For Google OAuth users
    bio: { type: String },
    address: { type: String },
    phone: { type: String },
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


// mongoose capitalize the collection name and add an 's' to the end of the model name
// so the collection name for User will be 'users',  another example is Property will be 'properties'
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
};