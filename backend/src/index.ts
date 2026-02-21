import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables first
dotenv.config()

import { connectToDb } from './config/database'
import { passport } from './config/passport'
import { generateToken } from './middleware/auth'
import authRoutes from './routes/auth'
import movieRoutes from './routes/movies'
import recommendationRoutes from './routes/recommendations'
import movieNightRoutes from './routes/movieNights'

const app = express()

// Security middleware
app.use(helmet())
app.use(compression())

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:5173',
  'http://localhost:5174'
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute for development
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200'), // 200 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Passport initialization
app.use(passport.initialize())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api/movie-nights', movieNightRoutes)

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken((req.user as any).id.toString())
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  }
)

// Apple Sign In routes
app.get('/api/auth/apple', passport.authenticate('apple'))
app.post('/api/auth/apple/callback',
  passport.authenticate('apple', { session: false }),
  (req, res) => {
    const token = generateToken((req.user as any).id.toString())
    res.json({ token })
  }
)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectToDb()
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📚 Environment: ${process.env.NODE_ENV}`)
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
