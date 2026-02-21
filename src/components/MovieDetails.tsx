import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Movie } from '../types/movie';

interface MovieDetailsProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieDetails({ movie, onClose }: MovieDetailsProps) {
  return (
    <Dialog
      open={!!movie}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(21, 21, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #FF3366 0%, #00E5FF 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {movie?.title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#B8B8CD',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 51, 102, 0.2)',
              color: '#FF3366'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', p: { xs: 2, md: 4 } }}>
        {movie && (
          <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.backdropUrl || movie.posterUrl || ''}`}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', objectFit: 'cover', maxHeight: '400px' }}
            />
            <Typography variant="body1" sx={{ color: '#E0E0E0', fontSize: '1.1rem', lineHeight: 1.7 }}>
              {movie.overview}
            </Typography>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#B8B8CD' }}>
                <strong style={{ color: '#00E5FF' }}>Rating:</strong> {movie.rating}/10
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#B8B8CD' }}>
                <strong style={{ color: '#FF3366' }}>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}