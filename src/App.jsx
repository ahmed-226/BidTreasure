import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Homepage from './pages/Homepage';
import SearchResults from './pages/SearchResults';
import UserProfile from './pages/UserProfile';
import UserDashboard from './pages/UserDashboard';
import AuthContainer from './components/auth/AuthContainer';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = () => {
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
    };

    checkUserSession();
  }, []);

  const handleAuthSuccess = ({ type, data }) => {
    const userData = {
      id: Date.now(), 
      firstName: data.firstName || data.email.split('@')[0],
      lastName: data.lastName || '',
      email: data.email,
      phone: data.phone || '',
      bio: '',
      location: '',
      website: '',
      avatar: null,
      isVerified: false
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
        onAuthSuccess={handleAuthSuccess}
        onClose={() => setShowAuth(false)}
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar 
          user={user}
          onAuthClick={handleAuthClick}
          onLogout={handleLogout}
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/search" element={<SearchResults />} />
            
            {/* Protected routes - redirect to home if not authenticated */}
            <Route 
              path="/profile" 
              element={
                user ? (
                  <UserProfile user={user} onUpdateUser={handleUpdateUser} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
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
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;