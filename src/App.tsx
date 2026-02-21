import { useState, useEffect } from 'react'
import { Container, Typography, CircularProgress, Box, Tabs, Tab, Button } from '@mui/material'
import { Movie } from './types/movie'
import useMovies, { MovieCategory } from './hooks/useMovies'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import GenreFilter from './components/GenreFilter'
import MovieCard from './components/MovieCard'
import MovieDetails from './components/MovieDetails'
import Footer from './components/Footer'
import MovieSection from './components/MovieSection'
import MoodPicker from './components/MoodPicker'
import MovieRoulette from './components/MovieRoulette'
import MovieNightPlanner from './components/MovieNightPlanner'
import AuthModal from './components/AuthModal'
import UserMenu from './components/UserMenu'
import apiService from './services/api'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movie-tabpanel-${index}`}
      aria-labelledby={`movie-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function AppContent() {
  const { state, loginWithToken, refreshUser } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [selectedMood, setSelectedMood] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Get mood keywords for search
  const moodData = [
    { id: 'happy', name: 'Happy & Uplifting', searchTerms: ['comedy', 'feel good comedy', 'family comedy'] },
    { id: 'thriller', name: 'Edge of Your Seat', searchTerms: ['thriller', 'suspense thriller', 'psychological thriller'] },
    { id: 'cozy', name: 'Cozy & Relaxing', searchTerms: ['drama', 'romance', 'heartwarming drama'] },
    { id: 'mindbending', name: 'Mind-Bending', searchTerms: ['sci-fi', 'science fiction', 'psychological thriller'] },
    { id: 'romantic', name: 'Romantic & Heartwarming', searchTerms: ['romance', 'love story', 'romantic comedy'] },
    { id: 'epic', name: 'Epic Adventures', searchTerms: ['adventure', 'action adventure', 'fantasy adventure'] }
  ]

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (token) {
      localStorage.setItem('token', token)

      const handleOAuthLogin = async () => {
        try {
          const userResponse = await apiService.getCurrentUser()
          loginWithToken(userResponse.user, token)
          window.history.replaceState({}, document.title, window.location.pathname)
        } catch (error) {
          console.error('OAuth login error:', error)
          localStorage.removeItem('token')
        }
      }

      handleOAuthLogin()
    }
  }, [loginWithToken])

  // Handle auth modal trigger
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setAuthModalOpen(true)
    }

    window.addEventListener('open-auth-modal', handleOpenAuthModal)
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuthModal)
    }
  }, [])

  // Handle navigation from Navbar
  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent<{ view: string }>
      const { view } = customEvent.detail

      const viewMap: Record<string, number> = {
        'browse': 0,
        'mood': 1,
        'discovery': 2,
        'planner': 3,
      }

      if (view in viewMap) {
        setTabValue(viewMap[view])
        // Reset search/filters when navigating between main sections
        setSearchQuery('')
        setSelectedMood('')
        setSelectedGenre('all')
      }
    }

    window.addEventListener('navigate', handleNavigation)
    return () => window.removeEventListener('navigate', handleNavigation)
  }, [])

  // Category sections
  const { movies: popularMovies, loading: popularLoading } = useMovies({ category: 'popular' })
  const { movies: topRatedMovies, loading: topRatedLoading } = useMovies({ category: 'top_rated' })
  const { movies: nowPlayingMovies, loading: nowPlayingLoading } = useMovies({ category: 'now_playing' })
  const { movies: trendingMovies, loading: trendingLoading } = useMovies({ category: 'trending' })

  // Search/Filter results
  const { movies, loading, error } = useMovies({
    searchQuery,
    genre: selectedGenre !== 'all' ? selectedGenre : undefined
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleMoodSelect = async (mood: string, description: string) => {
    setSelectedMood(mood)

    if (state.isAuthenticated && mood) {
      try {
        const currentPrefs = state.user?.preferences?.moodPreferences || []
        const existingPref = currentPrefs.find(p => p.mood === mood)

        let updatedPrefs
        if (existingPref) {
          updatedPrefs = currentPrefs.map(p =>
            p.mood === mood
              ? { ...p, weight: Math.min(p.weight + 0.1, 5), lastSelected: new Date().toISOString() }
              : p
          )
        } else {
          updatedPrefs = [...currentPrefs, { mood, weight: 1, lastSelected: new Date().toISOString() }]
        }

        await apiService.updatePreferences({ moodPreferences: updatedPrefs })
      } catch (error) {
        console.error('Failed to update mood preference:', error)
      }
    }

    if (mood) {
      const selectedMoodData = moodData.find(m => m.id === mood)
      if (selectedMoodData) {
        const searchQuery = selectedMoodData.searchTerms[0]
        setSearchQuery(searchQuery)
        setTabValue(0)
      }
    } else {
      setSearchQuery('')
      setSelectedMood('')
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleMovieLike = async (movieId: string, liked: boolean) => {
    if (state.isAuthenticated) {
      try {
        await apiService.likeMovie(movieId, liked)
      } catch (error) {
        console.error('Failed to like/dislike movie:', error)
      }
    } else {
      setAuthModalOpen(true)
    }
  }

  const handleWatchlistToggle = async (movieId: string, add: boolean) => {
    console.log('handleWatchlistToggle called:', { movieId, add, isAuthenticated: state.isAuthenticated })

    if (state.isAuthenticated) {
      try {
        console.log('Updating watchlist on server...')
        await apiService.toggleWatchlist(movieId, add)
        console.log('Watchlist updated successfully, refreshing user data...')
        await refreshUser()
        console.log('User data refreshed')
      } catch (error) {
        console.error('Failed to update watchlist:', error)
      }
    } else {
      console.log('User not authenticated, showing auth modal')
      setAuthModalOpen(true)
    }
  }

  const showSearchResults = searchQuery || selectedGenre !== 'all'

  if (error) return (
    <Box display="flex" justifyContent="center" mt={4} className="fade-in">
      <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
        Error loading movies: {error.message}
      </Typography>
    </Box>
  )

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'transparent',
    }}>
      <Navbar
        onSearch={handleSearch}
        activeView={['browse', 'mood', 'discovery', 'planner'][tabValue]}
      />

      <Box sx={{ mt: 8, flex: 1 }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Hero Section */}
          {!showSearchResults && tabValue === 0 && (
            <Box sx={{
              textAlign: 'center',
              mb: 6,
              py: { xs: 5, md: 10 },
              background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.1) 0%, rgba(0, 229, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                top: '-50%',
                left: '-10%',
                width: '60%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,51,102,0.15) 0%, transparent 70%)',
                transform: 'rotate(25deg)',
                pointerEvents: 'none'
              }} />
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '3rem', md: '5rem' },
                  color: '#ffffff',
                  mb: 2,
                  background: 'linear-gradient(135deg, #FF3366 0%, #00E5FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-1px'
                }}
              >
                CINEPICK
              </Typography>


              <Typography
                variant="h5"
                sx={{
                  color: '#B8B8CD',
                  mb: 5,
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
              >
                Discover your next favorite movie with our unique recommendation features
                {state.isAuthenticated && ' (Personalized for you!)'}
              </Typography>

              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="center"
                alignItems="center"
                maxWidth="600px"
                mx="auto"
              >
                <SearchBar onSearch={handleSearch} />
                <GenreFilter
                  selectedGenre={selectedGenre}
                  onGenreChange={setSelectedGenre}
                />
              </Box>
            </Box>
          )}

          {/* Search Results Header */}
          {showSearchResults && (
            <Box sx={{ mb: 4, animation: 'fadeIn 0.6s ease-out' }}>
              <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, fontWeight: 700 }}>
                {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedGenre} Movies`}
              </Typography>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <SearchBar onSearch={handleSearch} />
                <GenreFilter
                  selectedGenre={selectedGenre}
                  onGenreChange={setSelectedGenre}
                />
                {selectedMood && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#B8B8CD' }}>
                      Mood: <strong>{moodData.find(m => m.id === selectedMood)?.name || selectedMood}</strong>
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedMood('')
                        setSearchQuery('')
                        setTabValue(1)
                      }}
                      sx={{ color: '#FF3366' }}
                    >
                      Back to Mood Picker
                    </Button>
                  </Box>
                )}
              </Box>
              {movies.length > 0 ? (
                <MovieSection
                  title={searchQuery ? `Results for "${searchQuery}"` : `${selectedGenre} Movies`}
                  movies={movies}
                  loading={loading}
                  onMovieSelect={setSelectedMovie}
                  onLike={handleMovieLike}
                  onWatchlistToggle={handleWatchlistToggle}
                  userWatchlist={state.user?.preferences?.watchlist || []}
                  userLikedMovies={state.user?.preferences?.likedMovies || []}
                />
              ) : (
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" sx={{ color: '#b3b3b3' }}>
                    No movies found. Try a different search or genre.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Main Content - Only show when not searching */}
          {!showSearchResults && (
            <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>

              <TabPanel value={tabValue} index={0}>
                <MovieSection
                  title="Trending Now"
                  movies={trendingMovies}
                  loading={trendingLoading}
                  onMovieSelect={setSelectedMovie}
                  onLike={handleMovieLike}
                  onWatchlistToggle={handleWatchlistToggle}
                  userWatchlist={state.user?.preferences?.watchlist || []}
                  userLikedMovies={state.user?.preferences?.likedMovies || []}
                />

                <MovieSection
                  title="Popular Movies"
                  movies={popularMovies}
                  loading={popularLoading}
                  onMovieSelect={setSelectedMovie}
                  onLike={handleMovieLike}
                  onWatchlistToggle={handleWatchlistToggle}
                  userWatchlist={state.user?.preferences?.watchlist || []}
                  userLikedMovies={state.user?.preferences?.likedMovies || []}
                />

                <MovieSection
                  title="Top Rated"
                  movies={topRatedMovies}
                  loading={topRatedLoading}
                  onMovieSelect={setSelectedMovie}
                  onLike={handleMovieLike}
                  onWatchlistToggle={handleWatchlistToggle}
                  userWatchlist={state.user?.preferences?.watchlist || []}
                  userLikedMovies={state.user?.preferences?.likedMovies || []}
                />

                <MovieSection
                  title="Now Playing"
                  movies={nowPlayingMovies}
                  loading={nowPlayingLoading}
                  onMovieSelect={setSelectedMovie}
                  onLike={handleMovieLike}
                  onWatchlistToggle={handleWatchlistToggle}
                  userWatchlist={state.user?.preferences?.watchlist || []}
                  userLikedMovies={state.user?.preferences?.likedMovies || []}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <MoodPicker
                  onMoodSelect={handleMoodSelect}
                  selectedMood={selectedMood}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <MovieRoulette
                  movies={[...trendingMovies, ...popularMovies, ...topRatedMovies, ...nowPlayingMovies]}
                  onMovieSelect={setSelectedMovie}
                  onLike={handleMovieLike}
                  onWatchlistToggle={handleWatchlistToggle}
                  userWatchlist={state.user?.preferences?.watchlist || []}
                  userLikedMovies={state.user?.preferences?.likedMovies || []}
                  isAuthenticated={state.isAuthenticated}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <MovieNightPlanner
                  movies={movies}
                  requireAuth={!state.isAuthenticated}
                  onAuthRequired={() => setAuthModalOpen(true)}
                />
              </TabPanel>
            </Box>
          )}
        </Container>
      </Box>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </Box>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}