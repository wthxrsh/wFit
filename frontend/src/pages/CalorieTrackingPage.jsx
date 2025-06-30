import { useState } from 'react';
import { useData } from '../context/DataContext.jsx';

export default function CalorieTrackingPage() {
  const { foods, addFood, deleteFood, totalCalories } = useData();
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodName || !foodCalories) return;
    await addFood({ name: foodName, calories: Number(foodCalories) });
    setFoodName('');
    setFoodCalories('');
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Calorie Tracking</h1>
      <form onSubmit={handleSubmit} className="form">
        <input className="form-input" placeholder="Food name" value={foodName} onChange={e => setFoodName(e.target.value)} required />
        <input className="form-input" placeholder="Calories" type="number" value={foodCalories} onChange={e => setFoodCalories(e.target.value)} required />
        <button type="submit" className="form-button">Add Food</button>
      </form>
      <div className="list-container">
        <h3>Today's Log</h3>
        <ul className="list">
          {(foods || []).map(f => (
            <li key={f._id} className="list-item">
              <span>{f.name} <span className="item-details">({f.calories} cal)</span></span>
              <button onClick={() => deleteFood(f._id)} className="delete-button">Delete</button>
            </li>
          ))}
        </ul>
        <div className="total-display">Total: {totalCalories} cal</div>
      </div>
    </div>
  );
} 