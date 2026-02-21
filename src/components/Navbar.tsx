import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  TextField,
  InputAdornment,
  Fade,
  useScrollTrigger,
} from '@mui/material'
import {
  Search as SearchIcon,
  AccountCircle,
  Logout,
  Settings,
  Person,
  Home,
  Movie,
  BookmarkBorder,
  TrendingUp,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  onSearch?: (query: string) => void
  activeView?: string
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, activeView }) => {
  const { state, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showSearch, setShowSearch] = useState(false)

  const trigger = useScrollTrigger({
    threshold: 100,
  })

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
  }

  const handleNavigation = (section: string) => {
    // Map section to view
    const viewMap = {
      'Browse': 'browse',
      'Mood Picker': 'mood',
      'Movie Discovery': 'discovery',
      'Movie Night Planner': 'planner',
      'Settings': 'settings'
    } as const

    const view = viewMap[section as keyof typeof viewMap]
    if (view) {
      // Dispatch custom event for App component
      window.dispatchEvent(new CustomEvent('navigate', { detail: { view } }))
    }
  }

  const handleLogoClick = () => {
    // Go to first tab (Browse Movies)
    handleNavigation('Browse')
  }

  const handleProfileClick = () => {
    handleMenuClose()
    // Navigate to profile or show profile modal
    console.log('Profile clicked')
  }

  const handleSettingsClick = () => {
    handleMenuClose()
    // Navigate to settings view
    handleNavigation('Settings')
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: trigger ? 'rgba(20, 20, 20, 0.98)' : 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: trigger ? '1px solid #333' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ minHeight: 68, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
          <Typography
            variant="h4"
            component="div"
            onClick={handleLogoClick}
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: '#FF3366',
              background: 'linear-gradient(135deg, #FF3366 0%, #00E5FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            CINEPICK
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 3,
          ml: 4,
          flexGrow: 1
        }}>
          <Button
            onClick={() => handleNavigation('Browse')}
            startIcon={<Home sx={{ fontSize: 18 }} />}
            sx={{
              color: activeView === 'browse' ? '#FF3366' : '#ffffff',
              background: activeView === 'browse' ? 'rgba(255, 51, 102, 0.1)' : 'transparent',
              fontWeight: activeView === 'browse' ? 700 : 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 51, 102, 0.15)',
                color: '#FF3366',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(255, 51, 102, 0.2)'
              },
            }}
          >
            Browse
          </Button>

          <Button
            onClick={() => handleNavigation('Mood Picker')}
            startIcon={<Movie sx={{ fontSize: 18 }} />}
            sx={{
              color: activeView === 'mood' ? '#00E5FF' : '#ffffff',
              background: activeView === 'mood' ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
              fontWeight: activeView === 'mood' ? 700 : 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              '&:hover': {
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                color: '#00E5FF',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.2)'
              },
            }}
          >
            Mood Picker
          </Button>

          <Button
            onClick={() => handleNavigation('Movie Discovery')}
            startIcon={<TrendingUp sx={{ fontSize: 18 }} />}
            sx={{
              color: activeView === 'discovery' ? '#FF3366' : '#ffffff',
              background: activeView === 'discovery' ? 'rgba(255, 51, 102, 0.1)' : 'transparent',
              fontWeight: activeView === 'discovery' ? 700 : 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 51, 102, 0.15)',
                color: '#FF3366',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(255, 51, 102, 0.2)'
              },
            }}
          >
            Movie Discovery
          </Button>

          <Button
            onClick={() => handleNavigation('Movie Night Planner')}
            startIcon={<BookmarkBorder sx={{ fontSize: 18 }} />}
            sx={{
              color: activeView === 'planner' ? '#00E5FF' : '#ffffff',
              background: activeView === 'planner' ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
              fontWeight: activeView === 'planner' ? 700 : 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 2,
              py: 1,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              '&:hover': {
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                color: '#00E5FF',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.2)'
              },
            }}
          >
            Movie Night Planner
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{
          display: { xs: showSearch ? 'flex' : 'none', md: 'flex' },
          alignItems: 'center',
          flexGrow: { xs: 0, md: 1 },
          maxWidth: { xs: '100%', md: 400 },
          mx: { xs: 0, md: 2 }
        }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#B8B8CD', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#ffffff',
                py: 1,
              },
            }}
          />
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Mobile Search Toggle */}
          <IconButton
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => setShowSearch(!showSearch)}
          >
            <SearchIcon />
          </IconButton>

          {/* User Menu */}
          {state.isAuthenticated ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#B8B8CD',
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500,
                  }}
                >
                  {state.user?.firstName || state.user?.username}
                </Typography>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background: 'linear-gradient(135deg, #FF3366 0%, #FF6B8B 100%)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 10px rgba(255, 51, 102, 0.3)'
                    }}
                  >
                    {(state.user?.firstName || state.user?.username || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                PaperProps={{
                  sx: {
                    backgroundColor: 'rgba(21, 21, 30, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 3,
                  },
                }}
              >
                <MenuItem
                  onClick={handleProfileClick}
                  sx={{
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    },
                  }}
                >
                  <Person sx={{ mr: 2, fontSize: 20 }} />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleSettingsClick}
                  sx={{
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    },
                  }}
                >
                  <Settings sx={{ mr: 2, fontSize: 20 }} />
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    },
                  }}
                >
                  <Logout sx={{ mr: 2, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #FF3366 0%, #FF6B8B 100%)',
                color: '#ffffff',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 3,
                boxShadow: '0 4px 14px 0 rgba(255, 51, 102, 0.39)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E60039 0%, #FF3366 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 51, 102, 0.5)',
                },
              }}
              onClick={() => {
                // Trigger sign in modal
                const event = new CustomEvent('open-auth-modal')
                window.dispatchEvent(event)
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
