import express from 'express'
import { protect, AuthRequest } from '../middleware/auth'
import prisma from '../config/database'

const router = express.Router()

// Mood to genre map
const moodGenreMap: Record<string, string[]> = {
  happy: ['comedy', 'adventure', 'family'],
  thriller: ['thriller', 'mystery', 'crime'],
  cozy: ['drama', 'romance', 'documentary'],
  mindbending: ['sci-fi', 'mystery', 'thriller'],
  romantic: ['romance', 'drama', 'comedy'],
  epic: ['action', 'adventure', 'fantasy']
}

// Get mood-based recommendations
router.get('/mood/:mood', protect, async (req: AuthRequest, res) => {
  try {
    const { mood } = req.params
    if (!moodGenreMap[mood]) {
      return res.status(400).json({ message: 'Invalid mood' })
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const preferences: any = user.preferences as any || {}
    const moodPreferences = [...(preferences.moodPreferences || [])]
    const existingIndex = moodPreferences.findIndex((p: any) => p.mood === mood)

    if (existingIndex !== -1) {
      moodPreferences[existingIndex] = {
        ...moodPreferences[existingIndex],
        weight: Math.min(moodPreferences[existingIndex].weight + 0.1, 5),
        lastSelected: new Date()
      }
    } else {
      moodPreferences.push({ mood, weight: 1, lastSelected: new Date() })
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { preferences: { ...preferences, moodPreferences } }
    })

    const genres = moodGenreMap[mood]
    const ratingThreshold = preferences.ratingThreshold || 6.0

    const movies = await prisma.movie.findMany({
      where: {
        AND: [
          { rating: { gte: ratingThreshold } },
          {
            OR: [
              { moodTags: { hasSome: [mood] } },
              { genres: { hasSome: genres } }
            ]
          }
        ]
      },
      orderBy: [{ rating: 'desc' }, { popularity: 'desc' }],
      take: 20
    })

    res.json({
      mood,
      movies,
      userWeight: moodPreferences.find((p: any) => p.mood === mood)?.weight || 1
    })
  } catch (error) {
    console.error('Mood recommendations error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get personalized recommendations
router.get('/personalized', protect, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const preferences: any = user.preferences as any || {}
    const favoriteGenres: string[] = preferences.favoriteGenres || []
    const moodPreferences = (preferences.moodPreferences || [])
      .sort((a: any, b: any) => b.weight - a.weight)
      .slice(0, 3)
      .map((p: any) => p.mood)
    const excludedMovies: number[] = (preferences.dislikedMovies || []).map(Number)
    const ratingThreshold = preferences.ratingThreshold || 6.0

    const where: any = {
      rating: { gte: ratingThreshold }
    }
    if (excludedMovies.length > 0) {
      where.id = { notIn: excludedMovies }
    }
    if (favoriteGenres.length > 0 || moodPreferences.length > 0) {
      where.OR = []
      if (favoriteGenres.length > 0) where.OR.push({ genres: { hasSome: favoriteGenres } })
      if (moodPreferences.length > 0) where.OR.push({ moodTags: { hasSome: moodPreferences } })
    }

    const movies = await prisma.movie.findMany({
      where,
      orderBy: [{ rating: 'desc' }, { popularity: 'desc' }],
      take: 20
    })

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

    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const preferences: any = user.preferences as any || {}
    let likedMovies: string[] = preferences.likedMovies || []
    let dislikedMovies: string[] = preferences.dislikedMovies || []

    if (liked) {
      likedMovies = [...new Set([...likedMovies, movieId])]
      dislikedMovies = dislikedMovies.filter((id: string) => id.toString() !== movieId)
    } else {
      dislikedMovies = [...new Set([...dislikedMovies, movieId])]
      likedMovies = likedMovies.filter((id: string) => id.toString() !== movieId)
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { preferences: { ...preferences, likedMovies, dislikedMovies } }
    })

    const updatedPrefs: any = updated.preferences
    res.json({
      message: `Movie ${liked ? 'liked' : 'disliked'} successfully`,
      likedMovies: updatedPrefs.likedMovies,
      dislikedMovies: updatedPrefs.dislikedMovies
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

    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const preferences: any = user.preferences as any || {}
    let watchlist: string[] = preferences.watchlist || []

    if (add) {
      watchlist = [...new Set([...watchlist, movieId])]
    } else {
      watchlist = watchlist.filter((id: string) => id.toString() !== movieId)
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { preferences: { ...preferences, watchlist } }
    })

    const updatedPrefs: any = updated.preferences
    res.json({
      message: `Movie ${add ? 'added to' : 'removed from'} watchlist`,
      watchlist: updatedPrefs.watchlist
    })
  } catch (error) {
    console.error('Watchlist error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's mood preferences
router.get('/mood-preferences', protect, async (req: AuthRequest, res: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const prefs: any = user.preferences
    const moodPreferences = prefs?.moodPreferences || []

    res.json({
      moodPreferences: moodPreferences.sort((a: any, b: any) => b.weight - a.weight)
    })
  } catch (error) {
    console.error('Get mood preferences error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
