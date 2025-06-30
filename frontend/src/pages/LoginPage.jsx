import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (username || password) {
      setError('');
    }
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/calories');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Login</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          className={`form-input ${error ? 'is-invalid' : ''}`}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className={`form-input ${error ? 'is-invalid' : ''}`}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form-error-text">{error}</p>}
        <button type="submit" className="form-button">Log In</button>
      </form>
      <p className="form-footer-text">
        Don't have an account? <Link to="/signup" className="text-link">Sign Up</Link>
      </p>
    </div>
  );
} 