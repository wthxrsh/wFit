const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema); 