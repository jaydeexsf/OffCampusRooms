// /server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./configDb");
const { createClerkClient } = require("@clerk/clerk-sdk-node");

const roomRoutes = require("./routes/roomRoutes");
const faqRoutes = require("./routes/faqRoutes")
const distanceRoute = require('./routes/distanceRoute')
const commentRoutes = require('./routes/CommentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const savedRoomRoutes = require('./routes/savedRoomRoutes');

dotenv.config();

// Initialize Clerk
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));


const app = express();
// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://off-campus-rooms.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Allows the server to accept JSON requests

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware - headers:', req.headers.authorization);
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header provided');
      return res.status(401).json({ message: 'No authorization header' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('No token found in authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    console.log('Verifying token with Clerk...');
    // Verify the token with Clerk using the correct v5 API
    const payload = await clerkClient.verifyToken(token);
    if (!payload || !payload.sub) {
      console.log('Invalid session token');
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.log('Token verified, getting user details...');
    // Get user details using the user ID from token payload
    const user = await clerkClient.users.getUser(payload.sub);
    
    // Add user info to request object
    req.user = {
      userId: payload.sub,
      userName: (user.firstName || '') + ' ' + (user.lastName || ''),
      userImage: user.imageUrl || '',
      imageUrl: user.imageUrl || '' // For comment controller compatibility
    };
    
    console.log('User authenticated successfully:', req.user);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

// Routes
app.use("/api/rooms", roomRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/google', distanceRoute);
// Apply auth middleware to comment routes
app.use('/api/comments', authMiddleware, commentRoutes);
// Rating routes with selective auth middleware
app.use('/api/ratings', ratingRoutes);
app.use('/api/statistics', statisticsRoutes);
// Use feedback routes with selective authentication
app.use('/api/feedback', (req, res, next) => {
  // Only apply auth middleware for protected routes
  if (req.method === 'GET' && req.path === '/public') {
    return next(); // Skip auth for public feedback
  }
  return authMiddleware(req, res, next);
}, feedbackRoutes);

// Use saved room routes (all require authentication)
app.use('/api/saved-rooms', authMiddleware, savedRoomRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});