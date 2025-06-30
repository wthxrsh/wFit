import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DataProvider, useData } from './context/DataContext.jsx';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Pages & Components
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CalorieTrackingPage from './pages/CalorieTrackingPage.jsx';
import WorkoutPlanningPage from './pages/WorkoutPlanningPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function NetCaloriesDisplay() {
  const { netCalories } = useData();

  if (netCalories === null) return null;

  return (
    <div className="net-calories-display">
      Net Calories: <span className={netCalories >= 0 ? 'gain' : 'loss'}>{netCalories}</span>
    </div>
  );
}

function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-section">
        <span className="nav-brand">wFit</span>
        <nav className="nav-links">
          {currentUser && (
            <>
              <NavLink to="/calories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Calories</NavLink>
              <NavLink to="/workouts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Workouts</NavLink>
            </>
          )}
        </nav>
      </div>

      {currentUser && <div className="navbar-section-center"><NetCaloriesDisplay /></div>}

      <div className="navbar-section-right">
        {currentUser ? (
          <button onClick={logout} className="nav-link-button">Logout</button>
        ) : (
          <nav className="nav-links">
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Sign Up</NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <AuthProvider>
        <DataProvider>
          <div className="app-container">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={
                  <PrivateRoute>
                    <Navigate to="/calories" />
                  </PrivateRoute>
                } />
                <Route path="/calories" element={
                  <PrivateRoute>
                    <CalorieTrackingPage />
                  </PrivateRoute>
                } />
                <Route path="/workouts" element={
                  <PrivateRoute>
                    <WorkoutPlanningPage />
                  </PrivateRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Routes>
            </main>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
