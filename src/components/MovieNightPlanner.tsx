import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip,
  Grid,
  IconButton,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { 
  CalendarToday,
  AccessTime,
  Group,
  Movie as MovieIcon,
  Add,
  Delete,
  Edit,
  Search
} from '@mui/icons-material'
import { Movie } from '../types/movie'

interface MovieNight {
  id: string
  title: string
  date: string
  time: string
  guests: string[]
  movies: Movie[]
  theme: string
  notes: string
}

interface MovieNightPlannerProps {
  movies: Movie[]
  requireAuth?: boolean
  onAuthRequired?: () => void
}

export default function MovieNightPlanner({ movies, requireAuth = false, onAuthRequired }: MovieNightPlannerProps) {
  const [movieNights, setMovieNights] = useState<MovieNight[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingNight, setEditingNight] = useState<MovieNight | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    guests: '',
    theme: '',
    notes: ''
  })

  const themes = [
    'Classic Movie Night',
    'Horror Marathon',
    'Comedy Fest',
    'Action Adventure',
    'Romantic Evening',
    'Sci-Fi Journey',
    'Documentary Night',
    'Family Fun'
  ]

  const handleOpenDialog = (night?: MovieNight) => {
    if (requireAuth && onAuthRequired) {
      onAuthRequired()
      return
    }
    
    if (night) {
      setEditingNight(night)
      setFormData({
        title: night.title,
        date: night.date,
        time: night.time,
        guests: night.guests.join(', '),
        theme: night.theme,
        notes: night.notes
      })
    } else {
      setEditingNight(null)
      setFormData({
        title: '',
        date: '',
        time: '',
        guests: '',
        theme: '',
        notes: ''
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingNight(null)
  }

  const handleSaveNight = () => {
    const newNight: MovieNight = {
      id: editingNight?.id || Date.now().toString(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      guests: formData.guests.split(',').map(g => g.trim()).filter(g => g),
      theme: formData.theme,
      notes: formData.notes,
      movies: editingNight?.movies || []
    }

    if (editingNight) {
      setMovieNights(prev => prev.map(n => n.id === editingNight.id ? newNight : n))
    } else {
      setMovieNights(prev => [...prev, newNight])
    }

    handleCloseDialog()
  }

  const deleteNight = (id: string) => {
    setMovieNights(prev => prev.filter(n => n.id !== id))
  }

  const upcomingNights = movieNights.filter(night => 
    new Date(`${night.date} ${night.time}`) > new Date()
  ).sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())

  const pastNights = movieNights.filter(night => 
    new Date(`${night.date} ${night.time}`) <= new Date()
  ).sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())

  return (
    <Box className="fade-in">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ 
          fontWeight: 700, 
          mb: 2,
          color: '#ffffff',
          fontSize: { xs: '2rem', md: '2.5rem' },
          background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🎬 Movie Night Planner
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#b3b3b3',
          maxWidth: '700px',
          mx: 'auto',
          fontSize: '1.1rem',
          lineHeight: 1.6,
          mb: 4
        }}>
          Create unforgettable movie nights! Schedule events, invite friends, and plan the perfect viewing experience.
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            borderRadius: '50px', 
            px: 5,
            py: 2,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1.1rem',
            backgroundColor: '#e50914',
            '&:hover': { 
              backgroundColor: '#f40612',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Create Movie Night
        </Button>
      </Box>

      {movieNights.length === 0 ? (
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
          border: '2px dashed #333',
          borderRadius: 4,
          textAlign: 'center',
          py: 10,
          px: 4,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: '#e50914',
            boxShadow: '0 8px 32px rgba(229, 9, 20, 0.2)',
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(229, 9, 20, 0.1) 0%, transparent 70%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <MovieIcon sx={{ 
              fontSize: '5rem', 
              color: '#666', 
              mb: 3,
              opacity: 0.8
            }} />
            <Typography variant="h5" sx={{ 
              color: '#ffffff', 
              mb: 2,
              fontWeight: 600
            }}>
              Ready for Movie Night Magic?
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#b3b3b3',
              mb: 4,
              fontSize: '1rem',
              maxWidth: '400px',
              mx: 'auto'
            }}>
              Your first movie night awaits! Click the button above to start planning an unforgettable cinema experience.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderColor: '#e50914',
                color: '#e50914',
                '&:hover': {
                  backgroundColor: '#e50914',
                  color: '#ffffff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Plan Your First Movie Night
            </Button>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {/* Upcoming Movie Nights */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 4,
              pb: 2,
              borderBottom: '2px solid #333'
            }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e50914, #ff6b6b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)'
              }}>
                <CalendarToday sx={{ fontSize: '1.5rem', color: '#ffffff' }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#ffffff',
                fontSize: '1.5rem'
              }}>
                Upcoming Movie Nights
              </Typography>
            </Box>
            
            {upcomingNights.length === 0 ? (
              <Card sx={{ 
                background: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  No upcoming movie nights
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingNights.map((night) => (
                  <Card key={night.id} sx={{ 
                    background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                    border: '1px solid #333',
                    borderRadius: 4,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#e50914',
                      boxShadow: '0 12px 40px rgba(229, 9, 20, 0.25)',
                      transform: 'translateY(-6px) scale(1.02)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #e50914, #ff6b6b)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: '#ffffff',
                        mb: 1
                      }}>
                        {night.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(night)}
                          sx={{ 
                            backgroundColor: 'rgba(229, 9, 20, 0.1)',
                            color: '#e50914',
                            '&:hover': { 
                              backgroundColor: '#e50914',
                              color: '#ffffff',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Edit sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteNight(night.id)}
                          sx={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            '&:hover': { 
                              backgroundColor: '#ef4444',
                              color: '#ffffff',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Delete sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: '0.9rem', color: '#b3b3b3' }} />
                        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                          {new Date(night.date).toLocaleDateString()} at {night.time}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Group sx={{ fontSize: '0.9rem', color: '#b3b3b3' }} />
                        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                          {night.guests.length > 0 ? night.guests.join(', ') : 'No guests yet'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {night.theme && (
                      <Chip
                        label={night.theme}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(229, 9, 20, 0.1)',
                          color: '#e50914',
                          border: '1px solid rgba(229, 9, 20, 0.3)',
                          mb: 2,
                          fontWeight: 500
                        }}
                      />
                    )}
                    
                    {night.movies.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {night.movies.slice(0, 3).map((movie) => (
                          <Avatar
                            key={movie.id}
                            src={movie.posterUrl}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                        ))}
                        {night.movies.length > 3 && (
                          <Avatar
                            variant="rounded"
                            sx={{ 
                              width: 40, 
                              height: 40,
                              backgroundColor: '#f3f4f6',
                              color: '#666666',
                              fontSize: '0.8rem'
                            }}
                          >
                            +{night.movies.length - 3}
                          </Avatar>
                        )}
                      </Box>
                    )}
                    
                    {night.notes && (
                      <Typography variant="body2" sx={{ 
                        color: '#b3b3b3',
                        fontStyle: 'italic',
                        fontSize: '0.9rem'
                      }}>
                        {night.notes}
                      </Typography>
                    )}
                  </Card>
                ))}
              </Box>
            )}
          </Grid>

          {/* Past Movie Nights */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 4,
              pb: 2,
              borderBottom: '2px solid #333'
            }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #666, #999)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(102, 102, 102, 0.3)'
              }}>
                <MovieIcon sx={{ fontSize: '1.5rem', color: '#ffffff' }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#ffffff',
                fontSize: '1.5rem'
              }}>
                Past Movie Nights
              </Typography>
            </Box>
            
            {pastNights.length === 0 ? (
              <Card sx={{ 
                background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                border: '1px solid #333',
                borderRadius: 3,
                p: 3,
                textAlign: 'center',
                opacity: 0.7
              }}>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  No past movie nights
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {pastNights.map((night) => (
                  <Card key={night.id} sx={{ 
                    background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                    border: '1px solid #333',
                    borderRadius: 4,
                    p: 3,
                    opacity: 0.7,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 0.9,
                      borderColor: '#666'
                    }
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: '#ffffff',
                      mb: 1
                    }}>
                      {night.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
                      {new Date(night.date).toLocaleDateString()}
                    </Typography>
                    
                    {night.movies.length > 0 && (
                      <Typography variant="body2" sx={{ color: '#6366f1' }}>
                        {night.movies.length} movie{night.movies.length > 1 ? 's' : ''} watched
                      </Typography>
                    )}
                  </Card>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth 
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
            border: '1px solid #333',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
          }
        }}>
        <DialogTitle sx={{ 
          backgroundColor: 'transparent',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '1.5rem',
          pb: 2
        }}>
          {editingNight ? 'Edit Movie Night' : 'Create Movie Night'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: 'transparent', color: '#ffffff' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#e50914' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' }
                },
                '& .MuiInputLabel-root': { color: '#b3b3b3' },
                '& .MuiOutlinedInput-input': { color: '#ffffff' }
              }}
            />
            
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#e50914' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' }
                },
                '& .MuiInputLabel-root': { color: '#b3b3b3' },
                '& .MuiOutlinedInput-input': { color: '#ffffff' }
              }}
            />
            
            <TextField
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#e50914' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' }
                },
                '& .MuiInputLabel-root': { color: '#b3b3b3' },
                '& .MuiOutlinedInput-input': { color: '#ffffff' }
              }}
            />
            
            <TextField
              label="Guests (comma separated)"
              value={formData.guests}
              onChange={(e) => setFormData({...formData, guests: e.target.value})}
              placeholder="John, Jane, Bob"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#e50914' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' }
                },
                '& .MuiInputLabel-root': { color: '#b3b3b3' },
                '& .MuiOutlinedInput-input': { color: '#ffffff' }
              }}
            />
            
            <TextField
              label="Theme"
              select
              value={formData.theme}
              onChange={(e) => setFormData({...formData, theme: e.target.value})}
              fullWidth
              SelectProps={{
                native: true
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#e50914' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' }
                },
                '& .MuiInputLabel-root': { color: '#b3b3b3' },
                '& .MuiOutlinedInput-input': { color: '#ffffff' }
              }}
            >
              <option value="">Select a theme</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </TextField>
            
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any special notes or reminders..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#e50914' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' }
                },
                '& .MuiInputLabel-root': { color: '#b3b3b3' },
                '& .MuiOutlinedInput-input': { color: '#ffffff' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          backgroundColor: 'transparent',
          pt: 3,
          gap: 2
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#b3b3b3',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              '&:hover': { 
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNight} 
            variant="contained"
            sx={{
              backgroundColor: '#e50914',
              fontWeight: 600,
              textTransform: 'none',
              px: 4,
              '&:hover': { 
                backgroundColor: '#f40612',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {editingNight ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
