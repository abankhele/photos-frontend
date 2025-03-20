import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, ReactNode } from 'react';
import Navbar from './components/Navbar';
import AuthenticatedHeader from './components/AuthenticatedHeader';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { User } from './types/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('user');

      if (token && userInfo) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userInfo));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Protected route component with location tracking
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const location = useLocation();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      // Pass the current location to redirect back after login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  };

  // Redirect if already authenticated
  const AuthRedirect = ({ children }: { children: ReactNode }) => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Router>
      {isAuthenticated ? (
        <AuthenticatedHeader user={user} setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />
        } />
        <Route path="/register" element={
          <AuthRedirect>
            <RegistrationPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          </AuthRedirect>
        } />
        <Route path="/login" element={
          <AuthRedirect>
            <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          </AuthRedirect>
        } />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
