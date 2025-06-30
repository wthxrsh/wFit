import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../api/axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [food, setFood] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [foodRes, workoutsRes] = await Promise.all([
        apiClient.get('/api/food'),
        apiClient.get('/api/workout'),
      ]);
      setFood(foodRes.data);
      setWorkouts(workoutsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Could not load your data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addFood = useCallback(async (foodData) => {
    if (!user) {
      toast.error("You must be logged in to add food.");
      return;
    }
    try {
      const res = await apiClient.post('/api/food', foodData);
      setFood((prevFood) => [...prevFood, res.data]);
      toast.success('Food added successfully!');
    } catch (error) {
      console.error('Failed to add food', error);
      toast.error('Could not add food item.');
    }
  }, [user]);

  const deleteFood = useCallback(async (foodId) => {
    if (!user) {
      toast.error("You must be logged in to delete food.");
      return;
    }
    try {
      await apiClient.delete(`/api/food/${foodId}`);
      setFood((prevFood) => prevFood.filter((item) => item._id !== foodId));
      toast.success('Food item deleted.');
    } catch (error) {
      console.error('Failed to delete food', error);
      toast.error('Could not delete food item.');
    }
  }, [user]);

  const addWorkout = useCallback(async (workoutData) => {
    if (!user) {
      toast.error("You must be logged in to add a workout.");
      return;
    }
    try {
      const res = await apiClient.post('/api/workout', workoutData);
      setWorkouts((prevWorkouts) => [...prevWorkouts, res.data]);
      toast.success('Workout added successfully!');
    } catch (error) {
      console.error('Failed to add workout', error);
      toast.error('Could not add workout.');
    }
  }, [user]);

  const deleteWorkout = useCallback(async (workoutId) => {
    if (!user) {
      toast.error("You must be logged in to delete a workout.");
      return;
    }
    try {
      await apiClient.delete(`/api/workout/${workoutId}`);
      setWorkouts((prevWorkouts) => prevWorkouts.filter((item) => item._id !== workoutId));
      toast.success('Workout item deleted.');
    } catch (error) {
      console.error('Failed to delete workout', error);
      toast.error('Could not delete workout item.');
    }
  }, [user]);

  const netCalories = useMemo(() => {
    const totalCaloriesConsumed = food.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalCaloriesBurned = workouts.reduce((sum, item) => sum + (item.caloriesBurnt || 0), 0);
    return totalCaloriesConsumed - totalCaloriesBurned;
  }, [food, workouts]);


  const value = {
    food,
    workouts,
    addFood,
    deleteFood,
    addWorkout,
    deleteWorkout,
    netCalories,
    loading,
    refreshData: fetchData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}; 