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
  Tooltip
} from '@mui/material'
import { 
  Movie as MovieIcon, 
  Theaters, 
  SentimentVerySatisfied,
  LocalFireDepartment,
  Nightlight,
  Psychology,
  Favorite,
  AutoAwesome
} from '@mui/icons-material'

interface MoodPickerProps {
  onMoodSelect: (mood: string, description: string) => void
  selectedMood: string
}

const moods = [
  {
    id: 'happy',
    name: 'Happy & Uplifting',
    description: 'Feel-good movies that will brighten your day',
    icon: <SentimentVerySatisfied />,
    color: '#fbbf24',
    keywords: ['comedy', 'adventure', 'family']
  },
  {
    id: 'thriller',
    name: 'Edge of Your Seat',
    description: 'Suspenseful thrillers that keep you guessing',
    icon: <LocalFireDepartment />,
    color: '#ef4444',
    keywords: ['thriller', 'mystery', 'crime']
  },
  {
    id: 'cozy',
    name: 'Cozy & Relaxing',
    description: 'Perfect movies for a quiet night in',
    icon: <Nightlight />,
    color: '#8b5cf6',
    keywords: ['drama', 'romance', 'documentary']
  },
  {
    id: 'mindbending',
    name: 'Mind-Bending',
    description: 'Movies that make you think and question reality',
    icon: <Psychology />,
    color: '#06b6d4',
    keywords: ['sci-fi', 'mystery', 'thriller']
  },
  {
    id: 'romantic',
    name: 'Romantic & Heartwarming',
    description: 'Love stories that touch your heart',
    icon: <Favorite />,
    color: '#ec4899',
    keywords: ['romance', 'drama', 'comedy']
  },
  {
    id: 'epic',
    name: 'Epic Adventures',
    description: 'Grand adventures and epic journeys',
    icon: <AutoAwesome />,
    color: '#10b981',
    keywords: ['action', 'adventure', 'fantasy']
  }
]

export default function MoodPicker({ onMoodSelect, selectedMood }: MoodPickerProps) {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)

  return (
    <Box className="fade-in">
      <Typography variant="h4" component="h2" sx={{ 
        mb: 3, 
        fontWeight: 700,
        textAlign: 'center',
        color: '#ffffff',
        fontSize: { xs: '2rem', md: '2.5rem' }
      }}>
        How are you feeling today?
      </Typography>
      
      <Typography variant="body1" sx={{ 
        mb: 4, 
        textAlign: 'center',
        color: '#b3b3b3',
        maxWidth: '600px',
        mx: 'auto',
        fontSize: '1.1rem',
        lineHeight: 1.6
      }}>
        Pick a mood and we'll recommend the perfect movies for your current vibe
      </Typography>

      <Grid container spacing={3}>
        {moods.map((mood) => (
          <Grid item xs={12} sm={6} md={4} key={mood.id}>
            <Card
              onClick={() => onMoodSelect(mood.id, mood.description)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              sx={{
                cursor: 'pointer',
                border: selectedMood === mood.id ? '2px solid' : '1px solid',
                borderColor: selectedMood === mood.id ? mood.color : '#333',
                background: selectedMood === mood.id ? `${mood.color}15` : '#1f1f1f',
                transform: hoveredMood === mood.id ? 'translateY(-4px) scale(1.02)' : 'translateY(0)',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: `0 8px 25px ${mood.color}30`,
                  borderColor: mood.color,
                }
              }}
            >
              <CardContent sx={{ flex: 1, textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  fontSize: '3rem', 
                  color: mood.color, 
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  filter: selectedMood === mood.id ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                }}>
                  {mood.icon}
                </Box>
                
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 1, 
                  color: '#ffffff',
                  fontSize: '1.1rem'
                }}>
                  {mood.name}
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  color: '#b3b3b3', 
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  {mood.description}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.5, 
                  mt: 2, 
                  justifyContent: 'center'
                }}>
                  {mood.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      size="small"
                      sx={{
                        backgroundColor: `${mood.color}20`,
                        color: mood.color,
                        border: `1px solid ${mood.color}40`,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: `${mood.color}30`,
                        }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => onMoodSelect('', '')}
          sx={{
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            px: 3
          }}
        >
          Show All Movies
        </Button>
      </Box>
    </Box>
  )
}
