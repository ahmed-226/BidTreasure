import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Menu, X, Heart, Bell, Gavel, User, Package, MessageSquare } from 'lucide-react'; 
import { useMessaging } from '../../contexts/MessagingContext';
import AuctionNotifications from '../auction/AuctionNotifications';



const Navbar = ({ user, onAuthClick, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { unreadCount } = useMessaging();

  const categories = [
    'Electronics',
    'Art & Collectibles',
    'Jewelry & Watches',
    'Vehicles',
    'Fashion',
    'Home & Garden',
    'Sports & Recreation',
    'Books & Media'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleDashboardNavigation = (tab) => {
    navigate(`/dashboard?tab=${tab}`);
  };

  const handleWatchlistClick = () => {
    navigate('/dashboard?tab=watchlist');
  };

  const handleMyBidsClick = () => {
    navigate('/dashboard?tab=my-bids');
  };

  const handleMyListingsClick = () => {
    navigate('/dashboard?tab=my-listings');
  };

  const handleSettingsClick = () => {
    navigate('/dashboard?tab=settings');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>🔥 Live Auctions: 1,247 active</span>
              <span>⏰ Ending Soon: 23 items</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>24/7 Customer Support</span>
              <span>|</span>
              <span>Secure SSL Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Gavel className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-secondary-900">BidTreasure</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items, brands, or categories..."
                  className="w-full pl-4 pr-12 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-1.5 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                    <Link
                      to="/messages"
                      className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                      title="Messages"
                    >
                      <MessageSquare className="h-6 w-6" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <AuctionNotifications />
                    <Link
                      to="/seller-verification"
                      className="text-secondary-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      Verification
                    </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                      <span className="font-medium">{user.firstName}</span>
                    </button>
                    {/* User Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Dashboard
                        </button>
                        <button 
                          onClick={handleMyBidsClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Bids
                        </button>
                        <button 
                          onClick={handleMyListingsClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Listings
                        </button>
                        <button 
                          onClick={handleWatchlistClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Watchlist
                        </button>
                        <div className="border-t border-gray-200"></div>
                        <button 
                          onClick={handleSettingsClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Settings
                        </button>
                        <button
                          onClick={onLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={onAuthClick}
                    className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onAuthClick}
                    className="btn-primary"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:block border-t border-secondary-200">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-6">
              <span className="font-medium text-secondary-700">Categories:</span>
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => navigate('/search')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <Link 
              to="/sell" 
              className="btn-primary flex items-center"
            >
              <Package className="h-4 w-4 mr-2" />
              Sell Your Item
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  className="w-full pl-4 pr-12 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-1.5 rounded-md"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Mobile Categories */}
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryClick(category);
                      setIsMenuOpen(false);
                    }}
                    className="text-secondary-600 hover:text-primary-600 transition-colors text-sm py-2 text-left"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Auth/User */}
            {user ? (
              <div className="space-y-2 border-t border-secondary-200 pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-secondary-600" />
                  )}
                  <span className="font-medium text-secondary-900">{user.firstName} {user.lastName}</span>
                </div>
                <button
                  onClick={() => {
                    handleProfileClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-secondary-600 hover:text-primary-600 py-2"
                >
                  My Profile
                </button>
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-secondary-600 hover:text-primary-600 py-2"
                >
                  My Dashboard
                </button>
                <button 
                  onClick={() => {
                    handleMyBidsClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-secondary-600 hover:text-primary-600 py-2"
                >
                  My Bids
                </button>
                <button 
                  onClick={() => {
                    handleMyListingsClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-secondary-600 hover:text-primary-600 py-2"
                >
                  My Listings
                </button>
                <button 
                  onClick={() => {
                    handleWatchlistClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-secondary-600 hover:text-primary-600 py-2"
                >
                  Watchlist
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-secondary-600 hover:text-primary-600 py-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 border-t border-secondary-200 pt-4">
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-secondary text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;