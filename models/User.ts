import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
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
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phone: String,
  company: String,
  jobTitle: String,
  website: String,
  bio: String,
  location: String,
  timezone: String,
  language: {
    type: String,
    default: 'en'
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  emailVerified: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.User || mongoose.model('User', userSchema)

