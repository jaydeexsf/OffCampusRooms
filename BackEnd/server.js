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
const driverRoutes = require('./routes/driverRoutes');
const rideRoutes = require('./routes/rideRoutes');
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

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

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
    // Prefer verifying with a static JWT key if provided to avoid JWKS fetch issues
    const verifyOptions = process.env.CLERK_JWT_KEY ? { jwtKey: process.env.CLERK_JWT_KEY } : undefined;
    const payload = await clerkClient.verifyToken(token, verifyOptions);
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
    
    // Provide more specific error messages
    let errorMessage = 'Authentication failed';
    if (error.message.includes('Failed to resolve JWK')) {
      errorMessage = 'Token verification service temporarily unavailable. Please try again.';
    } else if (error.message.includes('jwt expired')) {
      errorMessage = 'Your session has expired. Please sign in again.';
    } else if (error.message.includes('jwt malformed')) {
      errorMessage = 'Invalid authentication token. Please sign in again.';
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    return res.status(401).json({ 
      message: errorMessage,
      error: error.message 
    });
  }
};

// Routes
app.use("/api/rooms", roomRoutes);
// FAQ routes - only add/delete require auth (admin functions)
app.use('/api/faq', (req, res, next) => {
  // Skip auth for public routes (getting questions)
  if (req.method === 'GET') {
    return next();
  }
  // Apply auth middleware for admin routes (POST, DELETE)
  return authMiddleware(req, res, next);
}, faqRoutes);
app.use('/api/google', distanceRoute);
// Apply auth middleware to comment routes
app.use('/api/comments', authMiddleware, commentRoutes);
// Rating routes with selective authentication
app.use('/api/ratings', (req, res, next) => {
  // Skip auth for public routes (getting room ratings)
  if (req.method === 'GET' && req.path.startsWith('/room/')) {
    return next();
  }
  // Apply auth middleware for all other rating routes
  return authMiddleware(req, res, next);
}, ratingRoutes);
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

// Driver routes (admin routes require auth)
app.use('/api/drivers', (req, res, next) => {
  // Skip auth for public routes (getting available drivers and statistics)
  if (req.method === 'GET' && (req.path === '/available' || req.path === '/count')) {
    return next();
  }
  // Apply auth middleware for admin routes (POST, PUT, DELETE, PATCH)
  return authMiddleware(req, res, next);
}, driverRoutes);

// Ride routes (require authentication for booking)
app.use('/api/rides', (req, res, next) => {
  // Skip auth for public routes (calculate ride details and public rides)
  if ((req.method === 'POST' && req.path === '/calculate') || 
      (req.method === 'GET' && req.path === '/public')) {
    return next();
  }
  // Apply auth middleware for all other ride routes
  return authMiddleware(req, res, next);
}, rideRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});