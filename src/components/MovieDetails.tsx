import {
  Dialog, DialogContent, DialogTitle, IconButton, Typography,
  Box, Chip, Rating, Divider, CircularProgress, Tooltip, Avatar
} from '@mui/material';
import { Close, CalendarToday, Star, PlayCircle, ShoppingCart, VideoLibrary } from '@mui/icons-material';
import { Movie } from '../types/movie';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface MovieDetailsProps {
  movie: Movie | null;
  onClose: () => void;
}

interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority?: number;
}

interface ProviderCategory {
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
  free?: Provider[];
  link?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const REGION_PRIORITY = ['IN', 'US', 'GB', 'AU', 'CA'];

function ProviderRow({ providers, label, color, icon }: {
  providers: Provider[];
  label: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ color, display: 'flex' }}>{icon}</Box>
        <Typography variant="caption" sx={{ color, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {providers.map(p => (
          <Tooltip key={p.provider_id} title={p.provider_name} arrow placement="top">
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'default',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            }}>
              <Avatar
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                alt={p.provider_name}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  border: '2px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  '&:hover': { borderColor: color }
                }}
              />
              <Typography variant="caption" sx={{
                color: '#B8B8CD',
                fontSize: '0.6rem',
                textAlign: 'center',
                maxWidth: 56,
                lineHeight: 1.2
              }}>
                {p.provider_name}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}

export default function MovieDetails({ movie, onClose }: MovieDetailsProps) {
  const [providerData, setProviderData] = useState<ProviderCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<string>('');

  useEffect(() => {
    if (!movie) { setProviderData(null); setRegion(''); return; }

    let isMounted = true;
    setLoading(true);
    setProviderData(null);

    const fetchProviders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/movies/${movie.id}/providers`);
        if (!isMounted) return;
        const results = res.data.providers;
        if (results) {
          for (const code of REGION_PRIORITY) {
            if (results[code]) {
              setProviderData(results[code]);
              setRegion(code);
              break;
            }
          }
          if (!providerData) {
            const firstKey = Object.keys(results)[0];
            if (firstKey) { setProviderData(results[firstKey]); setRegion(firstKey); }
          }
        }
      } catch (err) {
        console.error('Failed to fetch providers', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProviders();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.id]);

  const hasProviders = providerData && (
    (providerData.flatrate?.length ?? 0) +
    (providerData.rent?.length ?? 0) +
    (providerData.buy?.length ?? 0) +
    (providerData.free?.length ?? 0) > 0
  );

  const regionLabels: Record<string, string> = {
    IN: '🇮🇳 India', US: '🇺🇸 USA', GB: '🇬🇧 UK', AU: '🇦🇺 Australia', CA: '🇨🇦 Canada'
  };

  return (
    <Dialog
      open={!!movie}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(10, 10, 18, 0.97)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 4,
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Backdrop header */}
      {movie?.backdropUrl && (
        <Box sx={{ position: 'relative', height: { xs: 180, md: 280 } }}>
          <img
            src={movie.backdropUrl.startsWith('http') ? movie.backdropUrl : `https://image.tmdb.org/t/p/w1280${movie.backdropUrl}`}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,18,1) 0%, rgba(10,10,18,0.4) 60%, transparent 100%)'
          }} />
          {/* Poster overlay */}
          <Box sx={{ position: 'absolute', bottom: -40, left: { xs: 16, md: 32 }, zIndex: 2 }}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: 90, height: 135, objectFit: 'cover', borderRadius: 12, border: '3px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
            />
          </Box>
        </Box>
      )}

      <DialogTitle sx={{ pt: movie?.backdropUrl ? 7 : 3, pb: 1, px: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #FF3366 0%, #00E5FF 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.5rem', md: '2rem' },
          lineHeight: 1.2,
          mb: 1
        }}>
          {movie?.title}
        </Typography>

        {/* Meta row */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating value={(movie?.rating ?? 0) / 2} precision={0.5} readOnly size="small"
              sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }} />
            <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 700 }}>
              {movie?.rating?.toFixed(1)}/10
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 14, color: '#B8B8CD' }} />
            <Typography variant="body2" sx={{ color: '#B8B8CD' }}>
              {movie?.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#B8B8CD' }}>
            {(movie?.voteCount ?? 0).toLocaleString()} votes
          </Typography>
        </Box>

        {/* Genres */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
          {movie?.genres?.map((g, i) => (
            <Chip key={i} label={g} size="small" sx={{
              backgroundColor: 'rgba(255, 51, 102, 0.12)',
              color: '#FF3366',
              border: '1px solid rgba(255,51,102,0.3)',
              fontWeight: 600,
              fontSize: '0.7rem'
            }} />
          ))}
        </Box>

        <IconButton onClick={onClose} sx={{
          position: 'absolute', right: 12, top: 12,
          color: '#B8B8CD', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          '&:hover': { backgroundColor: 'rgba(255,51,102,0.2)', color: '#FF3366' }
        }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, md: 4 }, pt: 2, pb: 4 }}>
        {/* Overview */}
        <Typography variant="body1" sx={{ color: '#D0D0E0', lineHeight: 1.8, fontSize: '0.97rem', mb: 3 }}>
          {movie?.overview || 'No description available.'}
        </Typography>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

        {/* OTT Platforms Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>
              📺 Where to Watch
            </Typography>
            {region && (
              <Chip
                label={regionLabels[region] || region}
                size="small"
                sx={{ backgroundColor: 'rgba(0,229,255,0.1)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.3)', fontWeight: 600, fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <CircularProgress size={20} sx={{ color: '#FF3366' }} />
              <Typography variant="body2" sx={{ color: '#B8B8CD' }}>Fetching streaming info...</Typography>
            </Box>
          ) : hasProviders ? (
            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 3, p: 2.5, border: '1px solid rgba(255,255,255,0.05)' }}>
              {providerData?.flatrate && providerData.flatrate.length > 0 && (
                <ProviderRow
                  providers={providerData.flatrate}
                  label="Stream"
                  color="#00E5FF"
                  icon={<PlayCircle sx={{ fontSize: 16 }} />}
                />
              )}
              {providerData?.free && providerData.free.length > 0 && (
                <ProviderRow
                  providers={providerData.free}
                  label="Free"
                  color="#69FF47"
                  icon={<VideoLibrary sx={{ fontSize: 16 }} />}
                />
              )}
              {providerData?.rent && providerData.rent.length > 0 && (
                <>
                  {(providerData?.flatrate?.length ?? 0) > 0 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 2 }} />}
                  <ProviderRow
                    providers={providerData.rent}
                    label="Rent"
                    color="#FF9950"
                    icon={<VideoLibrary sx={{ fontSize: 16 }} />}
                  />
                </>
              )}
              {providerData?.buy && providerData.buy.length > 0 && (
                <>
                  {((providerData?.flatrate?.length ?? 0) > 0 || (providerData?.rent?.length ?? 0) > 0) && (
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 2 }} />
                  )}
                  <ProviderRow
                    providers={providerData.buy}
                    label="Buy"
                    color="#FF3366"
                    icon={<ShoppingCart sx={{ fontSize: 16 }} />}
                  />
                </>
              )}
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', display: 'block', mt: 2, fontSize: '0.65rem' }}>
                Powered by JustWatch · Data may vary by region
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 3, p: 3,
              border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#B8B8CD', fontSize: '0.9rem' }}>
                😕 No streaming info available for this title yet
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mt: 0.5 }}>
                Try searching the title directly on Netflix, Prime, or Hotstar
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}