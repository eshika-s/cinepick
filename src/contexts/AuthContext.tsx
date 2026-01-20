import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import apiService from '../services/api'

interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  isEmailVerified: boolean
  preferences: {
    favoriteGenres: string[]
    moodPreferences: Array<{
      mood: string
      weight: number
      lastSelected: string
    }>
    dislikedMovies: string[]
    likedMovies: string[]
    watchlist: string[]
    ratingThreshold: number
  }
  movieNights: string[]
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  loginWithToken: (user: any, token: string) => void
  register: (userData: {
    email: string
    username: string
    password: string
    firstName?: string
    lastName?: string
  }) => Promise<void>
  logout: () => void
  clearError: () => void
  updateUser: (updates: Partial<User>) => void
  refreshUser: () => Promise<void>
  updatePreferences: (preferences: {
    favoriteGenres?: string[]
    moodPreferences?: Array<{
      mood: string
      weight: number
      lastSelected?: string
    }>
    ratingThreshold?: number
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' })
          const response = await apiService.getCurrentUser()
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.user, token },
          })
        } catch (error) {
          localStorage.removeItem('token')
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' })
        }
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await apiService.login({ email, password })
      
      localStorage.setItem('token', response.token)
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const loginWithToken = (user: any, token: string) => {
    localStorage.setItem('token', token)
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user, token },
    })
  }

  const register = async (userData: {
    email: string
    username: string
    password: string
    firstName?: string
    lastName?: string
  }) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await apiService.register(userData)
      
      localStorage.setItem('token', response.token)
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const updateUser = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates })
  }

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser()
      updateUser(response.user)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }

  const updatePreferences = async (preferences: {
    favoriteGenres?: string[]
    moodPreferences?: Array<{
      mood: string
      weight: number
      lastSelected?: string
    }>
    ratingThreshold?: number
  }) => {
    try {
      const response = await apiService.updatePreferences(preferences)
      updateUser({ preferences: response.preferences })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const value: AuthContextType = {
    state,
    login,
    loginWithToken,
    register,
    logout,
    clearError,
    updateUser,
    refreshUser,
    updatePreferences,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
