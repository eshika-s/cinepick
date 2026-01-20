"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connection = {};
const connectToDb = async () => {
    try {
        if (connection.isConnected)
            return;
        console.log('🔌 Connecting to MongoDB...');
        const db = await mongoose_1.default.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        connection.isConnected = db.connections[0].readyState === 1;
        connection.retryCount = 0;
        console.log('✅ Connected to MongoDB successfully!');
        console.log(`📊 Database: ${db.connection.name}`);
        // Handle connection errors
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
            connection.isConnected = false;
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
            connection.isConnected = true;
        });
    }
    catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        connection.retryCount = (connection.retryCount || 0) + 1;
        if (connection.retryCount < 5) {
            console.log(`🔄 Retrying connection in 5 seconds... (Attempt ${connection.retryCount}/5)`);
            setTimeout(exports.connectToDb, 5000);
        }
        else {
            console.error('💥 Max retry attempts reached. Please check your MongoDB connection.');
            console.log('🔧 Troubleshooting tips:');
            console.log('   1. Check if your IP is whitelisted in MongoDB Atlas');
            console.log('   2. Verify your MongoDB URI is correct');
            console.log('   3. Check your internet connection');
            console.log('   4. Make sure MongoDB Atlas cluster is running');
        }
    }
};
exports.connectToDb = connectToDb;
//# sourceMappingURL=database.js.map