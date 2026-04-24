const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        console.log('Attempting to connect to MongoDB...');
        
        if (mongoUri && mongoUri.includes('mongodb+srv')) {
            // Using real MongoDB Atlas
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000 // 5 seconds timeout
            });
            console.log('✅ MongoDB Atlas Connected successfully!');
        } else {
            console.log('⚠️ No valid MONGODB_URI found, using in-memory fallback...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoServer = await MongoMemoryServer.create();
            const memUri = mongoServer.getUri();
            await mongoose.connect(memUri);
            console.log('✅ In-Memory MongoDB Connected!');
        }
    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
        console.log('Tip: Check your MongoDB Atlas IP Whitelist (add 0.0.0.0/0)');
        // Don't exit process so server can still respond with error messages
    }
};

module.exports = connectDB;
