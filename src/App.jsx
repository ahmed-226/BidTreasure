import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Homepage from './pages/Homepage';
import SearchResults from './pages/SearchResults';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import AuctionDetails from './pages/AuctionDetails'; 
import AuthContainer from './components/auth/AuthContainer';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bidtreasure_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('bidtreasure_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = ({ type, data }) => {
    const userData = {
      id: Date.now(),
      email: data.email,
      firstName: data.firstName || data.name?.split(' ')[0] || 'User',
      lastName: data.lastName || data.name?.split(' ')[1] || '',
      avatar: data.avatar || null,
      joinDate: new Date().toISOString().split('T')[0],
      ...data
    };

    setUser(userData);
    localStorage.setItem('bidtreasure_user', JSON.stringify(userData));
    setShowAuth(false);
    
    console.log(`${type === 'login' ? 'Login' : 'Registration'} successful:`, userData);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('bidtreasure_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bidtreasure_user');
    console.log('User logged out');
  };

  const handleAuthClick = () => {
    setShowAuth(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading BidTreasure...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return (
      <AuthContainer
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar
          user={user}
          onAuthClick={handleAuthClick}
          onLogout={handleLogout}
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/auction/:id" element={<AuctionDetails />} />  {/* ADD THIS LINE */}
            <Route 
              path="/dashboard" 
              element={
                user ? (
                  <UserDashboard user={user} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/profile" 
              element={
                user ? (
                  <UserProfile user={user} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;