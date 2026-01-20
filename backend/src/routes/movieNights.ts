import express from 'express'
import { body, validationResult } from 'express-validator'
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

    const movieNight = new MovieNight({
      title,
      date,
      time,
      host: req.user._id,
      guests: guests || [],
      movies: [],
      theme,
      notes
    })

    await movieNight.save()

    // Add to user's movie nights
    const user = await User.findById(req.user._id)
    if (user) {
      user.movieNights.push(movieNight._id)
      await user.save()
    }

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

    let query: any = { host: req.user._id }
    
    if (status === 'upcoming') {
      query.date = { $gte: now }
    } else if (status === 'past') {
      query.date = { $lt: now }
    }

    const movieNights = await MovieNight.find(query)
      .populate('movies', 'title posterUrl rating')
      .sort({ date: 1, time: 1 })

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

    const movieNight = await MovieNight.findOneAndUpdate(
      { _id: id, host: req.user._id },
      updates,
      { new: true, runValidators: true }
    )

    if (!movieNight) {
      return res.status(404).json({ message: 'Movie night not found' })
    }

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

    const movieNight = await MovieNight.findOneAndDelete({
      _id: id,
      host: req.user._id
    })

    if (!movieNight) {
      return res.status(404).json({ message: 'Movie night not found' })
    }

    // Remove from user's movie nights
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { movieNights: id }
    })

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

    // Verify movies exist
    const movies = await Movie.find({ _id: { $in: movieIds } })
    if (movies.length !== movieIds.length) {
      return res.status(400).json({ message: 'Some movies not found' })
    }

    const movieNight = await MovieNight.findOneAndUpdate(
      { _id: id, host: req.user._id },
      { $addToSet: { movies: { $each: movieIds } } },
      { new: true }
    ).populate('movies', 'title posterUrl rating')

    if (!movieNight) {
      return res.status(404).json({ message: 'Movie night not found' })
    }

    res.json({
      message: 'Movies added to movie night successfully',
      movieNight
    })
  } catch (error) {
    console.error('Add movies to movie night error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
