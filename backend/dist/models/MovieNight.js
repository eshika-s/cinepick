"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieNight = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const movieNightSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    host: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guests: [{
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                trim: true,
                lowercase: true
            },
            status: {
                type: String,
                enum: ['pending', 'confirmed', 'declined'],
                default: 'pending'
            }
        }],
    movies: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Movie'
        }],
    theme: {
        type: String,
        enum: ['Classic Movie Night', 'Horror Marathon', 'Comedy Fest', 'Action Adventure', 'Romantic Evening', 'Sci-Fi Journey', 'Documentary Night', 'Family Fun']
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['planned', 'ongoing', 'completed', 'cancelled'],
        default: 'planned'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
movieNightSchema.index({ host: 1 });
movieNightSchema.index({ date: 1 });
movieNightSchema.index({ status: 1 });
exports.MovieNight = mongoose_1.default.model('MovieNight', movieNightSchema);
//# sourceMappingURL=MovieNight.js.map