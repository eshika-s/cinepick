"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const Movie_1 = require("../models/Movie");
const router = express_1.default.Router();
// TMDB API configuration
const TMDB_API_KEY = '2b61a1d5540e6d75f7d38444ab857503';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
// Get movies from TMDB API (main endpoint for frontend)
router.get('/', async (req, res) => {
    try {
        const { category, searchQuery, genre, page = 1 } = req.query;
        console.log('📥 Movie request:', { category, searchQuery, genre, page });
        let endpoint = '/discover/movie';
        const params = {
            api_key: TMDB_API_KEY,
            page,
            language: 'en-US',
            include_adult: false
        };
        if (category) {
            endpoint = category === 'trending'
                ? '/trending/movie/week'
                : `/movie/${category}`;
        }
        else if (searchQuery) {
            endpoint = '/search/movie';
            params.query = searchQuery;
        }
        else {
            params.sort_by = 'popularity.desc';
            if (genre && genre !== 'all') {
                params.with_genres = genre;
            }
        }
        console.log('🎬 Fetching from TMDB:', `${TMDB_BASE_URL}${endpoint}`);
        const response = await axios_1.default.get(`${TMDB_BASE_URL}${endpoint}`, {
            params,
            timeout: 10000,
            headers: {
                'Accept': 'application/json'
            }
        });
        console.log('✅ TMDB response received:', response.data.results?.length || 0, 'movies');
        res.json({
            movies: response.data.results || [],
            totalPages: response.data.total_pages || 1,
            page: response.data.page || 1
        });
    }
    catch (error) {
        console.error('❌ Get movies error:', error.message);
        console.error('Error details:', error.response?.data || error.code);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            details: error.response?.data || error.code
        });
    }
});
// Search movies
router.get('/search', async (req, res) => {
    try {
        const { q, genre, mood, page = 1, limit = 20 } = req.query;
        const query = {};
        if (q) {
            query.$text = { $search: q };
        }
        if (genre) {
            query.genres = genre;
        }
        if (mood) {
            query.moodTags = mood;
        }
        const movies = await Movie_1.Movie.find(query)
            .sort({ rating: -1, popularity: -1 })
            .limit(Number(limit) * Number(page))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Movie_1.Movie.countDocuments(query);
        res.json({
            movies,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Search movies error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie_1.Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ movie });
    }
    catch (error) {
        console.error('Get movie error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get popular movies
router.get('/browse/popular', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const movies = await Movie_1.Movie.find({})
            .sort({ popularity: -1, rating: -1 })
            .limit(Number(limit) * Number(page))
            .skip((Number(page) - 1) * Number(limit));
        res.json({ movies });
    }
    catch (error) {
        console.error('Get popular movies error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get top rated movies
router.get('/browse/top-rated', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const movies = await Movie_1.Movie.find({})
            .sort({ rating: -1, voteCount: -1 })
            .limit(Number(limit) * Number(page))
            .skip((Number(page) - 1) * Number(limit));
        res.json({ movies });
    }
    catch (error) {
        console.error('Get top rated movies error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get movies by genre
router.get('/browse/genre/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const movies = await Movie_1.Movie.find({ genres: genre })
            .sort({ rating: -1, popularity: -1 })
            .limit(Number(limit) * Number(page))
            .skip((Number(page) - 1) * Number(limit));
        res.json({ movies });
    }
    catch (error) {
        console.error('Get movies by genre error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=movies.js.map