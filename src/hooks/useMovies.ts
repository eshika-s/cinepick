import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { Movie } from '../types/movie'
import { genreMap } from '../utils/genreMap'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Request queue to handle rate limiting
class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private isProcessing = false
  private lastRequestTime = 0
  private readonly minDelay = 350 // Increased to 350ms between requests

  async add<T>(request: () => Promise<T>, retries = 3): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.executeWithRetry(request, retries)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async executeWithRetry<T>(request: () => Promise<T>, retries: number): Promise<T> {
    try {
      return await request()
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 429 && retries > 0) {
        // Exponential backoff: wait 1s, 2s, 4s
        const delay = Math.pow(2, 3 - retries) * 1000
        console.log(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.executeWithRetry(request, retries - 1)
      }
      throw error
    }
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return
    
    this.isProcessing = true
    
    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequestTime
      
      if (timeSinceLastRequest < this.minDelay) {
        await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastRequest))
      }
      
      const request = this.queue.shift()
      if (request) {
        try {
          await request()
          this.lastRequestTime = Date.now()
        } catch (error) {
          console.error('Request failed after retries:', error)
        }
      }
    }
    
    this.isProcessing = false
  }
}

const requestQueue = new RequestQueue()

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() })
}

const reverseGenreMap: { [key: string]: number } = Object.entries(genreMap).reduce(
  (acc, [id, name]) => ({ ...acc, [name]: parseInt(id) }),
  {}
)

export type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'trending'

interface UseMoviesProps {
  searchQuery?: string
  genre?: string
  category?: MovieCategory
}

export default function useMovies({ searchQuery, genre, category }: UseMoviesProps = {}) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const formatMovie = useCallback((movie: any): Movie => ({
    id: movie.id,
    title: movie.title,
    genres: movie.genre_ids?.map((id: number) => genreMap[id]) || [],
    rating: movie.vote_average || 0,
    year: movie.release_date?.split('-')[0] || 'N/A',
    overview: movie.overview || 'No description available',
    posterUrl: movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/placeholder-movie.svg',
    backdropUrl: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : '/placeholder-movie.svg',
    releaseDate: movie.release_date || 'Unknown',
    popularity: movie.popularity || 0,
    voteCount: movie.vote_count || 0
  }), [])

  const fetchMovies = useCallback(async (pageNumber = 1, isNewSearch = false) => {
    try {
      setLoading(true)
      setError(null)

      // Create cache key
      const cacheKey = `${category || 'all'}_${searchQuery || 'none'}_${genre || 'all'}_page${pageNumber}`
      
      // Check cache first
      const cachedData = getCachedData(cacheKey)
      if (cachedData && pageNumber === 1) {
        setMovies(cachedData.movies)
        setTotalPages(cachedData.totalPages)
        setPage(pageNumber)
        setLoading(false)
        return
      }

      const params: any = {
        page: pageNumber,
        category,
        searchQuery,
        genre
      }

      // Use request queue to avoid rate limiting
      const response = await requestQueue.add(() => 
        axios.get(`${API_BASE_URL}/movies`, { params })
      )
      
      const totalPages = response.data.totalPages || 1
      const newMovies = response.data.movies.map(formatMovie)
      
      // Cache the results for first page
      if (pageNumber === 1) {
        setCachedData(cacheKey, { movies: newMovies, totalPages })
      }
      
      setTotalPages(totalPages)
      setMovies(prev => isNewSearch ? newMovies : [...prev, ...newMovies])
      setPage(pageNumber)

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError(new Error('Rate limit exceeded. Please wait a moment and try again.'))
        } else if (err.response?.status === 503) {
          setError(new Error('Connection to movie database failed. Please refresh the page.'))
        } else if (err.response?.status === 504) {
          setError(new Error('Request timeout. Movie database is slow, please try again.'))
        } else if (err.code === 'ECONNABORTED') {
          setError(new Error('Request timeout. Please check your internet connection.'))
        } else if (err.response?.status === 500) {
          const errorData = err.response?.data as any
          setError(new Error(errorData?.message || 'Server error. Please try again later.'))
        } else {
          setError(new Error(err.message || 'Failed to fetch movies'))
        }
      } else {
        setError(err instanceof Error ? err : new Error('Failed to fetch movies'))
      }
      console.error('Movie fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, genre, category, formatMovie])

  // Initial load and search/genre/category change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchMovies(1, true)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [fetchMovies])

  // Load more movies
  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      fetchMovies(page + 1)
    }
  }, [page, totalPages, loading, fetchMovies])

  return { 
    movies, 
    loading, 
    error, 
    loadMore, 
    hasMore: page < totalPages 
  }
}