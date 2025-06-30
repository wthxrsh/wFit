import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [foods, setFoods] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchAllData = async () => {
        try {
          const [foodRes, workoutRes] = await Promise.all([
            axios.get('/api/food'),
            axios.get('/api/workout'),
          ]);
          setFoods(foodRes.data || []);
          setWorkouts(workoutRes.data || []);
        } catch (error) {
          console.error("Failed to fetch initial data", error);
          setFoods([]);
          setWorkouts([]);
        }
      };
      fetchAllData();
    } else {
      setFoods([]);
      setWorkouts([]);
    }
  }, [currentUser]);

  const addFood = async (food) => {
    try {
      const res = await axios.post('/api/food', food);
      if (res.data) {
        setFoods(prev => [...prev, res.data]);
      }
    } catch (error) {
      console.error("Failed to add food", error);
    }
  };

  const deleteFood = async (id) => {
    try {
      await axios.delete(`/api/food/${id}`);
      setFoods(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      console.error("Failed to delete food", error);
    }
  };

  const addWorkout = async (workout) => {
    try {
      const res = await axios.post('/api/workout', workout);
      if (res.data) {
        setWorkouts(prev => [...prev, res.data]);
      }
    } catch (error) {
      console.error("Failed to add workout", error);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await axios.delete(`/api/workout/${id}`);
      setWorkouts(prev => prev.filter(w => w._id !== id));
    } catch (error) {
      console.error("Failed to delete workout", error);
    }
  };

  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
  const totalBurnt = workouts.reduce((sum, w) => sum + w.caloriesBurnt, 0);
  const netCalories = totalCalories - totalBurnt;

  const value = {
    foods,
    workouts,
    addFood,
    deleteFood,
    addWorkout,
    deleteWorkout,
    netCalories,
    totalCalories,
    totalBurnt,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
} 