import express from 'express'
import { body, validationResult } from 'express-validator'
import { protect, AuthRequest } from '../middleware/auth'
import prisma from '../config/database'

const router = express.Router()

// Create a new movie night
router.post('/', protect, [
  body('title').notEmpty().trim(),
  body('date').isISO8601().toDate(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('guests').optional().isArray(),
  body('theme').optional().trim(),
  body('notes').optional().trim()
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { title, date, time, guests, theme, notes } = req.body

    const movieNight = await prisma.movieNight.create({
      data: {
        title,
        date: new Date(date),
        time,
        hostId: req.user.id,
        guests: guests || [],
        theme,
        notes,
        status: 'planned'
      }
    })

    res.status(201).json({ message: 'Movie night created successfully', movieNight })
  } catch (error) {
    console.error('Create movie night error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's movie nights
router.get('/', protect, async (req: any, res: any) => {
  try {
    const { status } = req.query
    const now = new Date()

    const where: any = { hostId: req.user.id }
    if (status === 'upcoming') where.date = { gte: now }
    else if (status === 'past') where.date = { lt: now }

    const movieNights = await prisma.movieNight.findMany({
      where,
      include: {
        movies: {
          select: { id: true, title: true, posterUrl: true, rating: true }
        }
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }]
    })

    res.json({ movieNights })
  } catch (error) {
    console.error('Get movie nights error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update a movie night
router.put('/:id', protect, [
  body('title').optional().notEmpty().trim(),
  body('date').optional().isISO8601().toDate(),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('guests').optional().isArray(),
  body('theme').optional().trim(),
  body('notes').optional().trim()
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { id } = req.params
    const { title, date, time, guests, theme, notes, status } = req.body

    const movieNight = await prisma.movieNight.findFirst({
      where: { id: parseInt(id), hostId: req.user.id }
    })

    if (!movieNight) return res.status(404).json({ message: 'Movie night not found' })

    const updated = await prisma.movieNight.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(guests && { guests }),
        ...(theme !== undefined && { theme }),
        ...(notes !== undefined && { notes }),
        ...(status && { status })
      }
    })

    res.json({ message: 'Movie night updated successfully', movieNight: updated })
  } catch (error) {
    console.error('Update movie night error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete a movie night
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const { id } = req.params

    const movieNight = await prisma.movieNight.findFirst({
      where: { id: parseInt(id), hostId: req.user.id }
    })

    if (!movieNight) return res.status(404).json({ message: 'Movie night not found' })

    await prisma.movieNight.delete({ where: { id: parseInt(id) } })

    res.json({ message: 'Movie night deleted successfully' })
  } catch (error) {
    console.error('Delete movie night error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add movies to a movie night
router.post('/:id/movies', protect, [
  body('movieIds').isArray({ min: 1 })
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { id } = req.params
    const { movieIds } = req.body

    const movieNight = await prisma.movieNight.findFirst({
      where: { id: parseInt(id), hostId: req.user.id }
    })

    if (!movieNight) return res.status(404).json({ message: 'Movie night not found' })

    const updated = await prisma.movieNight.update({
      where: { id: parseInt(id) },
      data: {
        movies: {
          connect: movieIds.map((mId: number) => ({ id: mId }))
        }
      },
      include: {
        movies: {
          select: { id: true, title: true, posterUrl: true, rating: true }
        }
      }
    })

    res.json({ message: 'Movies added to movie night successfully', movieNight: updated })
  } catch (error) {
    console.error('Add movies to movie night error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
