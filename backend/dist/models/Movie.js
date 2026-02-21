"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Movie extends sequelize_1.Model {
}
exports.Movie = Movie;
Movie.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tmdbId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    overview: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    posterUrl: {
        type: sequelize_1.DataTypes.STRING,
    },
    backdropUrl: {
        type: sequelize_1.DataTypes.STRING,
    },
    releaseDate: {
        type: sequelize_1.DataTypes.DATE,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        validate: {
            min: 0,
            max: 10,
        },
    },
    voteCount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    genres: {
        type: sequelize_1.DataTypes.JSON, // Storing as JSON array
        defaultValue: [],
    },
    moodTags: {
        type: sequelize_1.DataTypes.JSON, // Storing as JSON array
        defaultValue: [],
    },
    runtime: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'en',
    },
    adult: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    popularity: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Movie',
    tableName: 'movies',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['tmdbId'] },
        { fields: ['title'] },
        { fields: ['rating'] },
        { fields: ['popularity'] },
    ],
});
//# sourceMappingURL=Movie.js.map