const axios = require('axios');
const { TMDB_API_KEY } = require('../config/config');

// Search for movies by query
exports.searchMovies = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query
      }
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch movies" });
  }
};

// Get recommended movies
exports.getRecommendations = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch recommendations" });
  }
};
