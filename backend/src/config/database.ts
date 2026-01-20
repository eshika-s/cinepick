import mongoose from 'mongoose'

const connection: { isConnected?: boolean; retryCount?: number } = {}

export const connectToDb = async () => {
  try {
    if (connection.isConnected) return
    
    console.log('🔌 Connecting to MongoDB...')
    
    const db = await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    
    connection.isConnected = db.connections[0].readyState === 1
    connection.retryCount = 0
    
    console.log('✅ Connected to MongoDB successfully!')
    console.log(`📊 Database: ${db.connection.name}`)
    
    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected')
      connection.isConnected = false
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
      connection.isConnected = true
    })
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    
    connection.retryCount = (connection.retryCount || 0) + 1
    
    if (connection.retryCount < 5) {
      console.log(`🔄 Retrying connection in 5 seconds... (Attempt ${connection.retryCount}/5)`)
      setTimeout(connectToDb, 5000)
    } else {
      console.error('💥 Max retry attempts reached. Please check your MongoDB connection.')
      console.log('🔧 Troubleshooting tips:')
      console.log('   1. Check if your IP is whitelisted in MongoDB Atlas')
      console.log('   2. Verify your MongoDB URI is correct')
      console.log('   3. Check your internet connection')
      console.log('   4. Make sure MongoDB Atlas cluster is running')
    }
  }
}
