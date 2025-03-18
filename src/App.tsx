import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/AuthenticatedHeader';
import AuthenticatedHeader from './components/AuthenticatedHeader';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    // This is just a placeholder - replace with your actual auth check
    const checkAuth = () => {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userInfo));
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      {isAuthenticated ? (
        <AuthenticatedHeader user={user} />
      ) : (
        <Navbar/>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
       
        {/* Add more authenticated routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
