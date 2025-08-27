import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'business'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired', 'trial'],
    default: 'active'
  },
  stripeProductId: String,
  planName: String,
  planDescription: String,
  amount: Number,
  currency: {
    type: String,
    default: 'usd'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  trialEnd: Date,
  canceledAt: Date,
  maxFileSize: {
    type: Number,
    default: 10 // MB
  },
  maxFilesPerMonth: {
    type: Number,
    default: 100
  },
  maxTeamMembers: {
    type: Number,
    default: 1
  },
  maxApiCalls: {
    type: Number,
    default: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

subscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema)

