const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
mongoose.set('strictQuery', true);

const notificationSchema = new Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Notification message too long']
  },
  read: { 
    type: Boolean, 
    default: false 
  }
});

const userSchema = new Schema({
  username: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true, 
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
  },
  
  password: { 
    type: String,
    required: function() { return !this.googleId; }, 
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, 
  },

  googleId: { type: String, trim: true }, // ✅ Trim to avoid empty string issues
  bio: { type: String, trim: true, maxlength: 500 },
  address: { type: String, trim: true },
  phone: { 
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number']
  },
  birthdate: { type: Date },
  lastLogin: { type: Date, default: null },
  role: { 
    type: String, 
    enum: ['user', 'vendor', 'admin'], 
    default: 'user',
    lowercase: true 
  },

  pendingStatus: { type: String, enum: ['pending', 'not_pending'], default: 'not_pending' },
  notifications: {
    type: [notificationSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 50']
  },
  approvedVendors: [{ type: Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });


userSchema.pre('save', async function(next) {
  if (this.role) {
    this.role = this.role.toLowerCase();
  }

  if (this.googleId) {
    this.password = undefined; // Ensure no empty password is stored
  } else if (this.isModified('password') && this.password) { 
    if (!this.password.startsWith('$2b$')) { // Avoid rehashing
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  next();
});

// ✅ Helper function to limit notifications
function arrayLimit(val) {
  return val.length <= 50;
}

// mongoose capitalize the collection name and add an 's' to the end of the model name
// so the collection name for User will be 'users',  another example is Property will be 'properties'
const User = mongoose.model('User', userSchema);

module.exports = { User };
