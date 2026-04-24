const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
    try {
        // Use MONGODB_URI env var in production, else use in-memory for local dev
        const mongoUri = process.env.MONGODB_URI;
        
        if (mongoUri && mongoUri !== 'your_mongodb_connection_string_here') {
            const conn = await mongoose.connect(mongoUri);
            console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
        } else {
            // Fallback to in-memory MongoDB for local development
            const { MongoMemoryServer } = require('mongodb-memory-server');
            console.log('Starting In-Memory MongoDB for local development...');
            mongoServer = await MongoMemoryServer.create({ instance: { startupTimeout: 60000 } });
            const memUri = mongoServer.getUri();
            const conn = await mongoose.connect(memUri);
            console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
