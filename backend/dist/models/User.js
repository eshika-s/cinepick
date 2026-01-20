"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId && !this.appleId;
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    avatar: {
        type: String
    },
    googleId: {
        type: String,
        sparse: true
    },
    appleId: {
        type: String,
        sparse: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    preferences: {
        favoriteGenres: [{
                type: String,
                enum: ['action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 'mystery', 'romance', 'sci-fi', 'thriller', 'documentary', 'family']
            }],
        moodPreferences: [{
                mood: {
                    type: String,
                    enum: ['happy', 'thriller', 'cozy', 'mindbending', 'romantic', 'epic']
                },
                weight: {
                    type: Number,
                    default: 1,
                    min: 0,
                    max: 5
                },
                lastSelected: {
                    type: Date,
                    default: Date.now
                }
            }],
        dislikedMovies: [{
                type: String
            }],
        likedMovies: [{
                type: String
            }],
        watchlist: [{
                type: String
            }],
        ratingThreshold: {
            type: Number,
            default: 6.0,
            min: 0,
            max: 10
        }
    },
    movieNights: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'MovieNight'
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ appleId: 1 });
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map