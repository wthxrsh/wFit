import { useState } from 'react';
import { useData } from '../context/DataContext.jsx';

export default function WorkoutPlanningPage() {
  const { workouts, addWorkout, deleteWorkout } = useData();
  const [workoutType, setWorkoutType] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutCalories, setWorkoutCalories] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workoutType || !workoutDuration || !workoutCalories) return;
    await addWorkout({
      type: workoutType,
      duration: Number(workoutDuration),
      caloriesBurnt: Number(workoutCalories)
    });
    setWorkoutType('');
    setWorkoutDuration('');
    setWorkoutCalories('');
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Workout Planning</h1>
      <form onSubmit={handleSubmit} className="form">
        <input className="form-input" placeholder="Workout type" value={workoutType} onChange={e => setWorkoutType(e.target.value)} required />
        <input className="form-input" placeholder="Duration (min)" type="number" value={workoutDuration} onChange={e => setWorkoutDuration(e.target.value)} required />
        <input className="form-input" placeholder="Calories burnt" type="number" value={workoutCalories} onChange={e => setWorkoutCalories(e.target.value)} required />
        <button type="submit" className="form-button">Add Workout</button>
      </form>
      <div className="list-container">
        <h3>Today's Workouts</h3>
        <ul className="list">
          {(workouts || []).map(w => (
            <li key={w._id} className="list-item">
              <span>{w.type} <span className="item-details">({w.duration} min, {w.caloriesBurnt} cal)</span></span>
              <button onClick={() => deleteWorkout(w._id)} className="delete-button">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 