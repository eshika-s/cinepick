import express from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import { generateToken, protect, AuthRequest } from '../middleware/auth'
import prisma from '../config/database'

const router = express.Router()

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 }),
  body('firstName').optional().trim(),
  body('lastName').optional().trim()
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, username, password, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' })
    }

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        isEmailVerified: false
      }
    })

    const token = generateToken(user.id.toString())

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    const token = generateToken(user.id.toString())

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// Get current user
router.get('/me', protect, async (req: AuthRequest, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { hostedMovieNights: true }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        movieNights: user.hostedMovieNights,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user preferences
router.put('/preferences', protect, [
  body('favoriteGenres').optional().isArray(),
  body('moodPreferences').optional().isArray(),
  body('ratingThreshold').optional().isFloat({ min: 0, max: 10 })
], async (req: AuthRequest, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { favoriteGenres, moodPreferences, ratingThreshold } = req.body
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const preferences: any = { ...(user.preferences as any || {}) }

    if (favoriteGenres) preferences.favoriteGenres = favoriteGenres
    if (moodPreferences) {
      preferences.moodPreferences = moodPreferences.map((pref: any) => ({
        ...pref,
        lastSelected: pref.lastSelected || new Date()
      }))
    }
    if (ratingThreshold !== undefined) preferences.ratingThreshold = ratingThreshold

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { preferences }
    })

    res.json({ message: 'Preferences updated successfully', preferences: updated.preferences })
  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user statistics
router.get('/stats', protect, async (req: AuthRequest, res: any) => {
  try {
    const [totalUsers, verifiedUsers, googleUsers, appleUsers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isEmailVerified: true } }),
      prisma.user.count({ where: { googleId: { not: null } } }),
      prisma.user.count({ where: { appleId: { not: null } } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { email: true, username: true, createdAt: true }
      })
    ])

    res.json({ totalUsers, verifiedUsers, googleUsers, appleUsers, recentUsers })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
