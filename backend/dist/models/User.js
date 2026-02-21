"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // Allow null for OAuth users
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
    },
    googleId: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    appleId: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    isEmailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    lastLogin: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    preferences: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: {
            favoriteGenres: [],
            moodPreferences: [],
            dislikedMovies: [],
            likedMovies: [],
            watchlist: [],
            ratingThreshold: 6.0
        },
    },
}, {
    sequelize: database_1.default,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['username'] },
        { fields: ['googleId'] },
        { fields: ['appleId'] },
    ],
});
//# sourceMappingURL=User.js.map