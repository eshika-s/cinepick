import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Movie } from './Movie';

export class MovieNight extends Model {
  public id!: number;
  public title!: string;
  public date!: Date;
  public time!: string;
  public hostId!: number;
  public guests!: any[];
  public theme?: string;
  public notes?: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MovieNight.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  guests: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  theme: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('planned', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'planned',
  },
}, {
  sequelize,
  modelName: 'MovieNight',
  tableName: 'movie_nights',
  timestamps: true,
});

// Define associations
MovieNight.belongsTo(User, { as: 'host', foreignKey: 'hostId' });
User.hasMany(MovieNight, { as: 'hostedMovieNights', foreignKey: 'hostId' });

// Many-to-Many association for MovieNight and Movie
export const MovieNightMovies = sequelize.define('MovieNightMovies', {}, { timestamps: false });
MovieNight.belongsToMany(Movie, { through: MovieNightMovies, as: 'movies' });
Movie.belongsToMany(MovieNight, { through: MovieNightMovies, as: 'movieNights' });
