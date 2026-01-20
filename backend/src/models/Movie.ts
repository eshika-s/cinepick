import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  overview: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String
  },
  backdropUrl: {
    type: String
  },
  releaseDate: {
    type: Date
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  voteCount: {
    type: Number,
    default: 0
  },
  genres: [{
    type: String,
    enum: ['action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 'mystery', 'romance', 'sci-fi', 'thriller', 'documentary', 'family']
  }],
  moodTags: [{
    type: String,
    enum: ['happy', 'thriller', 'cozy', 'mindbending', 'romantic', 'epic']
  }],
  runtime: {
    type: Number
  },
  language: {
    type: String,
    default: 'en'
  },
  adult: {
    type: Boolean,
    default: false
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

movieSchema.index({ tmdbId: 1 })
movieSchema.index({ title: 'text', overview: 'text' })
movieSchema.index({ genres: 1 })
movieSchema.index({ moodTags: 1 })
movieSchema.index({ rating: -1 })
movieSchema.index({ popularity: -1 })

export const Movie = mongoose.model('Movie', movieSchema)
