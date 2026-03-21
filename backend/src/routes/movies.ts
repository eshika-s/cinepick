import express from 'express'
import axios from 'axios'
import { protect, AuthRequest } from '../middleware/auth'
import prisma from '../config/database'

const router = express.Router()

const TMDB_API_KEY = process.env.TMDB_API_KEY || '2b61a1d5540e6d75f7d38444ab857503'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// Get movies from TMDB API (main endpoint for frontend)
router.get('/', async (req, res) => {
  try {
    const { category, searchQuery, genre, page = 1 } = req.query

    console.log('📥 Movie request:', { category, searchQuery, genre, page })

    let endpoint = '/discover/movie'
    const params: any = {
      api_key: TMDB_API_KEY,
      page,
      language: 'en-US',
      include_adult: false
    }

    if (category) {
      endpoint = category === 'trending' ? '/trending/movie/week' : `/movie/${category}`
    } else if (searchQuery) {
      endpoint = '/search/movie'
      params.query = searchQuery
    } else {
      params.sort_by = 'popularity.desc'
      if (genre && genre !== 'all') {
        params.with_genres = genre
      }
    }

    console.log('🎬 Fetching from TMDB:', `${TMDB_BASE_URL}${endpoint}`)

    let retries = 3
    let lastError: any = null

    while (retries > 0) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
          params,
          timeout: 15000,
          headers: { 'Accept': 'application/json', 'User-Agent': 'YMovies/1.0' },
          httpAgent: new (require('http').Agent)({ keepAlive: true }),
          httpsAgent: new (require('https').Agent)({ keepAlive: true })
        })

        console.log('✅ TMDB response received:', response.data.results?.length || 0, 'movies')

        return res.json({
          movies: response.data.results || [],
          totalPages: response.data.total_pages || 1,
          page: response.data.page || 1
        })
      } catch (error: any) {
        lastError = error
        retries--
        if (error.code === 'ECONNRESET' && retries > 0) {
          console.log(`⚠️ Connection reset, retrying... (${retries} retries left)`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }
        throw error
      }
    }

    throw lastError
  } catch (error: any) {
    console.error('❌ Get movies error:', error.message)
    if (error.code === 'ECONNABORTED') return res.status(504).json({ message: 'Request timeout', error: 'timeout' })
    if (error.code === 'ECONNRESET') return res.status(503).json({ message: 'Connection failed', error: 'connection_reset' })
    if (error.response?.status === 429) return res.status(429).json({ message: 'Rate limit exceeded', error: 'rate_limit' })
    if (error.response?.status === 401) return res.status(500).json({ message: 'Invalid TMDB API key', error: 'invalid_api_key' })
    res.status(500).json({ message: 'Server error fetching movies', error: error.message })
  }
})

// Search movies in local database (Prisma)
router.get('/search', async (req, res) => {
  try {
    const { q, genre, mood, page = '1', limit = '20' } = req.query as any
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: any = {}
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { overview: { contains: q, mode: 'insensitive' } }
      ]
    }
    if (genre) where.genres = { has: genre }
    if (mood) where.moodTags = { has: mood }

    const [movies, count] = await Promise.all([
      prisma.movie.findMany({
        where,
        orderBy: [{ rating: 'desc' }, { popularity: 'desc' }],
        skip,
        take: parseInt(limit)
      }),
      prisma.movie.count({ where })
    ])

    res.json({
      movies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Search movies error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get movie by ID
router.get('/:id/providers', async (req, res) => {
  try {
    const { id } = req.params
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/watch/providers`, {
      params: { api_key: TMDB_API_KEY },
      timeout: 10000,
      httpAgent: new (require('http').Agent)({ keepAlive: true }),
      httpsAgent: new (require('https').Agent)({ keepAlive: true })
    })
    res.json({ providers: response.data.results })
  } catch (error: any) {
    console.error(`Error fetching providers for movie ${req.params.id}:`, error.message)
    res.status(500).json({ message: 'Server error fetching providers' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json({ movie })
  } catch (error) {
    console.error('Get movie error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Browse popular
router.get('/browse/popular', async (req, res) => {
  try {
    const { page = '1', limit = '20' } = req.query as any
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const movies = await prisma.movie.findMany({
      orderBy: [{ popularity: 'desc' }, { rating: 'desc' }],
      skip,
      take: parseInt(limit)
    })
    res.json({ movies })
  } catch (error) {
    console.error('Get popular movies error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Browse top rated
router.get('/browse/top-rated', async (req, res) => {
  try {
    const { page = '1', limit = '20' } = req.query as any
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const movies = await prisma.movie.findMany({
      orderBy: [{ rating: 'desc' }, { voteCount: 'desc' }],
      skip,
      take: parseInt(limit)
    })
    res.json({ movies })
  } catch (error) {
    console.error('Get top rated movies error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Browse by genre
router.get('/browse/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params
    const { page = '1', limit = '20' } = req.query as any
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const movies = await prisma.movie.findMany({
      where: { genres: { has: genre } },
      orderBy: [{ rating: 'desc' }, { popularity: 'desc' }],
      skip,
      take: parseInt(limit)
    })
    res.json({ movies })
  } catch (error) {
    console.error('Get movies by genre error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
