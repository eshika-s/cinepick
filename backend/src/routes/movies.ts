import express from 'express'
import axios from 'axios'
import { Op } from 'sequelize'
import { protect, AuthRequest } from '../middleware/auth'
import { Movie } from '../models/Movie'

const router = express.Router()

// TMDB API configuration
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
      endpoint = category === 'trending'
        ? '/trending/movie/week'
        : `/movie/${category}`
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

    // Retry logic for connection issues
    let retries = 3
    let lastError: any = null

    while (retries > 0) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
          params,
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'YMovies/1.0'
          },
          // Add connection pooling settings
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
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
          continue
        }

        throw error
      }
    }

    throw lastError

  } catch (error: any) {
    console.error('❌ Get movies error:', error.message)

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        message: 'Request timeout - TMDB API is slow',
        error: 'timeout'
      })
    }

    if (error.code === 'ECONNRESET') {
      return res.status(503).json({
        message: 'Connection to TMDB API failed. Please try again.',
        error: 'connection_reset'
      })
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        message: 'Too many requests to TMDB API',
        error: 'rate_limit'
      })
    }

    if (error.response?.status === 401) {
      return res.status(500).json({
        message: 'Invalid TMDB API key',
        error: 'invalid_api_key'
      })
    }

    res.status(500).json({
      message: 'Server error fetching movies',
      error: error.message,
      details: error.response?.data || error.code
    })
  }
})

// Search movies in local database
router.get('/search', async (req, res) => {
  try {
    const { q, genre, mood, page = 1, limit = 20 } = req.query

    const where: any = {}

    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { overview: { [Op.like]: `%${q}%` } }
      ]
    }

    if (genre) {
      // For JSON array in MySQL, we might need JSON_CONTAINS or just Op.like if it's stringified
      // but Sequelize handles JSON fields. However Op.contains is for postgres.
      // For MySQL JSON, we can use Op.like if we know the structure or Op.regexp
      where.genres = { [Op.like]: `%${genre}%` }
    }

    if (mood) {
      where.moodTags = { [Op.like]: `%${mood}%` }
    }

    const offset = (Number(page) - 1) * Number(limit)
    const { count, rows: movies } = await Movie.findAndCountAll({
      where,
      order: [['rating', 'DESC'], ['popularity', 'DESC']],
      limit: Number(limit),
      offset: offset
    })

    res.json({
      movies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / Number(limit))
      }
    })
  } catch (error) {
    console.error('Search movies error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id)

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json({ movie })
  } catch (error) {
    console.error('Get movie error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get popular movies
router.get('/browse/popular', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    const movies = await Movie.findAll({
      order: [['popularity', 'DESC'], ['rating', 'DESC']],
      limit: Number(limit),
      offset: offset
    })

    res.json({ movies })
  } catch (error) {
    console.error('Get popular movies error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get top rated movies
router.get('/browse/top-rated', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    const movies = await Movie.findAll({
      order: [['rating', 'DESC'], ['voteCount', 'DESC']],
      limit: Number(limit),
      offset: offset
    })

    res.json({ movies })
  } catch (error) {
    console.error('Get top rated movies error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get movies by genre
router.get('/browse/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params
    const { page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    const movies = await Movie.findAll({
      where: {
        genres: { [Op.like]: `%${genre}%` }
      },
      order: [['rating', 'DESC'], ['popularity', 'DESC']],
      limit: Number(limit),
      offset: offset
    })

    res.json({ movies })
  } catch (error) {
    console.error('Get movies by genre error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
