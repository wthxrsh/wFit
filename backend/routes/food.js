const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect } = require('../middleware/authMiddleware');

// Get all food entries for logged in user
router.get('/', protect, async (req, res) => {
  const foods = await Food.find({ user: req.user.id }).sort({ date: -1 });
  res.json(foods);
});

// Add a food entry for logged in user
router.post('/', protect, async (req, res) => {
  try {
    const { name, calories } = req.body;
    const food = new Food({
      user: req.user.id,
      name,
      calories,
    });
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a food entry
router.delete('/:id', protect, async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ msg: 'Food not found' });
    }

    if (food.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await food.deleteOne();

    res.json({ msg: 'Food removed', id: req.params.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 