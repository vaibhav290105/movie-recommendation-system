/*// src/routes/userRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerUser } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { addFavorite } = require('../controllers/favoriteController');
// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);
router.post('/register', registerUser);
router.post('/', authMiddleware, addFavorite);

module.exports = router;*/















const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerUser } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { addFavorite } = require('../controllers/favoriteController');

// User Registration
router.post('/register', register); // Handle registration via authController

// User Login
router.post('/login', login); // Handle login via authController

// User Registration (separate logic in userController)
router.post('/user/register', registerUser); // This is for additional user registration logic

// Add Favorite Movie (requires authentication)
router.post('/favorites', authMiddleware, addFavorite); // Correct path for adding favorites

module.exports = router;

