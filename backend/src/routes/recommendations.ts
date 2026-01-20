import express from 'express'
import { protect, AuthRequest } from '../middleware/auth'
import { User } from '../models/User'
import { Movie } from '../models/Movie'

const router = express.Router()

// Get mood-based recommendations
router.get('/mood/:mood', protect, async (req: AuthRequest, res) => {
  try {
    const { mood } = req.params
    const validMoods = ['happy', 'thriller', 'cozy', 'mindbending', 'romantic', 'epic']
    
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ message: 'Invalid mood' })
    }

    // Update user's mood preference
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.preferences) {
      user.preferences = {
        favoriteGenres: [],
        moodPreferences: [] as any,
        dislikedMovies: [],
        likedMovies: [],
        watchlist: [],
        ratingThreshold: 6.0
      }
    }

    const existingMoodPref = user.preferences?.moodPreferences?.find(p => p.mood === mood)
    
    if (existingMoodPref) {
      existingMoodPref.weight = Math.min(existingMoodPref.weight + 0.1, 5)
      existingMoodPref.lastSelected = new Date()
    } else {
      if (user.preferences) {
        user.preferences.moodPreferences.push({
          mood,
          weight: 1,
          lastSelected: new Date()
        })
      }
    }
    
    await user.save()

    // Get movies based on mood
    const moodGenreMap = {
      happy: ['comedy', 'adventure', 'family'],
      thriller: ['thriller', 'mystery', 'crime'],
      cozy: ['drama', 'romance', 'documentary'],
      mindbending: ['sci-fi', 'mystery', 'thriller'],
      romantic: ['romance', 'drama', 'comedy'],
      epic: ['action', 'adventure', 'fantasy']
    }

    const genres = moodGenreMap[mood as keyof typeof moodGenreMap]
    
    const movies = await Movie.find({
      $or: [
        { moodTags: mood },
        { genres: { $in: genres } }
      ],
      rating: { $gte: user.preferences?.ratingThreshold || 6.0 }
    })
    .sort({ rating: -1, popularity: -1 })
    .limit(20)

    res.json({
      mood,
      movies,
      userWeight: user.preferences?.moodPreferences?.find(p => p.mood === mood)?.weight || 1
    })
  } catch (error) {
    console.error('Mood recommendations error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get personalized recommendations based on user preferences
router.get('/personalized', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.preferences) {
      user.preferences = {
        favoriteGenres: [],
        moodPreferences: [] as any,
        dislikedMovies: [],
        likedMovies: [],
        watchlist: [],
        ratingThreshold: 6.0
      }
    }
    
    // Get user's preferred genres and moods
    const favoriteGenres = user.preferences?.favoriteGenres || []
    const moodPreferences = (user.preferences?.moodPreferences || [])
      .sort((a: any, b: any) => b.weight - a.weight)
      .slice(0, 3)
      .map((p: any) => p.mood)

    // Exclude disliked movies
    const excludedMovies = user.preferences?.dislikedMovies || []

    const query: any = {
      _id: { $nin: excludedMovies },
      rating: { $gte: user.preferences?.ratingThreshold || 6.0 }
    }

    if (favoriteGenres.length > 0) {
      query.$or = [
        { genres: { $in: favoriteGenres } },
        { moodTags: { $in: moodPreferences } }
      ]
    }

    const movies = await Movie.find(query)
      .sort({ rating: -1, popularity: -1 })
      .limit(20)

    res.json({ movies })
  } catch (error) {
    console.error('Personalized recommendations error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Like/dislike a movie
router.post('/movie/:movieId/like', protect, async (req: AuthRequest, res: any) => {
  try {
    const { movieId } = req.params
    const { liked } = req.body

    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.preferences) {
      user.preferences = {
        favoriteGenres: [],
        moodPreferences: [] as any,
        dislikedMovies: [],
        likedMovies: [],
        watchlist: [],
        ratingThreshold: 6.0
      }
    }

    if (liked) {
      // Add to liked movies, remove from disliked
      user.preferences!.likedMovies = [...new Set([...(user.preferences?.likedMovies || []), movieId])]
      user.preferences!.dislikedMovies = (user.preferences?.dislikedMovies || []).filter(id => id.toString() !== movieId)
    } else {
      // Add to disliked movies, remove from liked
      user.preferences!.dislikedMovies = [...new Set([...(user.preferences?.dislikedMovies || []), movieId])]
      user.preferences!.likedMovies = (user.preferences?.likedMovies || []).filter(id => id.toString() !== movieId)
    }

    await user.save()

    res.json({
      message: `Movie ${liked ? 'liked' : 'disliked'} successfully`,
      likedMovies: user.preferences?.likedMovies || [],
      dislikedMovies: user.preferences?.dislikedMovies || []
    })
  } catch (error) {
    console.error('Like/dislike error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add to watchlist
router.post('/movie/:movieId/watchlist', protect, async (req: AuthRequest, res: any) => {
  try {
    const { movieId } = req.params
    const { add } = req.body

    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.preferences) {
      user.preferences = {
        favoriteGenres: [],
        moodPreferences: [] as any,
        dislikedMovies: [],
        likedMovies: [],
        watchlist: [],
        ratingThreshold: 6.0
      }
    }

    if (add) {
      user.preferences!.watchlist = [...new Set([...(user.preferences?.watchlist || []), movieId])]
    } else {
      user.preferences!.watchlist = (user.preferences?.watchlist || []).filter(id => id.toString() !== movieId)
    }

    await user.save()

    res.json({
      message: `Movie ${add ? 'added to' : 'removed from'} watchlist`,
      watchlist: user.preferences?.watchlist || []
    })
  } catch (error) {
    console.error('Watchlist error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's mood preferences
router.get('/mood-preferences', protect, async (req: AuthRequest, res: any) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const moodPreferences = user.preferences?.moodPreferences || []
    
    res.json({
      moodPreferences: moodPreferences.sort((a, b) => b.weight - a.weight)
    })
  } catch (error) {
    console.error('Get mood preferences error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
