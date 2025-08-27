import mongoose from 'mongoose'

const usageStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toolId: {
    type: String,
    required: true
  },
  toolName: String,
  fileCount: {
    type: Number,
    default: 0
  },
  totalFileSize: {
    type: Number,
    default: 0 // in bytes
  },
  processingTime: {
    type: Number,
    default: 0 // in milliseconds
  },
  successCount: {
    type: Number,
    default: 0
  },
  errorCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  month: {
    type: String,
    required: true // Format: "2024-01"
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

usageStatsSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Compound index for efficient queries
usageStatsSchema.index({ userId: 1, toolId: 1, month: 1 })

export default mongoose.models.UsageStats || mongoose.model('UsageStats', usageStatsSchema)

