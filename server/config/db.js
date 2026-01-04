const mongoose = require('mongoose');

/**
 * connectDB: The Data Nexus Link
 * Establishes a secure connection to the MongoDB Atlas cluster.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options ensure stable connections in Node.js 18+ environments
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    console.log(`
    📡 Nexus Database Linked
    🟢 Host: ${conn.connection.host}
    🔗 State: Synchronized
    `);
    
  } catch (error) {
    console.error(`
    ❌ Critical Nexus Failure
    🛑 Error: ${error.message}
    `);
    
    // Exit process with failure (1) to prevent the app from running in a broken state
    process.exit(1);
  }
};

module.exports = connectDB;