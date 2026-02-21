"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieNightMovies = exports.MovieNight = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = require("./User");
const Movie_1 = require("./Movie");
class MovieNight extends sequelize_1.Model {
}
exports.MovieNight = MovieNight;
MovieNight.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    time: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    hostId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id',
        },
    },
    guests: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: [],
    },
    theme: {
        type: sequelize_1.DataTypes.STRING,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('planned', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'planned',
    },
}, {
    sequelize: database_1.default,
    modelName: 'MovieNight',
    tableName: 'movie_nights',
    timestamps: true,
});
// Define associations
MovieNight.belongsTo(User_1.User, { as: 'host', foreignKey: 'hostId' });
User_1.User.hasMany(MovieNight, { as: 'hostedMovieNights', foreignKey: 'hostId' });
// Many-to-Many association for MovieNight and Movie
exports.MovieNightMovies = database_1.default.define('MovieNightMovies', {}, { timestamps: false });
MovieNight.belongsToMany(Movie_1.Movie, { through: exports.MovieNightMovies, as: 'movies' });
Movie_1.Movie.belongsToMany(MovieNight, { through: exports.MovieNightMovies, as: 'movieNights' });
//# sourceMappingURL=MovieNight.js.map