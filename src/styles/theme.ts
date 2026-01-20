import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914', // Netflix red
      light: '#ff6b6b',
      dark: '#b20710',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#141414', // Netflix black
      paper: '#1f1f1f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#e50914',
    },
    warning: {
      main: '#f9a825',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f1f1f',
          border: '1px solid #333',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            borderColor: '#e50914',
            boxShadow: '0 8px 25px rgba(229, 9, 20, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
          transition: 'all 0.3s ease',
        },
        contained: {
          backgroundColor: '#e50914',
          '&:hover': {
            backgroundColor: '#b20710',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
          },
        },
        outlined: {
          borderColor: '#333',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#e50914',
            backgroundColor: 'rgba(229, 9, 20, 0.1)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #333',
        },
        indicator: {
          backgroundColor: '#e50914',
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#b3b3b3',
          '&.Mui-selected': {
            color: '#ffffff',
          },
          '&:hover': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #333',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1f1f1f',
            border: '1px solid #333',
            '&:hover': {
              borderColor: '#e50914',
            },
            '&.Mui-focused': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#b3b3b3',
            '&.Mui-focused': {
              color: '#e50914',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#444',
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#e50914',
        },
      },
    },
  },
})
