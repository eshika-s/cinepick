"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const auth_1 = require("../middleware/auth");
const MovieNight_1 = require("../models/MovieNight");
const Movie_1 = require("../models/Movie");
const router = express_1.default.Router();
// Create a new movie night
router.post('/', auth_1.protect, [
    (0, express_validator_1.body)('title').notEmpty().trim(),
    (0, express_validator_1.body)('date').isISO8601().toDate(),
    (0, express_validator_1.body)('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    (0, express_validator_1.body)('guests').optional().isArray(),
    (0, express_validator_1.body)('theme').optional().trim(),
    (0, express_validator_1.body)('notes').optional().trim()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, date, time, guests, theme, notes } = req.body;
        const movieNight = await MovieNight_1.MovieNight.create({
            title,
            date,
            time,
            hostId: req.user.id,
            guests: guests || [],
            theme,
            notes,
            status: 'planned'
        });
        res.status(201).json({
            message: 'Movie night created successfully',
            movieNight
        });
    }
    catch (error) {
        console.error('Create movie night error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user's movie nights
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const { status } = req.query;
        const now = new Date();
        let where = { hostId: req.user.id };
        if (status === 'upcoming') {
            where.date = { [sequelize_1.Op.gte]: now };
        }
        else if (status === 'past') {
            where.date = { [sequelize_1.Op.lt]: now };
        }
        const movieNights = await MovieNight_1.MovieNight.findAll({
            where,
            include: [{
                    model: Movie_1.Movie,
                    as: 'movies',
                    attributes: ['id', 'title', 'posterUrl', 'rating'],
                    through: { attributes: [] }
                }],
            order: [['date', 'ASC'], ['time', 'ASC']]
        });
        res.json({ movieNights });
    }
    catch (error) {
        console.error('Get movie nights error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update a movie night
router.put('/:id', auth_1.protect, [
    (0, express_validator_1.body)('title').optional().notEmpty().trim(),
    (0, express_validator_1.body)('date').optional().isISO8601().toDate(),
    (0, express_validator_1.body)('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    (0, express_validator_1.body)('guests').optional().isArray(),
    (0, express_validator_1.body)('theme').optional().trim(),
    (0, express_validator_1.body)('notes').optional().trim()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const updates = req.body;
        const movieNight = await MovieNight_1.MovieNight.findOne({
            where: { id, hostId: req.user.id }
        });
        if (!movieNight) {
            return res.status(404).json({ message: 'Movie night not found' });
        }
        await movieNight.update(updates);
        res.json({
            message: 'Movie night updated successfully',
            movieNight
        });
    }
    catch (error) {
        console.error('Update movie night error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete a movie night
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const { id } = req.params;
        const movieNight = await MovieNight_1.MovieNight.findOne({
            where: { id, hostId: req.user.id }
        });
        if (!movieNight) {
            return res.status(404).json({ message: 'Movie night not found' });
        }
        await movieNight.destroy();
        res.json({
            message: 'Movie night deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete movie night error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Add movies to a movie night
router.post('/:id/movies', auth_1.protect, [
    (0, express_validator_1.body)('movieIds').isArray({ min: 1 })
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { movieIds } = req.body;
        const movieNight = await MovieNight_1.MovieNight.findOne({
            where: { id, hostId: req.user.id }
        });
        if (!movieNight) {
            return res.status(404).json({ message: 'Movie night not found' });
        }
        // Add movies (Sequelize helper for many-to-many)
        await movieNight.addMovies(movieIds);
        const updatedMovieNight = await MovieNight_1.MovieNight.findByPk(id, {
            include: [{
                    model: Movie_1.Movie,
                    as: 'movies',
                    attributes: ['id', 'title', 'posterUrl', 'rating'],
                    through: { attributes: [] }
                }]
        });
        res.json({
            message: 'Movies added to movie night successfully',
            movieNight: updatedMovieNight
        });
    }
    catch (error) {
        console.error('Add movies to movie night error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=movieNights.js.map