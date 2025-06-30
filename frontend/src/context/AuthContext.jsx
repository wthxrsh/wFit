import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../api/axios';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Interceptor in apiClient adds the token header
          const res = await apiClient.get('/api/auth/verify');
          setUser(res.data.user);
        } catch (error) {
          console.error('Token verification failed', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const res = await apiClient.post('/api/auth/login', { username, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || 'An error occurred');
      // Re-throw the error so form components can catch it
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }, []);

  const signup = useCallback(async (username, email, password) => {
    try {
      const res = await apiClient.post('/api/auth/register', { username, email, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup failed:', error.response?.data?.message || 'An error occurred');
      // Re-throw the error so form components can catch it
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    toast.success("You've been logged out.");
  }, []);

  const value = { user, isLoading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 