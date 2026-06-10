const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema representing Admins, Security guards, Hosts, and Visitors
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Security', 'Host', 'Visitor'],
    default: 'Visitor'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null // Can be null for System Admin
  }
}, {
  timestamps: true
});

// Password hashing hook runs before saving user to database
userSchema.pre('save', async function (next) {
  // Only hash password if it is modified or new
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Helper method to compare entered password with database hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
