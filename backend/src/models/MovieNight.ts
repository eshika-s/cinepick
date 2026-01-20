import mongoose from 'mongoose'

const movieNightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guests: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending'
    }
  }],
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  theme: {
    type: String,
    enum: ['Classic Movie Night', 'Horror Marathon', 'Comedy Fest', 'Action Adventure', 'Romantic Evening', 'Sci-Fi Journey', 'Documentary Night', 'Family Fun']
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

movieNightSchema.index({ host: 1 })
movieNightSchema.index({ date: 1 })
movieNightSchema.index({ status: 1 })

export const MovieNight = mongoose.model('MovieNight', movieNightSchema)
