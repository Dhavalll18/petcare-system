const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Set specific origin in production
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Make Socket.io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Pet Care API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Socket.io connection setup
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
