const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  caloriesBurnt: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', WorkoutSchema); 