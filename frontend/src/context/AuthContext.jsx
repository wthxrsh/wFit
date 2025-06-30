import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setAuthToken(res.data.token);
      toast.success(`Welcome, ${res.data.user.username}!`);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.msg || 'Failed to sign up.';
      toast.error(message);
      throw err;
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setAuthToken(res.data.token);
      toast.success(`Welcome back, ${res.data.user.username}!`);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.msg || 'Failed to log in.';
      toast.error(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setAuthToken(null);
    toast.success("You've been logged out.");
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('/api/auth/me');
          setCurrentUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          setAuthToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 