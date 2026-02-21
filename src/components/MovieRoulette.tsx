import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material'
import {
  Shuffle,
  PlayArrow,
  Add,
  Close,
  Movie as MovieIcon,
  AccessTime,
  Star,
  Favorite,
  BookmarkBorder
} from '@mui/icons-material'
import { Movie } from '../types/movie'

interface MovieRouletteProps {
  movies: Movie[]
  onMovieSelect: (movie: Movie) => void
  onLike?: (movieId: string, liked: boolean) => void
  onWatchlistToggle?: (movieId: string, add: boolean) => void
  userWatchlist?: string[]
  userLikedMovies?: string[]
  isAuthenticated?: boolean
}

export default function MovieRoulette({ movies, onMovieSelect, onLike, onWatchlistToggle, userWatchlist = [], userLikedMovies = [], isAuthenticated = false }: MovieRouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)
  const [history, setHistory] = useState<Movie[]>([])
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = (movieId: string) => {
    setImageErrors(prev => new Set(prev).add(movieId))
  }

  // Check if movies are loaded
  useEffect(() => {
    if (movies.length > 0) {
      setIsLoading(false)
      if (!currentMovie) {
        setCurrentMovie(movies[0])
      }
    }
  }, [movies, currentMovie])

  const spinRoulette = () => {
    if (movies.length === 0) return

    setIsSpinning(true)

    // Simulate spinning effect
    let spins = 0
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * movies.length)
      setCurrentMovie(movies[randomIndex])
      spins++

      if (spins > 20) {
        clearInterval(spinInterval)
        setIsSpinning(false)
        const finalMovie = movies[Math.floor(Math.random() * movies.length)]
        setCurrentMovie(finalMovie)

        // Add to history if not already there
        setHistory(prev => {
          const exists = prev.find(m => m.id === finalMovie.id)
          if (!exists) {
            return [finalMovie, ...prev.slice(0, 4)] // Keep last 5
          }
          return prev
        })
      }
    }, 100)
  }

  const isInWatchlist = (movieId: string) => {
    return userWatchlist.includes(movieId)
  }

  const handleWatchlistToggle = (movie: Movie) => {
    console.log('MovieRoulette handleWatchlistToggle called:', {
      movieId: movie.id,
      movieTitle: movie.title,
      userWatchlist,
      onWatchlistToggle: !!onWatchlistToggle
    })

    if (onWatchlistToggle) {
      const movieId = movie.id.toString()
      const isCurrentlyInWatchlist = isInWatchlist(movieId)
      console.log('Toggling watchlist:', { movieId, isCurrentlyInWatchlist })
      onWatchlistToggle(movieId, !isCurrentlyInWatchlist)
    } else {
      console.error('onWatchlistToggle is not defined!')
    }
  }

  return (
    <Box className="fade-in">
      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#e50914' }} />
          <Typography variant="h6" sx={{ color: '#b3b3b3', mt: 3 }}>
            Loading movies...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{
              fontWeight: 700,
              mb: 2,
              color: '#ffffff',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}>
              🎯 Movie Discovery Wheel
            </Typography>
            <Typography variant="body1" sx={{
              color: '#b3b3b3',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>
              Can't decide what to watch? Let fate choose! Spin the wheel for a random movie recommendation tailored to your taste.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Main Roulette */}
            <Grid item xs={12} md={8}>
              <Card sx={{
                background: 'rgba(21, 21, 30, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 4,
                overflow: 'hidden',
                '&:hover': {
                  borderColor: 'rgba(255, 51, 102, 0.4)',
                  boxShadow: '0 12px 30px -10px rgba(255, 51, 102, 0.3), 0 4px 10px -5px rgba(0, 229, 255, 0.2)'
                }
              }}>
                <CardContent sx={{ p: 0 }}>
                  {currentMovie ? (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                      <Box sx={{
                        width: { xs: '100%', md: '200px' },
                        height: { xs: '300px', md: '200px' },
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={imageErrors.has(currentMovie.id.toString()) ? '/placeholder-movie.svg' : (currentMovie.posterUrl || '/placeholder-movie.svg')}
                          alt={currentMovie.title}
                          onError={() => handleImageError(currentMovie.id.toString())}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {isSpinning && (
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Shuffle sx={{
                              fontSize: '3rem',
                              color: '#FF3366',
                              animation: 'spin 1s linear infinite'
                            }} />
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ flex: 1, p: 3 }}>
                        <Typography variant="h5" sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: '#ffffff',
                          fontSize: '1.3rem'
                        }}>
                          {currentMovie.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ color: '#fbbf24', fontSize: '1rem' }} />
                            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                              {currentMovie.rating.toFixed(1)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ color: '#b3b3b3', fontSize: '1rem' }} />
                            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                              {new Date(currentMovie.releaseDate).getFullYear()}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body2" sx={{
                          color: '#b3b3b3',
                          mb: 3,
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {currentMovie.overview || 'No description available'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={() => onMovieSelect(currentMovie)}
                            disabled={isSpinning}
                            sx={{
                              borderRadius: 3,
                              background: 'linear-gradient(135deg, #FF3366 0%, #FF6B8B 100%)',
                              boxShadow: '0 4px 14px 0 rgba(255, 51, 102, 0.39)',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #E60039 0%, #FF3366 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(255, 51, 102, 0.5)',
                              },
                              '&:disabled': {
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: '#666'
                              }
                            }}
                          >
                            View Details
                          </Button>

                          <Button
                            variant="outlined"
                            startIcon={isInWatchlist(currentMovie.id.toString()) ? <BookmarkBorder /> : <Add />}
                            onClick={() => handleWatchlistToggle(currentMovie)}
                            disabled={isSpinning}
                            sx={{
                              borderRadius: 3,
                              px: 3,
                              py: 1,
                              fontWeight: 600,
                              textTransform: 'none',
                              fontSize: '0.9rem',
                              borderColor: isInWatchlist(currentMovie.id.toString()) ? '#00E5FF' : 'rgba(255,255,255,0.15)',
                              color: isInWatchlist(currentMovie.id.toString()) ? '#00E5FF' : '#ffffff',
                              backgroundColor: isInWatchlist(currentMovie.id.toString()) ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                              '&:hover': {
                                borderColor: '#FF3366',
                                backgroundColor: 'rgba(255, 51, 102, 0.1)',
                                color: '#ffffff',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(255, 51, 102, 0.3)'
                              },
                              '&:disabled': {
                                borderColor: 'rgba(255,255,255,0.05)',
                                color: '#666',
                                backgroundColor: 'transparent'
                              }
                            }}
                          >
                            {isInWatchlist(currentMovie.id.toString()) ? 'In Watchlist' : 'Add to Watchlist'}
                          </Button>

                          {!isAuthenticated && (
                            <Typography variant="caption" sx={{
                              color: '#e50914',
                              mt: 1,
                              fontSize: '0.75rem',
                              display: 'block'
                            }}>
                              Sign in to save to watchlist
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                      <MovieIcon sx={{ fontSize: '4rem', color: '#666', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#b3b3b3', mb: 3 }}>
                        No movies available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Shuffle />}
                  onClick={spinRoulette}
                  disabled={isSpinning || movies.length === 0}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #00E5FF 0%, #33EAFF 100%)',
                    color: '#0A0A0F',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 14px 0 rgba(0, 229, 255, 0.39)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00B2CC 0%, #00E5FF 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 229, 255, 0.5)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#666'
                    }
                  }}
                >
                  {isSpinning ? 'Spinning...' : 'Spin Again!'}
                </Button>
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Watchlist */}
              <Box sx={{
                width: { xs: '100%', md: '400px' },
                p: 3,
                background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                border: '1px solid #333',
                borderRadius: 4,
                height: '600px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" sx={{
                  color: '#ffffff',
                  mb: 3,
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF3366, #FF6B8B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255, 51, 102, 0.3)'
                  }}>
                    <BookmarkBorder sx={{ fontSize: '1.2rem', color: '#ffffff' }} />
                  </Box>
                  My Watchlist
                </Typography>

                <Typography variant="body2" sx={{
                  color: '#b3b3b3',
                  mb: 3,
                  fontSize: '0.9rem',
                  lineHeight: 1.5
                }}>
                  Your curated collection of movies to watch later
                </Typography>

                {userWatchlist.length === 0 ? (
                  <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #333, #444)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      opacity: 0.8
                    }}>
                      <BookmarkBorder sx={{ fontSize: '2rem', color: '#666' }} />
                    </Box>
                    <Typography variant="h6" sx={{
                      color: '#b3b3b3',
                      mb: 2,
                      fontWeight: 600
                    }}>
                      Your watchlist is empty
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#666',
                      fontSize: '0.9rem',
                      maxWidth: '250px',
                      lineHeight: 1.4
                    }}>
                      Don't worry, there's a watchlist for that
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setIsSpinning(true)}
                      sx={{
                        mt: 3,
                        borderRadius: '50px',
                        px: 3,
                        py: 1,
                        borderColor: '#e50914',
                        color: '#e50914',
                        '&:hover': {
                          backgroundColor: '#e50914',
                          color: '#ffffff',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Discover Movies
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#1f1f1f'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#444',
                      borderRadius: '3px',
                      '&:hover': {
                        background: '#555'
                      }
                    }
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {userWatchlist.map((movieId) => {
                        const movie = movies.find(m => m.id.toString() === movieId)
                        if (!movie) return null
                        return (
                          <Box
                            key={movieId}
                            sx={{
                              display: 'flex',
                              gap: 2,
                              p: 2,
                              background: 'linear-gradient(135deg, #2a2a2a 0%, #333 100%)',
                              borderRadius: 3,
                              border: '1px solid #444',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#e50914',
                                transform: 'translateX(-4px)',
                                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.2)'
                              }
                            }}
                          >
                            <Box
                              component="img"
                              src={imageErrors.has(movie.id.toString()) ? '/placeholder-movie.svg' : (movie.posterUrl || '/placeholder-movie.svg')}
                              alt={movie.title}
                              sx={{
                                width: 60,
                                height: 90,
                                borderRadius: 2,
                                objectFit: 'cover',
                                flexShrink: 0,
                                border: '2px solid #444'
                              }}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-movie.svg'
                              }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2" sx={{
                                color: '#ffffff',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {movie.title}
                              </Typography>
                              <Typography variant="body2" sx={{
                                color: '#b3b3b3',
                                fontSize: '0.85rem',
                                mb: 1
                              }}>
                                {new Date(movie.releaseDate).getFullYear()} • {movie.genres.slice(0, 2).join(', ')}
                              </Typography>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1
                              }}>
                                <Typography variant="body2" sx={{
                                  color: '#e50914',
                                  fontWeight: 600,
                                  fontSize: '0.85rem'
                                }}>
                                  ⭐ {movie.rating}
                                </Typography>
                                <Typography variant="body2" sx={{
                                  color: '#666',
                                  fontSize: '0.8rem'
                                }}>
                                  ({movie.voteCount})
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                onClick={() => onMovieSelect(movie)}
                                sx={{
                                  textTransform: 'none',
                                  fontSize: '0.8rem',
                                  py: 0.5,
                                  px: 2,
                                  borderRadius: '50px',
                                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                                  color: '#e50914',
                                  border: '1px solid rgba(229, 9, 20, 0.3)',
                                  '&:hover': {
                                    backgroundColor: '#e50914',
                                    color: '#ffffff',
                                    transform: 'translateY(-1px)'
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                View Details
                              </Button>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => handleWatchlistToggle(movie)}
                              sx={{
                                color: '#666',
                                '&:hover': {
                                  color: '#e50914',
                                  backgroundColor: 'rgba(229, 9, 20, 0.1)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <Close sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Recent Spins */}
              <Card sx={{
                mt: 3,
                background: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#ffffff'
                  }}>
                    🕐 Recent Spins
                  </Typography>

                  {history.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      No spins yet
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {history.map((movie, index) => (
                        <Box
                          key={`${movie.id}-${index}`}
                          sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                          onClick={() => setCurrentMovie(movie)}
                        >
                          <Avatar
                            src={imageErrors.has(movie.id.toString()) ? '/placeholder-movie.svg' : (movie.posterUrl || '/placeholder-movie.svg')}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                            onError={() => handleImageError(movie.id.toString())}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{
                              fontWeight: 500,
                              color: '#ffffff',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {movie.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                              {movie.rating.toFixed(1)} ⭐
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  )
}
