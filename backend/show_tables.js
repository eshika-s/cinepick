const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize('cinepick', 'root', 'Saksham@1305', {
  dialect: 'mysql',
  logging: false,
  host: 'localhost'
});

async function showContents() {
  try {
    console.log('\n--- 🧑 USERS TABLE (Top 5) ---');
    const users = await sequelize.query('SELECT id, username, email, isEmailVerified, lastLogin, createdAt FROM users LIMIT 5', { type: QueryTypes.SELECT });
    console.table(users);
    
    console.log('\n--- 🍿 MOVIES TABLE (Top 5) ---');
    const movies = await sequelize.query('SELECT id, tmdbId, title, rating, popularity, DATE_FORMAT(releaseDate, "%Y-%m-%d") as releaseDate FROM movies LIMIT 5', { type: QueryTypes.SELECT });
    console.table(movies);
    
    console.log('\n--- 📅 MOVIE NIGHTS TABLE (Top 5) ---');
    const movieNights = await sequelize.query('SELECT id, title, date, time, hostId, status FROM movie_nights LIMIT 5', { type: QueryTypes.SELECT });
    console.table(movieNights);

    const counts = await Promise.all([
      sequelize.query('SELECT COUNT(*) as count FROM users', { type: QueryTypes.SELECT }),
      sequelize.query('SELECT COUNT(*) as count FROM movies', { type: QueryTypes.SELECT }),
      sequelize.query('SELECT COUNT(*) as count FROM movie_nights', { type: QueryTypes.SELECT }),
      sequelize.query('SELECT COUNT(*) as count FROM MovieNightMovies', { type: QueryTypes.SELECT })
    ]);

    console.log('\n--- 📊 TOTAL RECORDS ---');
    console.log(`Users: ${counts[0][0].count}`);
    console.log(`Movies Saved: ${counts[1][0].count}`);
    console.log(`Movie Nights: ${counts[2][0].count}`);
    console.log(`MovieNight-Movie Links: ${counts[3][0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error fetching table contents:', error);
    process.exit(1);
  }
}
showContents();
