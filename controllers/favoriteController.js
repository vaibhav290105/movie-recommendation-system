const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const { movieId, movieTitle } = req.body;

    // Validate input
    if (!movieId || !movieTitle) {
      return res.status(400).json({ error: 'movieId and movieTitle are required' });
    }

    const favorite = new Favorite({ userId: req.user.id, movieId, movieTitle });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: 'Unable to add favorite' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const favorite = await Favorite.findOneAndDelete({ userId: req.user.id, movieId });
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    res.status(200).json({ message: 'Favorite removed' });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: 'Unable to remove favorite' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: 'Unable to fetch favorites' });
  }
};
