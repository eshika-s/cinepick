import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password?: string;
  public username!: string;
  public firstName?: string;
  public lastName?: string;
  public avatar?: string;
  public googleId?: string;
  public appleId?: string;
  public isEmailVerified!: boolean;
  public lastLogin!: Date;
  public preferences!: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for OAuth users
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true,
  },
  appleId: {
    type: DataTypes.STRING,
    unique: true,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastLogin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  preferences: {
    type: DataTypes.JSON,
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
  sequelize,
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
