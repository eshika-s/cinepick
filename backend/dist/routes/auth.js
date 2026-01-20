"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Register
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('username').isLength({ min: 3, max: 30 }).trim(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('firstName').optional().trim(),
    (0, express_validator_1.body)('lastName').optional().trim()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, username, password, firstName, lastName } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or username already exists'
            });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = new User_1.User({
            email,
            username,
            password: hashedPassword,
            firstName,
            lastName
        });
        await user.save();
        // Generate token
        const token = (0, auth_1.generateToken)(user._id.toString());
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
// Login
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate token
        const token = (0, auth_1.generateToken)(user._id.toString());
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});
// Get current user
router.get('/me', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user._id)
            .populate('movieNights');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
                preferences: user.preferences,
                movieNights: user.movieNights,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update user preferences
router.put('/preferences', auth_1.protect, [
    (0, express_validator_1.body)('favoriteGenres').optional().isArray(),
    (0, express_validator_1.body)('moodPreferences').optional().isArray(),
    (0, express_validator_1.body)('ratingThreshold').optional().isFloat({ min: 0, max: 10 })
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { favoriteGenres, moodPreferences, ratingThreshold } = req.body;
        const user = await User_1.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.preferences) {
            user.preferences = {
                favoriteGenres: [],
                moodPreferences: [],
                dislikedMovies: [],
                likedMovies: [],
                watchlist: [],
                ratingThreshold: 6.0
            };
        }
        if (favoriteGenres) {
            user.preferences.favoriteGenres = favoriteGenres;
        }
        if (moodPreferences) {
            user.preferences.moodPreferences = moodPreferences.map((pref) => ({
                ...pref,
                lastSelected: pref.lastSelected || new Date()
            }));
        }
        if (ratingThreshold !== undefined) {
            user.preferences.ratingThreshold = ratingThreshold;
        }
        await user.save();
        res.json({
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    }
    catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user statistics (admin endpoint)
router.get('/stats', auth_1.protect, async (req, res) => {
    try {
        const userCount = await User_1.User.countDocuments();
        const verifiedUsers = await User_1.User.countDocuments({ isEmailVerified: true });
        const googleUsers = await User_1.User.countDocuments({ googleId: { $exists: true } });
        const appleUsers = await User_1.User.countDocuments({ appleId: { $exists: true } });
        const recentUsers = await User_1.User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('email username createdAt');
        res.json({
            totalUsers: userCount,
            verifiedUsers,
            googleUsers,
            appleUsers,
            recentUsers
        });
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map