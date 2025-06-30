const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { protect } = require('../middleware/authMiddleware');

// Get all workout entries for logged in user
router.get('/', protect, async (req, res) => {
  const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
  res.json(workouts);
});

// Add a workout entry for logged in user
router.post('/', protect, async (req, res) => {
  const { type, duration, caloriesBurnt } = req.body;
  const workout = new Workout({
    user: req.user.id,
    type,
    duration,
    caloriesBurnt,
  });
  const newWorkout = await workout.save();
  res.status(201).json(newWorkout);
});

// Delete a workout entry
router.delete('/:id', protect, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    // Make sure user owns the workout entry
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await workout.deleteOne();

    res.json({ msg: 'Workout removed', id: req.params.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 