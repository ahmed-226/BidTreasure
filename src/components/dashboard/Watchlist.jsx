import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import {
  Heart,
  Eye,
  Clock,
  DollarSign,
  Gavel,
  Search,
  Filter,
  Grid3X3,
  List,
  Bell,
  AlertCircle,
  TrendingUp,
  Users,
  Star,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  MapPin,
  Timer
} from 'lucide-react';

const Watchlist = ({ formatPrice }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ending_soon');
  const [showNotifications, setShowNotifications] = useState(true);


  const mockWatchlistItems = [
    {
      id: 1,
      title: "Rare 1955 Mercedes-Benz 300SL Gullwing",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      currentBid: 285000,
      startingBid: 200000,
      timeLeft: "2h 34m",
      bidsCount: 47,
      category: "Vehicles",
      seller: "ClassicCars",
      sellerRating: 4.9,
      watchers: 156,
      priceChange: 15000,
      priceChangePercent: 5.6,
      addedDate: "2024-02-10",
      reservePrice: 250000,
      reserveMet: true,
      buyItNow: null,
      condition: "Excellent",
      location: "California, USA",
      shippingCost: 2500,
      hasNewActivity: true,
      lastBidTime: "5 minutes ago",
      isEndingSoon: true
    },
    {
      id: 2,
      title: "Vintage Leica M3 Camera with 50mm Lens",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop",
      currentBid: 2400,
      startingBid: 1200,
      timeLeft: "1d 8h",
      bidsCount: 23,
      category: "Electronics",
      seller: "VintageGear",
      sellerRating: 4.7,
      watchers: 89,
      priceChange: 400,
      priceChangePercent: 20.0,
      addedDate: "2024-02-08",
      reservePrice: 2000,
      reserveMet: true,
      buyItNow: 3500,
      condition: "Very Good",
      location: "New York, USA",
      shippingCost: 45,
      hasNewActivity: false,
      lastBidTime: "2 hours ago",
      isEndingSoon: false
    },
    {
      id: 3,
      title: "Signed Baseball by Babe Ruth (1932)",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      currentBid: 15500,
      startingBid: 5000,
      timeLeft: "3d 12h",
      bidsCount: 67,
      category: "Collectibles",
      seller: "SportsMemorabiliaXX",
      sellerRating: 4.8,
      watchers: 234,
      priceChange: 2500,
      priceChangePercent: 19.2,
      addedDate: "2024-02-05",
      reservePrice: 12000,
      reserveMet: true,
      buyItNow: null,
      condition: "Good",
      location: "Illinois, USA",
      shippingCost: 25,
      hasNewActivity: true,
      lastBidTime: "1 hour ago",
      isEndingSoon: false
    }
  ];

  const categories = ['all', 'Electronics', 'Vehicles', 'Collectibles', 'Art', 'Fashion', 'Jewelry'];

  useEffect(() => {

    setTimeout(() => {
      setWatchlistItems(mockWatchlistItems);
      setIsLoading(false);
    }, 1000);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlistItems(prevItems =>
        prevItems.map(item => {
          if (Math.random() > 0.7) {
            const newBid = item.currentBid + Math.floor(Math.random() * 500) + 50;
            const change = newBid - item.currentBid;
            return {
              ...item,
              currentBid: newBid,
              priceChange: change,
              priceChangePercent: ((change / item.currentBid) * 100),
              bidsCount: item.bidsCount + 1,
              hasNewActivity: true,
              lastBidTime: 'Just now'
            };
          }
          return item;
        })
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredItems = watchlistItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'ending_soon':
        if (a.timeLeft.includes('h') && !a.timeLeft.includes('d')) return -1;
        if (b.timeLeft.includes('h') && !b.timeLeft.includes('d')) return 1;
        return a.timeLeft.localeCompare(b.timeLeft);
      case 'price_low':
        return a.currentBid - b.currentBid;
      case 'price_high':
        return b.currentBid - a.currentBid;
      case 'most_bids':
        return b.bidsCount - a.bidsCount;
      case 'recently_added':
        return new Date(b.addedDate) - new Date(a.addedDate);
      case 'most_watched':
        return b.watchers - a.watchers;
      default:
        return 0;
    }
  });

  const removeFromWatchlist = (itemId) => {
    setWatchlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearWatchlist = () => {
    if (window.confirm('Are you sure you want to remove all items from your watchlist?')) {
      setWatchlistItems([]);
    }
  };

  const getTimeLeftColor = (timeLeft) => {
    if (timeLeft.includes('m') && !timeLeft.includes('h') && !timeLeft.includes('d')) {
      return 'text-red-600 font-bold animate-pulse';
    }
    if (timeLeft.includes('h') && !timeLeft.includes('d')) {
      return 'text-orange-600 font-semibold';
    }
    return 'text-gray-700';
  };

  const newActivityCount = watchlistItems.filter(item => item.hasNewActivity).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Watchlist</h2>
          <p className="text-gray-600">
            Keep track of {watchlistItems.length} favorite items
            {newActivityCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                {newActivityCount} new updates
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button className="btn-secondary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
          {watchlistItems.length > 0 && (
            <button
              onClick={clearWatchlist}
              className="btn-outline text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search watchlist items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="ending_soon">Ending Soon</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="most_bids">Most Bids</option>
            <option value="recently_added">Recently Added</option>
            <option value="most_watched">Most Watched</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {watchlistItems.length === 0 ? 'No items in watchlist' : 'No matching items'}
          </h3>
          <p className="text-gray-500 mb-4">
            {watchlistItems.length === 0
              ? 'Add items to your watchlist to track them here'
              : 'Try adjusting your search or filter criteria'}
          </p>
          <button className="btn-primary">
            Browse Auctions
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredItems.map((item) => (
            <div key={item.id} className={`card ${viewMode === 'grid' ? 'p-4' : 'p-6'
              } hover:shadow-lg transition-all duration-200 ${item.hasNewActivity ? 'ring-2 ring-blue-200' : ''
              }`}>
              {viewMode === 'grid' ? (

                <>
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {item.hasNewActivity && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        New Activity
                      </div>
                    )}
                    {item.isEndingSoon && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                        Ending Soon!
                      </div>
                    )}
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Current Bid:</span>
                      <span className="font-semibold text-gray-900 flex items-center">
                        {formatPrice(item.currentBid)}
                        {item.priceChange > 0 && (
                          <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Left:</span>
                      <span className={`font-semibold ${getTimeLeftColor(item.timeLeft)}`}>
                        {item.timeLeft}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bids:</span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {item.bidsCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Watchers:</span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {item.watchers}
                      </span>
                    </div>
                  </div>

                  {item.priceChange > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
                      <p className="text-xs text-green-700">
                        +{formatPrice(item.priceChange)} ({item.priceChangePercent.toFixed(1)}%) since you added
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link
                      to={`/auction/${item.id}`}
                      className="btn-primary flex-1 text-sm"
                    >
                      <Gavel className="h-4 w-4 mr-1" />
                      Bid Now
                    </Link>
                    <button className="btn-secondary text-sm">
                      <Eye className="h-4 w-4" />
                    </button>
                    {item.buyItNow && (
                      <button className="btn-secondary text-sm whitespace-nowrap">
                        Buy {formatPrice(item.buyItNow)}
                      </button>
                    )}
                  </div>
                </>
              ) : (

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    {item.hasNewActivity && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-3 h-3"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        {item.sellerRating}
                      </span>
                      <span>•</span>
                      <span>{item.condition}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Current Bid</p>
                      <p className="font-semibold">{formatPrice(item.currentBid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time Left</p>
                      <p className={`font-semibold ${getTimeLeftColor(item.timeLeft)}`}>
                        {item.timeLeft}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bids</p>
                      <p className="font-semibold">{item.bidsCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Watchers</p>
                      <p className="font-semibold">{item.watchers}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="btn-primary text-sm">
                      <Gavel className="h-4 w-4 mr-1" />
                      Bid
                    </button>
                    <button className="btn-secondary text-sm">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="btn-secondary text-sm text-red-600"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredItems.length > 0 && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Watchlist Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{filteredItems.length}</p>
              <p className="text-sm text-gray-600">Items Watched</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(filteredItems.reduce((sum, item) => sum + item.currentBid, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {filteredItems.filter(item => item.isEndingSoon).length}
              </p>
              <p className="text-sm text-gray-600">Ending Soon</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {newActivityCount}
              </p>
              <p className="text-sm text-gray-600">New Activity</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;