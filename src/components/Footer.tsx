import { Box, Typography, IconButton, Link } from '@mui/material'
import { GitHub, LinkedIn, Email } from '@mui/icons-material'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 3,
        px: 2,
        background: '#ffffff',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Box display="flex" justifyContent="center" gap={2} mb={2}>
        <IconButton 
          component="a"
          href="https://github.com/eshika-s" 
          target="_blank"
          sx={{
            color: '#666666',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#1a1a1a',
            }
          }}
        >
          <GitHub />
        </IconButton>
        <IconButton 
          component="a"
          href="https://www.linkedin.com/in/eshika-shukla-608440331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
          target="_blank"
          sx={{
            color: '#666666',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#1a1a1a',
            }
          }}
        >
          <LinkedIn />
        </IconButton>
        <IconButton 
          component="a"
          href="mailto:eshika081@gmail.com"
          sx={{
            color: '#666666',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#1a1a1a',
            }
          }}
        >
          <Email />
        </IconButton>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="body2" sx={{ color: '#666666' }}>
          Data By
        </Typography>
        <img 
          src="/tmdb-logo.svg" 
          alt="TMDB Logo" 
          style={{ height: '20px' }} 
        />
      </Box>

      <Typography 
        variant="body2" 
        sx={{ 
          color: '#1a1a1a',
          fontWeight: 500,
        }}
      >
        Made by Eshika Shukla
      </Typography>
      
      <Typography variant="caption" sx={{ color: '#9ca3af', mt: 1 }}>
        {new Date().getFullYear()} Cinepick
      </Typography>
    </Box>
  )
}