import express from 'express'
import { body, validationResult } from 'express-validator'
import { Op } from 'sequelize'
import { protect, AuthRequest } from '../middleware/auth'
import { MovieNight } from '../models/MovieNight'
import { User } from '../models/User'
import { Movie } from '../models/Movie'

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
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, date, time, guests, theme, notes } = req.body

    const movieNight = await MovieNight.create({
      title,
      date,
      time,
      hostId: req.user.id,
      guests: guests || [],
      theme,
      notes,
      status: 'planned'
    })

    res.status(201).json({
      message: 'Movie night created successfully',
      movieNight
    })
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

    let where: any = { hostId: req.user.id }

    if (status === 'upcoming') {
      where.date = { [Op.gte]: now }
    } else if (status === 'past') {
      where.date = { [Op.lt]: now }
    }

    const movieNights = await MovieNight.findAll({
      where,
      include: [{
        model: Movie,
        as: 'movies',
        attributes: ['id', 'title', 'posterUrl', 'rating'],
        through: { attributes: [] }
      }],
      order: [['date', 'ASC'], ['time', 'ASC']]
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
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const updates = req.body

    const movieNight = await MovieNight.findOne({
      where: { id, hostId: req.user.id }
    })

    if (!movieNight) {
      return res.status(404).json({ message: 'Movie night not found' })
    }

    await movieNight.update(updates)

    res.json({
      message: 'Movie night updated successfully',
      movieNight
    })
  } catch (error) {
    console.error('Update movie night error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete a movie night
router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const { id } = req.params

    const movieNight = await MovieNight.findOne({
      where: { id, hostId: req.user.id }
    })

    if (!movieNight) {
      return res.status(404).json({ message: 'Movie night not found' })
    }

    await movieNight.destroy()

    res.json({
      message: 'Movie night deleted successfully'
    })
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
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { movieIds } = req.body

    const movieNight = await MovieNight.findOne({
      where: { id, hostId: req.user.id }
    })

    if (!movieNight) {
      return res.status(404).json({ message: 'Movie night not found' })
    }

    // Add movies (Sequelize helper for many-to-many)
    await (movieNight as any).addMovies(movieIds)

    const updatedMovieNight = await MovieNight.findByPk(id, {
      include: [{
        model: Movie,
        as: 'movies',
        attributes: ['id', 'title', 'posterUrl', 'rating'],
        through: { attributes: [] }
      }]
    })

    res.json({
      message: 'Movies added to movie night successfully',
      movieNight: updatedMovieNight
    })
  } catch (error) {
    console.error('Add movies to movie night error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
