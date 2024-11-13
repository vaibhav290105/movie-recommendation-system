/*// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already in use
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already registered" });

    // Create a new user and hash the password
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10) // Hash the password before saving
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate JWT token after successful login
    const payload = { userId: user._id }; // Payload with user ID
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate token

    res.json({
      msg: "User logged in successfully",
      token // Send the token in the response
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: "Server error during login" });
  }
});

module.exports = router;*/

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate request fields
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    // Check if the email is already in use
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Create a new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate JWT token after successful login
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });

    res.json({
      msg: "User logged in successfully",
      token // Send the token in the response
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: "Server error during login" });
  }
});

module.exports = router;


