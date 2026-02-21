import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'cinepick',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectToDb = async () => {
  try {
    console.log('🔌 Connecting to MySQL...');
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL successfully!');
    
    // Sync models
    // In production, you might want to use migrations instead of sync
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📊 Database models synced');
    }
  } catch (error) {
    console.error('❌ Error connecting to MySQL:', error);
    process.exit(1);
  }
};

export default sequelize;
