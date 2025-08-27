const express = require('express');
const { 
  addRating, 
  getRoomRatings, 
  getUserRating, 
  deleteRating 
} = require('../controllers/ratingController');
const router = express.Router();

// Import auth middleware
const { createClerkClient } = require("@clerk/clerk-sdk-node");
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[RatingsAuth] Authorization header present:', Boolean(authHeader));
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('[RatingsAuth] Token length:', token ? token.length : 0);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    console.log('[RatingsAuth] Verifying token with Clerk...');
    const payload = await clerkClient.verifyToken(token);
    console.log('[RatingsAuth] Verify result has sub:', Boolean(payload && payload.sub));
    if (!payload || !payload.sub) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.log('[RatingsAuth] Fetching user profile for sub:', payload.sub);
    const user = await clerkClient.users.getUser(payload.sub);
    
    req.user = {
      userId: payload.sub,
      userName: (user.firstName || '') + ' ' + (user.lastName || ''),
      userImage: user.imageUrl || '',
      imageUrl: user.imageUrl || ''
    };
    
    console.log('[RatingsAuth] User resolved, proceeding');
    next();
  } catch (error) {
    console.error('[RatingsAuth] Authentication error:', error);
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

// PUBLIC ROUTES (no auth required)
// Get ratings for a specific room - anyone can view ratings
router.get('/room/:roomId', getRoomRatings);

// PROTECTED ROUTES (auth required)
// Get user's rating for a specific room
router.get('/user/:roomId', authMiddleware, getUserRating);

// Add or update a rating
router.post('/', authMiddleware, addRating);

// Delete user's rating
router.delete('/:roomId', authMiddleware, deleteRating);

module.exports = router;
