const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
{
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  rewardPoints: {
    type: Number,
    default: 0,
  },

  totalClaims: {
    type: Number,
    default: 0,
  },

  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },

  referredBy: {
    type: String,
    default: null,
  },
},
{ timestamps: true }
);

/* Generate referral code */
userSchema.pre('save', async function () {
  if (this.isNew && !this.referralCode) {
    this.referralCode =
      this.name.replace(/\s+/g, '').toUpperCase().slice(0, 4) +
      Math.floor(1000 + Math.random() * 9000);
  }

  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports =
  mongoose.models.User || mongoose.model('User', userSchema);