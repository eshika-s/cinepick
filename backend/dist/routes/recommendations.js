"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const Movie_1 = require("../models/Movie");
const router = express_1.default.Router();
// Get mood-based recommendations
router.get('/mood/:mood', auth_1.protect, async (req, res) => {
    try {
        const { mood } = req.params;
        const validMoods = ['happy', 'thriller', 'cozy', 'mindbending', 'romantic', 'epic'];
        if (!validMoods.includes(mood)) {
            return res.status(400).json({ message: 'Invalid mood' });
        }
        // Update user's mood preference
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const preferences = user.preferences || {
            favoriteGenres: [],
            moodPreferences: [],
            dislikedMovies: [],
            likedMovies: [],
            watchlist: [],
            ratingThreshold: 6.0
        };
        const moodPreferences = [...(preferences.moodPreferences || [])];
        const existingIndex = moodPreferences.findIndex((p) => p.mood === mood);
        if (existingIndex !== -1) {
            moodPreferences[existingIndex] = {
                ...moodPreferences[existingIndex],
                weight: Math.min(moodPreferences[existingIndex].weight + 0.1, 5),
                lastSelected: new Date()
            };
        }
        else {
            moodPreferences.push({
                mood,
                weight: 1,
                lastSelected: new Date()
            });
        }
        user.preferences = { ...preferences, moodPreferences };
        await user.save();
        // Get movies based on mood
        const moodGenreMap = {
            happy: ['comedy', 'adventure', 'family'],
            thriller: ['thriller', 'mystery', 'crime'],
            cozy: ['drama', 'romance', 'documentary'],
            mindbending: ['sci-fi', 'mystery', 'thriller'],
            romantic: ['romance', 'drama', 'comedy'],
            epic: ['action', 'adventure', 'fantasy']
        };
        const genres = moodGenreMap[mood];
        const movies = await Movie_1.Movie.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        [sequelize_1.Op.or]: [
                            { moodTags: { [sequelize_1.Op.like]: `%${mood}%` } },
                            { genres: { [sequelize_1.Op.or]: genres.map(g => ({ [sequelize_1.Op.like]: `%${g}%` })) } }
                        ]
                    },
                    { rating: { [sequelize_1.Op.gte]: preferences.ratingThreshold || 6.0 } }
                ]
            },
            order: [['rating', 'DESC'], ['popularity', 'DESC']],
            limit: 20
        });
        res.json({
            mood,
            movies,
            userWeight: moodPreferences.find((p) => p.mood === mood)?.weight || 1
        });
    }
    catch (error) {
        console.error('Mood recommendations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get personalized recommendations based on user preferences
router.get('/personalized', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const preferences = user.preferences || {
            favoriteGenres: [],
            moodPreferences: [],
            dislikedMovies: [],
            likedMovies: [],
            watchlist: [],
            ratingThreshold: 6.0
        };
        // Get user's preferred genres and moods
        const favoriteGenres = preferences.favoriteGenres || [];
        const moodPreferences = (preferences.moodPreferences || [])
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 3)
            .map((p) => p.mood);
        // Exclude disliked movies
        const excludedMovies = preferences.dislikedMovies || [];
        const where = {
            id: { [sequelize_1.Op.notIn]: excludedMovies.length > 0 ? excludedMovies : [-1] },
            rating: { [sequelize_1.Op.gte]: preferences.ratingThreshold || 6.0 }
        };
        if (favoriteGenres.length > 0 || moodPreferences.length > 0) {
            where[sequelize_1.Op.or] = [];
            if (favoriteGenres.length > 0) {
                where[sequelize_1.Op.or].push({ genres: { [sequelize_1.Op.or]: favoriteGenres.map((g) => ({ [sequelize_1.Op.like]: `%${g}%` })) } });
            }
            if (moodPreferences.length > 0) {
                where[sequelize_1.Op.or].push({ moodTags: { [sequelize_1.Op.or]: moodPreferences.map((m) => ({ [sequelize_1.Op.like]: `%${m}%` })) } });
            }
        }
        const movies = await Movie_1.Movie.findAll({
            where,
            order: [['rating', 'DESC'], ['popularity', 'DESC']],
            limit: 20
        });
        res.json({ movies });
    }
    catch (error) {
        console.error('Personalized recommendations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Like/dislike a movie
router.post('/movie/:movieId/like', auth_1.protect, async (req, res) => {
    try {
        const { movieId } = req.params;
        const { liked } = req.body;
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const preferences = user.preferences || {
            favoriteGenres: [],
            moodPreferences: [],
            dislikedMovies: [],
            likedMovies: [],
            watchlist: [],
            ratingThreshold: 6.0
        };
        let likedMovies = preferences.likedMovies || [];
        let dislikedMovies = preferences.dislikedMovies || [];
        if (liked) {
            // Add to liked movies, remove from disliked
            likedMovies = [...new Set([...likedMovies, movieId])];
            dislikedMovies = dislikedMovies.filter((id) => id.toString() !== movieId);
        }
        else {
            // Add to disliked movies, remove from liked
            dislikedMovies = [...new Set([...dislikedMovies, movieId])];
            likedMovies = likedMovies.filter((id) => id.toString() !== movieId);
        }
        user.preferences = { ...preferences, likedMovies, dislikedMovies };
        await user.save();
        res.json({
            message: `Movie ${liked ? 'liked' : 'disliked'} successfully`,
            likedMovies: user.preferences.likedMovies,
            dislikedMovies: user.preferences.dislikedMovies
        });
    }
    catch (error) {
        console.error('Like/dislike error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Add to watchlist
router.post('/movie/:movieId/watchlist', auth_1.protect, async (req, res) => {
    try {
        const { movieId } = req.params;
        const { add } = req.body;
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const preferences = user.preferences || {
            favoriteGenres: [],
            moodPreferences: [],
            dislikedMovies: [],
            likedMovies: [],
            watchlist: [],
            ratingThreshold: 6.0
        };
        let watchlist = preferences.watchlist || [];
        if (add) {
            watchlist = [...new Set([...watchlist, movieId])];
        }
        else {
            watchlist = watchlist.filter((id) => id.toString() !== movieId);
        }
        user.preferences = { ...preferences, watchlist };
        await user.save();
        res.json({
            message: `Movie ${add ? 'added to' : 'removed from'} watchlist`,
            watchlist: user.preferences.watchlist
        });
    }
    catch (error) {
        console.error('Watchlist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user's mood preferences
router.get('/mood-preferences', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const moodPreferences = user.preferences?.moodPreferences || [];
        res.json({
            moodPreferences: moodPreferences.sort((a, b) => b.weight - a.weight)
        });
    }
    catch (error) {
        console.error('Get mood preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=recommendations.js.map