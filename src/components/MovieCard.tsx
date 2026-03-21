import { Card, CardContent, CardMedia, Typography, Chip, Rating, Box, IconButton, Avatar, Tooltip } from '@mui/material'
import { Favorite, Bookmark, BookmarkBorder } from '@mui/icons-material'
import { Movie } from '../types/movie'
import { useState, useEffect } from 'react'
import axios from 'axios'

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

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
  const [providers, setProviders] = useState<WatchProvider[]>([])

  useEffect(() => {
    let isMounted = true;
    const fetchProviders = async () => {
      try {
        const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${url}/movies/${movie.id}/providers`);
        if (!isMounted) return;
        
        const results = res.data.providers;
        if (results) {
          // Check India, then USA, or fallback to first available
          const countryData = results.IN || results.US || Object.values(results)[0] as any;
          if (countryData) {
            if (countryData.flatrate) setProviders(countryData.flatrate.slice(0, 3));
            else if (countryData.rent) setProviders(countryData.rent.slice(0, 3));
            else if (countryData.buy) setProviders(countryData.buy.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to fetch providers', err);
      }
    };
    fetchProviders();
    return () => { isMounted = false; };
  }, [movie.id]);

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
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        backgroundColor: 'rgba(21, 21, 30, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: 'rgba(255, 51, 102, 0.4)',
          boxShadow: '0 12px 30px -10px rgba(255, 51, 102, 0.3), 0 4px 10px -5px rgba(0, 229, 255, 0.2)',
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
                color: '#00E5FF',
              },
              '& .MuiRating-iconEmpty': {
                color: 'rgba(255,255,255,0.2)'
              }
            }}
          />
          <Typography variant="body2" sx={{ color: '#B8B8CD', fontSize: '0.75rem' }}>
            ({movie.voteCount?.toLocaleString() || '0'})
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#B8B8CD', mb: 1, fontSize: '0.8rem' }}>
          {new Date(movie.releaseDate).getFullYear()}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#B8B8CD',
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

        {providers.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', mt: 'auto' }}>
            <Typography variant="caption" sx={{ color: '#B8B8CD', fontSize: '0.7rem' }}>
              Available on:
            </Typography>
            {providers.map(p => (
              <Tooltip key={p.provider_id} title={p.provider_name} arrow placement="top">
                <Avatar 
                  src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} 
                  alt={p.provider_name}
                  sx={{ width: 22, height: 22, border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </Tooltip>
            ))}
          </Box>
        )}

        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          mt: providers.length > 0 ? 0 : 'auto',
          mb: 1
        }}>
          {movie.genres?.slice(0, 2).map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                fontSize: '0.7rem',
                fontWeight: 600,
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
                color: isLiked ? '#FF3366' : '#B8B8CD',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 51, 102, 0.15)',
                  color: '#FF3366',
                  transform: 'scale(1.1)',
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
                color: isInWatchlist ? '#00E5FF' : '#B8B8CD',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 229, 255, 0.15)',
                  color: '#00E5FF',
                  transform: 'scale(1.1)',
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