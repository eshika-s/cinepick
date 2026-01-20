import { Card, CardContent, CardMedia, Typography, Chip, Rating, Box, IconButton } from '@mui/material'
import { Favorite, Bookmark, BookmarkBorder } from '@mui/icons-material'
import { Movie } from '../types/movie'
import { useState } from 'react'

interface MovieCardProps {
  movie: Movie
  onMovieSelect?: (movie: Movie) => void
  onLike?: (movieId: string, liked: boolean) => void
  onWatchlistToggle?: (movieId: string, add: boolean) => void
  isInWatchlist?: boolean
  isLiked?: boolean
}

export default function MovieCard({ 
  movie, 
  onMovieSelect, 
  onLike, 
  onWatchlistToggle, 
  isInWatchlist = false,
  isLiked = false 
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('MovieCard watchlist button clicked:', {
      movieId: movie.id,
      movieTitle: movie.title,
      currentlyInWatchlist: isInWatchlist,
      hasOnWatchlistToggle: !!onWatchlistToggle
    })
    if (onWatchlistToggle) {
      console.log('Calling onWatchlistToggle with:', movie.id.toString(), !isInWatchlist)
      onWatchlistToggle(movie.id.toString(), !isInWatchlist)
    } else {
      console.error('onWatchlistToggle is not defined!')
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onLike) {
      onLike(movie.id.toString(), !isLiked)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 25px rgba(229, 9, 20, 0.3)',
        }
      }}
      onClick={() => onMovieSelect?.(movie)}
    >
      <Box sx={{ position: 'relative', paddingTop: '150%' }}>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
          image={imageError ? '/placeholder-movie.svg' : (movie.posterUrl || '/placeholder-movie.svg')}
          alt={movie.title}
          onError={handleImageError}
        />
      </Box>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          noWrap
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.2,
            mb: 1,
            color: '#ffffff'
          }}
        >
          {movie.title}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating
            value={(movie.rating / 2) || 0}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#e50914',
              }
            }}
          />
          <Typography variant="body2" sx={{ color: '#b3b3b3', fontSize: '0.75rem' }}>
            ({movie.voteCount?.toLocaleString() || '0'})
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1, fontSize: '0.8rem' }}>
          {new Date(movie.releaseDate).getFullYear()}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            color: '#b3b3b3', 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.75rem',
            lineHeight: 1.4,
          }}
        >
          {movie.overview || 'No description available'}
        </Typography>

        <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 0.5, 
            mt: 'auto',
            mb: 1
          }}>
            {movie.genres?.slice(0, 2).map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                size="small"
                sx={{
                  backgroundColor: '#333',
                  color: '#ffffff',
                  border: '1px solid #444',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  height: 24,
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            {onLike && (
              <IconButton
                size="small"
                onClick={handleLikeClick}
                sx={{
                  color: isLiked ? '#e50914' : '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    color: '#e50914',
                  }
                }}
              >
                <Favorite fontSize="small" />
              </IconButton>
            )}
            
            {onWatchlistToggle && (
              <IconButton
                size="small"
                onClick={handleWatchlistClick}
                sx={{
                  color: isInWatchlist ? '#e50914' : '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    color: '#e50914',
                  }
                }}
              >
                {isInWatchlist ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
              </IconButton>
            )}
          </Box>
      </CardContent>
    </Card>
  )
}