import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  TextField,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Person,
  Email,
  Notifications,
  DarkMode,
  Language,
  Delete,
  Edit,
  Save,
  Cancel,
  Privacy,
  Security,
  Help,
  Logout,
  Movie,
  Favorite,
  BookmarkBorder,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <Card sx={{ mb: 3, backgroundColor: '#1f1f1f', border: '1px solid #333' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}

export default function Settings() {
  const { state, logout, updateUser, updatePreferences } = useAuth()
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
  })

  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: true,
    language: 'en',
    autoPlay: true,
    hdQuality: true,
    showMatureContent: false,
    favoriteGenres: state.user?.preferences?.favoriteGenres || [],
    ratingThreshold: state.user?.preferences?.ratingThreshold || 6.0,
  })

  const handleSaveProfile = async () => {
    try {
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      setEditMode(false)
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' })
    }
  }

  const handleSavePreferences = async () => {
    try {
      await updatePreferences({
        favoriteGenres: preferences.favoriteGenres,
        ratingThreshold: preferences.ratingThreshold,
      })
      setSnackbar({ open: true, message: 'Preferences saved successfully!', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save preferences', severity: 'error' })
    }
  }

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDeleteAccount = () => {
    // TODO: Implement account deletion
    setDeleteDialogOpen(false)
    logout()
    setSnackbar({ open: true, message: 'Account deleted successfully', severity: 'success' })
  }

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation',
    'Documentary', 'Fantasy', 'Mystery', 'Adventure', 'Family', 'Crime', 'War', 'Western'
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ fontSize: 32, color: '#e50914', mr: 2 }} />
        <Typography variant="h3" component="h1" sx={{ color: '#ffffff', fontWeight: 700 }}>
          Settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Profile Settings */}
          <SettingsSection title="Profile Information">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: '#e50914' }}>
                {state.user?.firstName?.[0] || state.user?.email?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: '#ffffff' }}>
                  {state.user?.firstName} {state.user?.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                  {state.user?.email}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Member since {new Date(state.user?.createdAt || '').toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {editMode ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveProfile}
                    sx={{ bgcolor: '#e50914' }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => setEditMode(false)}
                    sx={{ color: '#ffffff', borderColor: '#333' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
                sx={{ color: '#ffffff', borderColor: '#333' }}
              >
                Edit Profile
              </Button>
            )}
          </SettingsSection>

          {/* Preferences */}
          <SettingsSection title="Movie Preferences">
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 2 }}>
                Favorite Genres
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    clickable
                    color={preferences.favoriteGenres.includes(genre) ? 'primary' : 'default'}
                    onClick={() => {
                      const newGenres = preferences.favoriteGenres.includes(genre)
                        ? preferences.favoriteGenres.filter(g => g !== genre)
                        : [...preferences.favoriteGenres, genre]
                      setPreferences({ ...preferences, favoriteGenres: newGenres })
                    }}
                    sx={{
                      backgroundColor: preferences.favoriteGenres.includes(genre) ? '#e50914' : '#333',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: preferences.favoriteGenres.includes(genre) ? '#ff1744' : '#444',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>
                Minimum Rating Threshold: {preferences.ratingThreshold}
              </Typography>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={preferences.ratingThreshold}
                onChange={(e) => setPreferences({ ...preferences, ratingThreshold: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleSavePreferences}
                sx={{ bgcolor: '#e50914' }}
              >
                Save Preferences
              </Button>
            </Box>
          </SettingsSection>

          {/* App Settings */}
          <SettingsSection title="App Settings">
            <List sx={{ bgcolor: 'transparent' }}>
              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive notifications about new movies and recommendations"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.notifications}
                    onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#e50914',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#e50914',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Dark Mode"
                  secondary="Use dark theme throughout the app"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.darkMode}
                    onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#e50914',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#e50914',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Auto-play Trailers"
                  secondary="Automatically play trailers when viewing movie details"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.autoPlay}
                    onChange={(e) => setPreferences({ ...preferences, autoPlay: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#e50914',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#e50914',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="HD Quality"
                  secondary="Prefer HD quality when streaming"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.hdQuality}
                    onChange={(e) => setPreferences({ ...preferences, hdQuality: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#e50914',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#e50914',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Show Mature Content"
                  secondary="Include R-rated and mature content in recommendations"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.showMatureContent}
                    onChange={(e) => setPreferences({ ...preferences, showMatureContent: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#e50914',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#e50914',
                      },
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsSection>

          {/* Account Actions */}
          <SettingsSection title="Account Actions">
            <List sx={{ bgcolor: 'transparent' }}>
              <ListItem button>
                <Security sx={{ mr: 2, color: '#b3b3b3' }} />
                <ListItemText
                  primary="Change Password"
                  secondary="Update your account password"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
              </ListItem>

              <ListItem button>
                <Privacy sx={{ mr: 2, color: '#b3b3b3' }} />
                <ListItemText
                  primary="Privacy Settings"
                  secondary="Manage your privacy and data preferences"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
              </ListItem>

              <ListItem button onClick={handleDeleteAccount}>
                <Delete sx={{ mr: 2, color: '#e50914' }} />
                <ListItemText
                  primary="Delete Account"
                  secondary="Permanently delete your account and all data"
                  primaryTypographyProps={{ color: '#e50914' }}
                  secondaryTypographyProps={{ color: '#ff6b6b' }}
                />
              </ListItem>

              <Divider sx={{ my: 2, borderColor: '#333' }} />

              <ListItem button onClick={logout}>
                <Logout sx={{ mr: 2, color: '#b3b3b3' }} />
                <ListItemText
                  primary="Sign Out"
                  secondary="Sign out of your account"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
              </ListItem>
            </List>
          </SettingsSection>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Quick Stats */}
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#1f1f1f', border: '1px solid #333' }}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
              Your Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Favorite sx={{ color: '#e50914' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    {state.user?.preferences?.likedMovies?.length || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                    Liked Movies
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BookmarkBorder sx={{ color: '#e50914' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    {state.user?.preferences?.watchlist?.length || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                    Watchlist
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Movie sx={{ color: '#e50914' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    {state.user?.movieNights?.length || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                    Movie Nights
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Help & Support */}
          <Paper sx={{ p: 3, backgroundColor: '#1f1f1f', border: '1px solid #333' }}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
              Help & Support
            </Typography>
            <List sx={{ bgcolor: 'transparent' }}>
              <ListItem button>
                <Help sx={{ mr: 2, color: '#b3b3b3' }} />
                <ListItemText
                  primary="Help Center"
                  secondary="Get help with common issues"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
              </ListItem>
              <ListItem button>
                <Email sx={{ mr: 2, color: '#b3b3b3' }} />
                <ListItemText
                  primary="Contact Support"
                  secondary="Get in touch with our team"
                  primaryTypographyProps={{ color: '#ffffff' }}
                  secondaryTypographyProps={{ color: '#b3b3b3' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#ffffff', bgcolor: '#1f1f1f' }}>
          Delete Account
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1f1f1f' }}>
          <Typography sx={{ color: '#b3b3b3' }}>
            Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including:
          </Typography>
          <List sx={{ mt: 2 }}>
            <ListItem sx={{ color: '#b3b3b3' }}>• Profile information</ListItem>
            <ListItem sx={{ color: '#b3b3b3' }}>• Watchlist and liked movies</ListItem>
            <ListItem sx={{ color: '#b3b3b3' }}>• Movie night plans</ListItem>
            <ListItem sx={{ color: '#b3b3b3' }}>• Preferences and settings</ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1f1f1f' }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#ffffff' }}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
