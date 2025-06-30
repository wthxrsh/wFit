import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (username || email || password) {
      setError('');
    }
  }, [username, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(username, email, password);
      navigate('/calories');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Create Account</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          className="form-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form-error-text">{error}</p>}
        <button type="submit" className="form-button">Sign Up</button>
      </form>
      <p className="form-footer-text">
        Already have an account? <Link to="/login" className="text-link">Log In</Link>
      </p>
    </div>
  );
} 