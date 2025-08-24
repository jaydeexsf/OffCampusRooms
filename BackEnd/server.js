// /server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./configDb");
const roomRoutes = require("./routes/roomRoutes");
const faqRoutes = require("./routes/faqRoutes")
const distanceRoute = require('./routes/distanceRoute')
const commentRoutes = require('./routes/CommentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

dotenv.config();

connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));


const app = express();
// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON requests

// Routes
app.use("/api/rooms", roomRoutes); 
app.use('/api/faq', faqRoutes);
app.use('/api/google', distanceRoute);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/statistics', statisticsRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});