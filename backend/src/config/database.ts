import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const prisma = new PrismaClient({
  log: nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established successfully via Prisma');
  } catch (error) {
    console.error('❌ Error connecting to MySQL:', error);
    process.exit(1);
  }
};

export default prisma;
