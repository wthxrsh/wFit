const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username is taken
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    // Check if email is taken
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  try {
    console.log('1. Searching for user in database...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found.');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('User found:', user.username);

    console.log('2. Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password does not match.');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('Password matched.');

    console.log('3. Creating JWT...');
    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET is not defined.');
      return res.status(500).send('Server error: JWT secret not configured.');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    console.log('JWT created successfully.');

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error('!!! An unexpected error occurred during login !!!');
    console.error(err); // Log the full error object
    res.status(500).send('Server error');
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
}; 