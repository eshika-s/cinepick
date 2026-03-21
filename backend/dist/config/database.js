"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'cinepick', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
        connectTimeout: 60000 // Increase connection timeout to 60 seconds
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
});
const connectToDb = async () => {
    try {
        console.log('🔌 Connecting to MySQL...');
        await sequelize.authenticate();
        console.log('✅ Connected to MySQL successfully!');
        // Sync models
        // In production, we're adding SYNC_DB check to easily provision remote database tables
        if (process.env.NODE_ENV === 'development' || process.env.SYNC_DB === 'true') {
            await sequelize.sync({ alter: true });
            console.log('📊 Database models synced');
        }
    }
    catch (error) {
        console.error('❌ Error connecting to MySQL:', error);
        process.exit(1);
    }
};
exports.connectToDb = connectToDb;
exports.default = sequelize;
//# sourceMappingURL=database.js.map