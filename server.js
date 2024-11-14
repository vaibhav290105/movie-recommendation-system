/*const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favoriteRoutes');
// Load environment variables from .env file
dotenv.config();

// Import route handlers
const movieRoutes = require('./routes/movieRoutes');



// Initialize the Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow only frontend origin
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoritesRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
app.post('/api/favorites', (req, res) => {
  const { movieId, movieTitle } = req.body;

  // Add logic to save the movie to the database or session
  // For example, here we mock the addition of a favorite
  const newFavorite = { movieId, movieTitle };

  // Mock logic for saving the favorite movie (e.g., database call)
  console.log('Movie added to favorites:', newFavorite);

  // Respond back with success
  res.status(200).json({ message: 'Movie added to favorites successfully' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */
















const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favoriteRoutes');

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const movieRoutes = require('./routes/movieRoutes');



// Initialize the Express app
const app = express();

// Configure CORS
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? 'https://movie-recommendation-frontend-delta.vercel.app/'
  : 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoritesRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
const Favorite = require('./models/Favorite');  // Import the Favorite model

app.post('/api/favorites', async (req, res) => {
  const { movieId, movieTitle,movieImageUrl } = req.body;

  try {
    // Create an instance of the Favorite model
    const newFavorite = new Favorite({
      movieId,
      movieTitle,
      movieImageUrl,
      userId: req.user ? req.user._id : null, // Optionally attach userId if you're tracking the user
    });

    // Save the favorite movie to the database
    await newFavorite.save();  // This should now work

    console.log('Movie added to favorites:', newFavorite);

    // Respond back with success
    res.status(200).json({ message: 'Movie added to favorites successfully' });
  } catch (error) {
    console.error('Error adding movie to favorites:', error);
    res.status(500).json({ message: 'Failed to add movie to favorites' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 


