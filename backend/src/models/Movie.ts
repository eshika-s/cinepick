import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Movie extends Model {
  public id!: number;
  public tmdbId!: number;
  public title!: string;
  public overview!: string;
  public posterUrl?: string;
  public backdropUrl?: string;
  public releaseDate?: Date;
  public rating?: number;
  public voteCount!: number;
  public genres!: string[];
  public moodTags!: string[];
  public runtime?: number;
  public language!: string;
  public adult!: boolean;
  public popularity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Movie.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tmdbId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  posterUrl: {
    type: DataTypes.STRING,
  },
  backdropUrl: {
    type: DataTypes.STRING,
  },
  releaseDate: {
    type: DataTypes.DATE,
  },
  rating: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 10,
    },
  },
  voteCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  genres: {
    type: DataTypes.JSON, // Storing as JSON array
    defaultValue: [],
  },
  moodTags: {
    type: DataTypes.JSON, // Storing as JSON array
    defaultValue: [],
  },
  runtime: {
    type: DataTypes.INTEGER,
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
  adult: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  popularity: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  sequelize,
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
