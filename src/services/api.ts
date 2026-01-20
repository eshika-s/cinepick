const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json()
        console.error('API Error Response:', error)
        throw new Error(error.message || error.errors?.[0]?.msg || 'Request failed')
      }

      return await response.json()
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string
    username: string
    password: string
    firstName?: string
    lastName?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  async getUserStats() {
    return this.request('/auth/stats')
  }

  async updatePreferences(preferences: any) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })
  }

  // Movie endpoints
  async searchMovies(params: {
    q?: string
    genre?: string
    mood?: string
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    
    return this.request(`/movies/search?${queryParams}`)
  }

  async getMovieById(id: string) {
    return this.request(`/movies/${id}`)
  }

  async getPopularMovies(page = 1, limit = 20) {
    return this.request(`/movies/browse/popular?page=${page}&limit=${limit}`)
  }

  async getTopRatedMovies(page = 1, limit = 20) {
    return this.request(`/movies/browse/top-rated?page=${page}&limit=${limit}`)
  }

  async getMoviesByGenre(genre: string, page = 1, limit = 20) {
    return this.request(`/movies/browse/genre/${genre}?page=${page}&limit=${limit}`)
  }

  // Recommendation endpoints
  async getMoodRecommendations(mood: string) {
    return this.request(`/recommendations/mood/${mood}`)
  }

  async getPersonalizedRecommendations() {
    return this.request('/recommendations/personalized')
  }

  async likeMovie(movieId: string, liked: boolean) {
    return this.request(`/recommendations/movie/${movieId}/like`, {
      method: 'POST',
      body: JSON.stringify({ liked }),
    })
  }

  async toggleWatchlist(movieId: string, add: boolean) {
    return this.request(`/recommendations/movie/${movieId}/watchlist`, {
      method: 'POST',
      body: JSON.stringify({ add }),
    })
  }

  async getMoodPreferences() {
    return this.request('/recommendations/mood-preferences')
  }

  // Movie Night endpoints
  async createMovieNight(movieNightData: {
    title: string
    date: string
    time: string
    guests: Array<{ name: string; email?: string }>
    theme?: string
    notes?: string
  }) {
    return this.request('/movie-nights', {
      method: 'POST',
      body: JSON.stringify(movieNightData),
    })
  }

  async getMovieNights(status?: string) {
    const query = status ? `?status=${status}` : ''
    return this.request(`/movie-nights${query}`)
  }

  async updateMovieNight(id: string, updates: any) {
    return this.request(`/movie-nights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteMovieNight(id: string) {
    return this.request(`/movie-nights/${id}`, {
      method: 'DELETE',
    })
  }

  async addMoviesToMovieNight(id: string, movieIds: string[]) {
    return this.request(`/movie-nights/${id}/movies`, {
      method: 'POST',
      body: JSON.stringify({ movieIds }),
    })
  }

  // Social auth URLs
  getGoogleAuthUrl() {
    return `${API_BASE_URL}/auth/google`
  }

  getAppleAuthUrl() {
    return `${API_BASE_URL}/auth/apple`
  }
}

export const apiService = new ApiService()
export default apiService
