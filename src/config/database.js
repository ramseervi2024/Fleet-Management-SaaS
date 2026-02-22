const mongoose = require('mongoose');

const connectDB = async () => {
  const tryConnect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      console.log('🔄 Retrying connection in 5 seconds... (whitelist your IP in MongoDB Atlas)');
      setTimeout(tryConnect, 5000);
    }
  };
  await tryConnect();
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

module.exports = connectDB;
