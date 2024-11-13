// src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite'); // Assuming you have a Favorite model
const { addFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware to verify access token

// Route to handle adding a favorite movie
router.post('/api/favorites', authMiddleware,addFavorite, async (req, res) => {
  try {
    const { movieId, movieTitle } = req.body;
    const userId = req.user.id; // `req.user` is set by authMiddleware

    // Check if the movie is already in the user's favorites
    const existingFavorite = await Favorite.findOne({ userId, movieId });
    if (existingFavorite) {
      return res.status(400).json({ msg: "Movie already added to favorites" });
    }

    // Create a new favorite entry
    const favorite = new Favorite({ userId, movieId, movieTitle });
    await favorite.save();

    res.status(201).json({ msg: "Movie added to favorites", favorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to handle removing a favorite movie
router.delete('/:movieId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;

    const deletedFavorite = await Favorite.findOneAndDelete({ userId, movieId });
    if (!deletedFavorite) {
      return res.status(404).json({ msg: "Favorite not found" });
    }

    res.status(200).json({ msg: "Movie removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to get all favorite movies for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ userId });
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

