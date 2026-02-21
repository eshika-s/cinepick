import { Box, Typography, Skeleton } from '@mui/material'
import { Movie } from '../types/movie'
import MovieCard from './MovieCard'

interface MovieSectionProps {
  title: string
  movies: Movie[]
  loading?: boolean
  onMovieSelect?: (movie: Movie) => void
  onLike?: (movieId: string, liked: boolean) => void
  onWatchlistToggle?: (movieId: string, add: boolean) => void
  userWatchlist?: string[]
  userLikedMovies?: string[]
}

export default function MovieSection({
  title,
  movies,
  loading,
  onMovieSelect,
  onLike,
  onWatchlistToggle,
  userWatchlist = [],
  userLikedMovies = []
}: MovieSectionProps) {
  return (
    <Box sx={{ mb: 6 }} className="fade-in">
      <Typography variant="h5" component="h2" sx={{
        mb: 3,
        fontWeight: 700,
        pl: 2,
        color: '#ffffff',
        fontSize: { xs: '1.5rem', md: '1.75rem' },
        borderLeft: '4px solid #FF3366',
        borderRadius: '2px'
      }}>
        {title}
      </Typography>

      <Box sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: 3,
        pb: 2,
        px: 2,
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': {
          height: 10,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          border: '2px solid rgba(10, 10, 15, 0.8)',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(10, 10, 15, 0.8)',
          borderRadius: 4,
        }
      }}>
        {loading ? (
          // Enhanced loading skeletons
          [...Array(4)].map((_, index) => (
            <Box key={index} sx={{
              minWidth: 250,
              scrollSnapAlign: 'start',
              animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
            }}>
              <Box sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(21, 21, 30, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <Skeleton
                  variant="rectangular"
                  width={250}
                  height={375}
                  sx={{
                    borderRadius: 0,
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)',
                    backgroundSize: '1000px 100%',
                    animation: 'shimmer 2s infinite',
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Skeleton
                    width="60%"
                    height={24}
                    sx={{
                      mb: 1,
                      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)',
                      backgroundSize: '1000px 100%',
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                  <Skeleton
                    width="40%"
                    height={16}
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)',
                      backgroundSize: '1000px 100%',
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton
                      width={60}
                      height={24}
                      sx={{
                        borderRadius: 1,
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)',
                        backgroundSize: '1000px 100%',
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                    <Skeleton
                      width={60}
                      height={24}
                      sx={{
                        borderRadius: 1,
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)',
                        backgroundSize: '1000px 100%',
                        animation: 'shimmer 2s infinite 0.5s',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          // Actual movie cards with staggered animation
          movies.map((movie, index) => (
            <Box key={movie.id} sx={{
              minWidth: 250,
              scrollSnapAlign: 'start',
              animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`
            }}>
              <MovieCard
                movie={movie}
                onMovieSelect={onMovieSelect}
                onLike={onLike}
                onWatchlistToggle={onWatchlistToggle}
                isInWatchlist={userWatchlist.includes(movie.id.toString())}
                isLiked={userLikedMovies.includes(movie.id.toString())}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}