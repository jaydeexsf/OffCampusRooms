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

dotenv.config();

// Initialize Clerk
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));


const app = express();
// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON requests

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify the token with Clerk
    const session = await clerkClient.sessions.verifySessionToken(token);
    if (!session) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Get user details
    const user = await clerkClient.users.getUser(session.userId);
    
    // Add user info to request object
    req.user = {
      userId: session.userId,
      userName: user.firstName + ' ' + user.lastName,
      userImage: user.imageUrl,
      imageUrl: user.imageUrl // For comment controller compatibility
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Routes
app.use("/api/rooms", roomRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/google', distanceRoute);
// Apply auth middleware to comment and rating routes
app.use('/api/comments', authMiddleware, commentRoutes);
app.use('/api/ratings', authMiddleware, ratingRoutes);
app.use('/api/statistics', statisticsRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});