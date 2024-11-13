/*const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  // Additional movie details if needed
});

module.exports = mongoose.model('Favorite', favoriteSchema);*/






const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  movieImageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional, if you're associating favorites with a user
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;