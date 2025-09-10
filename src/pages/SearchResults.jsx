import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List, 
  Clock, 
  Heart, 
  Eye,
  MapPin,
  Star
} from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 
  const [sortBy, setSortBy] = useState('ending_soon');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: '',
    auctionStatus: 'live'
  });
  const [showFilters, setShowFilters] = useState(false);

  
  const mockResults = [
    {
      id: 1,
      title: "Vintage Rolex Submariner 1965 - Excellent Condition",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      currentBid: 15500,
      timeLeft: "2h 34m",
      bidCount: 23,
      category: "Watches",
      condition: "Excellent",
      location: "New York, NY",
      seller: "WatchCollector",
      sellerRating: 4.9,
      buyItNow: 18000,
      isWatched: false
    },
    {
      id: 2,
      title: "Apple MacBook Pro 16-inch M3 Max - Brand New Sealed",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      currentBid: 2100,
      timeLeft: "4h 23m",
      bidCount: 34,
      category: "Electronics",
      condition: "New",
      location: "San Francisco, CA",
      seller: "TechDeals",
      sellerRating: 4.7,
      buyItNow: null,
      isWatched: true
    },
    
  ];

  useEffect(() => {
    
    setIsLoading(true);
    setTimeout(() => {
      
      let filtered = mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

      if (category) {
        filtered = filtered.filter(item => 
          item.category.toLowerCase() === category.toLowerCase()
        );
      }

      
      if (filters.minPrice) {
        filtered = filtered.filter(item => item.currentBid >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(item => item.currentBid <= parseInt(filters.maxPrice));
      }
      if (filters.condition) {
        filtered = filtered.filter(item => item.condition === filters.condition);
      }

      
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price_low':
            return a.currentBid - b.currentBid;
          case 'price_high':
            return b.currentBid - a.currentBid;
          case 'ending_soon':
            return a.timeLeft.localeCompare(b.timeLeft);
          case 'most_bids':
            return b.bidCount - a.bidCount;
          default:
            return 0;
        }
      });

      setResults(filtered);
      setIsLoading(false);
    }, 1000);
  }, [query, category, filters, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: '',
      auctionStatus: 'live'
    });
  };

  const toggleWatchlist = (itemId) => {
    setResults(prev => prev.map(item => 
      item.id === itemId ? { ...item, isWatched: !item.isWatched } : item
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600">Searching for "{query}"...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Search Results
                {query && (
                  <span className="text-primary-600"> for "{query}"</span>
                )}
              </h1>
              <p className="text-secondary-600 mt-1">
                {results.length} items found
                {category && ` in ${category}`}
              </p>
            </div>
            
            {/* View Toggle & Sort */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 text-sm"
              >
                <option value="ending_soon">Ending Soon</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="most_bids">Most Bids</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary text-sm flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </button>
            
            {Object.entries(filters).map(([key, value]) => (
              value && key !== 'auctionStatus' && (
                <span key={key} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              )
            ))}
            
            {Object.values(filters).some(v => v && v !== 'live') && (
              <button
                onClick={clearFilters}
                className="text-sm text-secondary-500 hover:text-secondary-700"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-secondary-200 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input-field text-sm"
                  placeholder="$0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Any Condition</option>
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.auctionStatus}
                  onChange={(e) => handleFilterChange('auctionStatus', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="live">Live Auctions</option>
                  <option value="buy_now">Buy It Now</option>
                  <option value="ending_soon">Ending Soon</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {results.map((item) => (
            <div key={item.id} className={`card overflow-hidden hover:shadow-lg transition-all duration-300 ${
              viewMode === 'list' ? 'flex' : ''
            }`}>
              <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`object-cover ${
                    viewMode === 'list' ? 'w-full h-48' : 'w-full h-48'
                  }`}
                />
                <button
                  onClick={() => toggleWatchlist(item.id)}
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className={`h-4 w-4 ${item.isWatched ? 'text-red-500 fill-current' : 'text-secondary-600'}`} />
                </button>
                {item.buyItNow && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Buy It Now
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold text-secondary-900 ${
                    viewMode === 'list' ? 'text-lg line-clamp-2' : 'text-base line-clamp-2'
                  }`}>
                    {item.title}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Current Bid:</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(item.currentBid)}
                    </span>
                  </div>
                  
                  {item.buyItNow && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Buy It Now:</span>
                      <span className="text-base font-semibold text-green-600">
                        {formatPrice(item.buyItNow)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-secondary-500">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {item.bidCount} bids
                    </span>
                    <span className="flex items-center text-red-600 font-medium">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.timeLeft}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-secondary-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {item.sellerRating}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Link
                      to={`/auction/${item.id}`}
                      className="flex-1 btn-primary text-center text-sm py-2"
                    >
                      View Details
                    </Link>
                    {item.buyItNow && (
                      <button className="btn-secondary text-sm py-2 px-3">
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {results.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">No results found</h3>
            <p className="text-secondary-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {results.length > 0 && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-600 hover:bg-secondary-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-600 hover:bg-secondary-50">
                2
              </button>
              <button className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-600 hover:bg-secondary-50">
                3
              </button>
              <button className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-600 hover:bg-secondary-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;