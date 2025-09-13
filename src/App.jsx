import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MessagingProvider } from './contexts/MessagingContext'; 
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Homepage from './pages/Homepage';
import SearchResults from './pages/SearchResults';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import AuctionDetails from './pages/AuctionDetails'; 
import AuthContainer from './components/auth/AuthContainer';
import SellPage from './pages/SellPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  const [user, setUser] = useState({
    id: 'current_user',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  });
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAuthSuccess = ({ type, data }) => {
    setUser(data);
    setShowAuth(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAuthClick = () => {
    setShowAuth(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <MessagingProvider> {/* Wrap everything in MessagingProvider */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar 
            user={user} 
            onAuthClick={handleAuthClick}
            onLogout={handleLogout}
          />
          
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/auction/:id" element={<AuctionDetails user={user} />} />
            <Route path="/sell" element={<SellPage />} />
            <Route 
              path="/messages" 
              element={
                user ? (
                  <MessagesPage user={user} />
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
          </Routes>
          
          <Footer />
        </div>
      </Router>
    </MessagingProvider>
  );
}

export default App;