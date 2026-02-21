import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF3366', // Vibrant Pink-Red
      light: '#FF6B8B',
      dark: '#E60039',
    },
    secondary: {
      main: '#00E5FF', // Vibrant Cyan
      light: '#33EAFF',
      dark: '#00B2CC',
    },
    background: {
      default: '#0A0A0F', // Very deep rich background
      paper: '#15151E', // Slightly lighter card background
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B8B8CD',
    },
    error: {
      main: '#FF3B30',
    },
    warning: {
      main: '#FF9500',
    },
    info: {
      main: '#5E5CE6',
    },
    success: {
      main: '#34C759',
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(255, 51, 102, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 229, 255, 0.05), transparent 25%)',
          backgroundAttachment: 'fixed',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(21, 21, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: 'rgba(255, 51, 102, 0.4)',
            boxShadow: '0 12px 30px -10px rgba(255, 51, 102, 0.3), 0 4px 10px -5px rgba(0, 229, 255, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 28px',
          transition: 'all 0.3s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #FF3366 0%, #FF6B8B 100%)',
          boxShadow: '0 4px 14px 0 rgba(255, 51, 102, 0.39)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E60039 0%, #FF3366 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(255, 51, 102, 0.5)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#FF3366',
            backgroundColor: 'rgba(255, 51, 102, 0.1)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        },
        indicator: {
          backgroundColor: '#FF3366',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1.05rem',
          color: '#B8B8CD',
          transition: 'all 0.2s',
          '&.Mui-selected': {
            color: '#FFFFFF',
          },
          '&:hover': {
            color: '#FFFFFF',
            backgroundColor: 'rgba(255,255,255,0.02)'
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 15, 0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 12,
            transition: 'all 0.3s',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 51, 102, 0.3)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid #FF3366',
              boxShadow: '0 0 0 2px rgba(255, 51, 102, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B8B8CD',
            '&.Mui-focused': {
              color: '#FF3366',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: '#ffffff',
          borderRadius: 8,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#00E5FF',
        },
      },
    },
  },
})
