import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  
import {
  Gavel,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Search,
  Bell,
  Bookmark,
  Eye,
  Calendar,
  Timer,
  RefreshCw,
  History,  
  ChevronUp,  
  ChevronDown,  
  Users
} from 'lucide-react';
import CreateListingModal from './CreateListingModal';

const MyListings = ({ formatPrice }) => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');


  const mockListings = [
    {
      id: 1,
      title: "Vintage Canon AE-1 Camera with 50mm Lens",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=150&fit=crop",
      currentBid: 1200,
      startingBid: 500,
      bidsCount: 15,
      watchersCount: 23,
      timeLeft: "2d 5h",
      status: "active",
      views: 156,
      category: "Electronics",
      condition: "Excellent",
      createdDate: "2024-02-10",
      reservePrice: 1000,
      reserveMet: true
    },
    {
      id: 2,
      title: "Antique Wooden Writing Desk - 1920s",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
      currentBid: 0,
      startingBid: 300,
      bidsCount: 0,
      watchersCount: 8,
      timeLeft: "5d 12h",
      status: "active",
      views: 42,
      category: "Antiques",
      condition: "Good",
      createdDate: "2024-02-12",
      buyItNow: 800
    },
    {
      id: 3,
      title: "Signed Baseball Card Collection",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop",
      currentBid: 850,
      startingBid: 200,
      bidsCount: 28,
      watchersCount: 45,
      timeLeft: "Ended",
      status: "sold",
      views: 234,
      category: "Collectibles",
      condition: "Excellent",
      createdDate: "2024-02-08",
      finalPrice: 920,
      buyer: "collector123"
    }
  ];

  useEffect(() => {

    setTimeout(() => {
      setListings(mockListings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateListing = (listingData) => {
    const newListing = {
      id: Date.now(),
      ...listingData,
      currentBid: 0,
      bidsCount: 0,
      watchersCount: 0,
      timeLeft: `${listingData.duration}d 0h`,
      status: 'active',
      views: 0,
      createdDate: new Date().toISOString().split('T')[0],
      reserveMet: false
    };

    setListings(prev => [newListing, ...prev]);
    console.log('New listing created:', newListing);
  };

  const filteredListings = listings.filter(listing => {
    const matchesFilter = activeFilter === 'all' || listing.status === activeFilter;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All Listings', count: listings.length },
    { value: 'active', label: 'Active', count: listings.filter(l => l.status === 'active').length },
    { value: 'sold', label: 'Sold', count: listings.filter(l => l.status === 'sold').length },
    { value: 'ended', label: 'Ended', count: listings.filter(l => l.status === 'ended').length }
  ];

  const getStatusIcon = (status, listing) => {
    switch (status) {
      case 'active':
        return listing.bidsCount > 0 ?
          <TrendingUp className="h-4 w-4 text-green-500" /> :
          <Clock className="h-4 w-4 text-blue-500" />;
      case 'sold':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ended':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'sold':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'ended':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
          <p className="text-gray-600">Manage your active and past listings</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full sm:w-64"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="most_bids">Most Bids</option>
            <option value="most_views">Most Views</option>
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center justify-center whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeFilter === option.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {option.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${activeFilter === option.value
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                {option.count}
              </span>
            </button>
          ))}
        </nav>
      </div>


      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No listings found' : 'No listings yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Start selling by creating your first listing'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="space-y-6">
                {/* Top Section: Item Info and Image */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Item Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                    />
                    {listing.status === 'active' && listing.bidsCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">
                      {listing.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {listing.category}
                      </span>
                      <span className="flex items-center">
                        <span className="text-gray-400 mr-1">Condition:</span>
                        {listing.condition}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {listing.views} views
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {listing.watchersCount} watchers
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Listed {new Date(listing.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium text-sm ${getStatusColor(listing.status)}`}>
                      {getStatusIcon(listing.status, listing)}
                      <span className="ml-2 capitalize">{listing.status}</span>
                    </div>
                  </div>
                </div>

                {/* Listing Information Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Current Bid</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {listing.currentBid > 0 ? formatPrice(listing.currentBid) : 'No bids yet'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Starting Bid</p>
                    <p className="font-semibold text-blue-600 text-lg">{formatPrice(listing.startingBid)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Bids</p>
                    <p className="font-semibold text-purple-600 text-lg flex items-center justify-center">
                      <Users className="h-4 w-4 mr-1" />
                      {listing.bidsCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Time Left</p>
                    <p className={`font-semibold text-lg ${listing.timeLeft === 'Ended' ? 'text-gray-500' : 'text-red-600'
                      }`}>
                      {listing.timeLeft}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/auction/${listing.id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Listing
                  </Link>
                  {listing.status === 'active' && (
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  )}
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm">
                    <MoreHorizontal className="h-4 w-4 mr-1" />
                    More
                  </button>
                </div>

                {/* Reserve Price & Buy It Now Info */}
                {(listing.reservePrice || listing.buyItNow) && (
                  <div className="flex flex-wrap gap-2">
                    {listing.reservePrice && (
                      <span className={`text-xs px-3 py-1 rounded-full ${listing.reserveMet
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        Reserve {listing.reserveMet ? 'Met' : 'Not Met'} ({formatPrice(listing.reservePrice)})
                      </span>
                    )}
                    {listing.buyItNow && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Buy It Now: {formatPrice(listing.buyItNow)}
                      </span>
                    )}
                  </div>
                )}

                {/* Performance Stats for Active Listings */}
                {listing.status === 'active' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Views/Day</p>
                        <p className="font-semibold text-blue-600">{Math.round(listing.views / 3)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Watch Rate</p>
                        <p className="font-semibold text-blue-600">
                          {listing.views > 0 ? ((listing.watchersCount / listing.views) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Bid Rate</p>
                        <p className="font-semibold text-blue-600">
                          {listing.views > 0 ? ((listing.bidsCount / listing.views) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sale Info for Sold Items */}
                {listing.status === 'sold' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800">SOLD!</p>
                        <p className="text-sm text-green-700 mt-1">
                          Final price: {formatPrice(listing.finalPrice)} to {listing.buyer}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                            Contact Buyer
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                            Print Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Summary Stats */}
      {filteredListings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Listing Performance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {listings.filter(l => l.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {listings.reduce((sum, l) => sum + l.views, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {listings.reduce((sum, l) => sum + l.watchersCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Watchers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {formatPrice(listings.reduce((sum, l) => sum + (l.finalPrice || l.currentBid), 0))}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </div>
      )}
      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateListing}
      />
    </div>
  );
};

export default MyListings;