// src/controllers/authController.js
const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require('../config/config');
const Favorite = require('../models/Favorite');
// Helper to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.addFavorite = async (req, res) => {
  const { movieId, movieTitle } = req.body;
  const userId = req.user.id;  // `req.user` comes from an authenticated request

  try {
    // Check if movie already exists in favorites
    let favorite = await Favorite.findOne({ userId, movieId });
    if (favorite) {
      return res.status(400).json({ msg: 'Movie already in favorites' });
    }

    // Add new favorite
    favorite = new Favorite({ userId, movieId, movieTitle });
    await favorite.save();

    res.status(201).json({ msg: 'Movie added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ msg: 'Server error while adding favorite' });
  }
};
// Register new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create and hash new user password
    user = new User({ username, email, password });
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await Token.deleteMany({ userId: user._id });

    // Store refresh token in database
    await Token.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'Strict',
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await Token.deleteMany({ userId: user._id });

    // Store refresh token in database
    await Token.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'Strict',
    });

    res.json({ accessToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const tokenDoc = await Token.findOne({ token: refreshToken, userId: decoded.id });

    if (!tokenDoc) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// Logout user
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token found" });
  }

  try {
    await Token.findOneAndDelete({ token: refreshToken });
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
