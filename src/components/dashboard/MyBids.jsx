import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  
import {
  Gavel,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,  
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

const MyBids = ({ formatPrice }) => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showBidHistory, setShowBidHistory] = useState({});
  const [showNotifications, setShowNotifications] = useState(true);
  const [expandedBid, setExpandedBid] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  const mockBids = [
    {
      id: 1,
      itemTitle: "Vintage Rolex Submariner 1965",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop",
      myBid: 16000,
      currentBid: 16500,
      maxBid: 18000,
      timeLeft: "2h 34m",
      status: "outbid",
      bidTime: "2 hours ago",
      auctionEnd: "2024-02-15T18:00:00Z",
      bidCount: 24,
      category: "Watches",
      seller: "LuxuryTimepieces",
      sellerRating: 4.9,
      isWatched: true,
      lastActivity: "1 hour ago",
      bidIncrement: 500,
      reservePrice: 15000,
      reserveMet: true,
      bidHistory: [
        { amount: 15000, time: "3 hours ago", isMyBid: true, bidder: "You" },
        { amount: 15500, time: "2.5 hours ago", isMyBid: false, bidder: "collector89" },
        { amount: 16000, time: "2 hours ago", isMyBid: true, bidder: "You" },
        { amount: 16500, time: "1.5 hours ago", isMyBid: false, bidder: "vintage_lover" }
      ],
      notifications: [
        { type: "outbid", message: "You've been outbid", time: "1.5 hours ago", urgent: true, read: false }
      ],
      quickBidAmounts: [17000, 17500, 18000],
      estimatedShipping: 25,
      location: "New York, NY"
    },
    {
      id: 2,
      itemTitle: "Apple MacBook Pro 16-inch M3 Max",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=150&fit=crop",
      myBid: 2100,
      currentBid: 2100,
      maxBid: 2500,
      timeLeft: "4h 23m",
      status: "winning",
      bidTime: "1 hour ago",
      auctionEnd: "2024-02-15T20:00:00Z",
      bidCount: 35,
      category: "Electronics",
      seller: "TechDeals",
      sellerRating: 4.7,
      isWatched: false,
      lastActivity: "30 minutes ago",
      bidIncrement: 50,
      reservePrice: 1800,
      reserveMet: true,
      bidHistory: [
        { amount: 2000, time: "2 hours ago", isMyBid: true, bidder: "You" },
        { amount: 2050, time: "1.5 hours ago", isMyBid: false, bidder: "tech_guy" },
        { amount: 2100, time: "1 hour ago", isMyBid: true, bidder: "You" }
      ],
      notifications: [
        { type: "winning", message: "You're currently winning!", time: "1 hour ago", urgent: false, read: true }
      ],
      quickBidAmounts: [2150, 2200, 2250],
      estimatedShipping: 15,
      location: "California, CA"
    },

  ];

  useEffect(() => {

    setTimeout(() => {
      setBids(mockBids);
      setFilteredBids(mockBids);
      setIsLoading(false);
    }, 1000);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setBids(prevBids =>
        prevBids.map(bid => {
          if (bid.status === 'winning' || bid.status === 'outbid') {

            const newCurrentBid = bid.currentBid + Math.floor(Math.random() * 100);
            const newStatus = newCurrentBid > bid.myBid ? 'outbid' : 'winning';

            return {
              ...bid,
              currentBid: newCurrentBid,
              status: newStatus,
              lastActivity: 'Just now'
            };
          }
          return bid;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleQuickBid = (bidId, amount) => {
    setBids(prevBids =>
      prevBids.map(bid =>
        bid.id === bidId
          ? {
            ...bid,
            myBid: amount,
            maxBid: amount,
            status: amount > bid.currentBid ? 'winning' : bid.status,
            bidTime: 'Just now',
            bidHistory: [
              ...bid.bidHistory,
              { amount, time: 'Just now', isMyBid: true, bidder: 'You' }
            ]
          }
          : bid
      )
    );
  };

  const toggleWatchlist = (bidId) => {
    setBids(prevBids =>
      prevBids.map(bid =>
        bid.id === bidId ? { ...bid, isWatched: !bid.isWatched } : bid
      )
    );
  };

  const markNotificationAsRead = (bidId, notificationIndex) => {
    setBids(prevBids =>
      prevBids.map(bid =>
        bid.id === bidId
          ? {
            ...bid,
            notifications: bid.notifications.map((notif, index) =>
              index === notificationIndex ? { ...notif, read: true } : notif
            )
          }
          : bid
      )
    );
  };

  const getTimeLeftColor = (timeLeft) => {
    if (timeLeft === 'Ended') return 'text-gray-500';
    if (timeLeft.includes('m') && !timeLeft.includes('h') && !timeLeft.includes('d')) {
      return 'text-red-600 font-bold animate-pulse';
    }
    if (timeLeft.includes('h') && !timeLeft.includes('d')) {
      return 'text-orange-600';
    }
    return 'text-gray-700';
  };


  useEffect(() => {
    let filtered = bids;


    if (activeFilter !== 'all') {
      filtered = filtered.filter(bid => bid.status === activeFilter);
    }


    if (searchQuery) {
      filtered = filtered.filter(bid =>
        bid.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.bidTime) - new Date(a.bidTime);
        case 'oldest':
          return new Date(a.bidTime) - new Date(b.bidTime);
        case 'highest_bid':
          return b.myBid - a.myBid;
        case 'lowest_bid':
          return a.myBid - b.myBid;
        case 'ending_soon':
          if (a.timeLeft === 'Ended') return 1;
          if (b.timeLeft === 'Ended') return -1;
          return a.timeLeft.localeCompare(b.timeLeft);
        case 'most_activity':
          return b.bidHistory.length - a.bidHistory.length;
        default:
          return 0;
      }
    });

    setFilteredBids(filtered);
  }, [bids, activeFilter, searchQuery, sortBy]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'winning':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'outbid':
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case 'lost':
        return <TrendingDown className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'winning':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'outbid':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'lost':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const toggleBidHistory = (bidId) => {
    setShowBidHistory(prev => ({
      ...prev,
      [bidId]: !prev[bidId]
    }));
  };

  const filterOptions = [
    { value: 'all', label: 'All Bids', count: bids.length },
    { value: 'winning', label: 'Winning', count: bids.filter(b => b.status === 'winning').length },
    { value: 'outbid', label: 'Outbid', count: bids.filter(b => b.status === 'outbid').length },
    { value: 'lost', label: 'Lost', count: bids.filter(b => b.status === 'lost').length }
  ];

  const urgentNotifications = bids.flatMap(bid =>
    bid.notifications.filter(notif => notif.urgent && !notif.read)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent Notifications Banner */}
      {urgentNotifications.length > 0 && showNotifications && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex">
              <Bell className="h-5 w-5 text-red-600 mr-3 mt-0.5 animate-pulse" />
              <div>
                <h3 className="font-medium text-red-800">
                  Urgent Bid Alerts ({urgentNotifications.length})
                </h3>
                <div className="mt-2 space-y-1">
                  {urgentNotifications.slice(0, 3).map((notif, index) => (
                    <p key={index} className="text-sm text-red-700">
                      • {notif.message} ({notif.time})
                    </p>
                  ))}
                  {urgentNotifications.length > 3 && (
                    <p className="text-sm text-red-600 font-medium">
                      +{urgentNotifications.length - 3} more alerts
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-red-400 hover:text-red-600"
            >
              <AlertCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Bids</h2>
          <p className="text-gray-600">Track all your current and past bidding activity</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bids, items, or sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full sm:w-64"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_bid">Highest Bid</option>
            <option value="lowest_bid">Lowest Bid</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="most_activity">Most Activity</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Bids</p>
              <p className="text-2xl font-bold text-blue-600">
                {bids.filter(b => b.status === 'winning' || b.status === 'outbid').length}
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {bids.length > 0 ? Math.round((bids.filter(b => b.status === 'winning').length / bids.length) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Committed</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPrice(bids.reduce((sum, bid) => sum + bid.maxBid, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Watched Items</p>
              <p className="text-2xl font-bold text-orange-600">
                {bids.filter(b => b.isWatched).length}
              </p>
            </div>
            <Bookmark className="h-8 w-8 text-orange-600" />
          </div>
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

      {/*  Bids List */}
      {filteredBids.length === 0 ? (
        <div className="text-center py-12">
          <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
          <p className="text-gray-500">
            {activeFilter === 'all'
              ? "You haven't placed any bids yet."
              : `No bids with status "${activeFilter}" found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBids.map((bid) => (
            <div key={bid.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              {/* Unread Notifications Indicator */}
              {bid.notifications.some(n => !n.read) && (
                <div className="flex items-center text-red-600 text-sm mb-4">
                  <Bell className="h-4 w-4 mr-2 animate-pulse" />
                  <span className="font-medium">New updates</span>
                </div>
              )}

              {/* Main Content Container */}
              <div className="space-y-6">
                {/* Top Section: Item Info and Image */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Item Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={bid.image}
                      alt={bid.itemTitle}
                      className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                    {bid.isWatched && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <Bookmark className="h-3 w-3 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">
                      {bid.itemTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {bid.category}
                      </span>
                      <span className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {bid.seller} ({bid.sellerRating})
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {bid.bidCount} bids
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Bid placed {bid.bidTime}
                      </span>
                      <span className="flex items-center">
                        <Timer className="h-4 w-4 mr-1" />
                        Last activity: {bid.lastActivity}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium text-sm ${getStatusColor(bid.status)}`}>
                      {getStatusIcon(bid.status)}
                      <span className="ml-2 capitalize">{bid.status}</span>
                    </div>
                  </div>
                </div>

                {/* Bid Information Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">My Current Bid</p>
                    <p className="font-semibold text-gray-900 text-lg">{formatPrice(bid.myBid)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Leading Bid</p>
                    <p className={`font-semibold text-lg ${bid.currentBid > bid.myBid ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {formatPrice(bid.currentBid)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">My Max Bid</p>
                    <p className="font-semibold text-blue-600 text-lg">{formatPrice(bid.maxBid)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Time Left</p>
                    <p className={`font-semibold text-lg ${getTimeLeftColor(bid.timeLeft)}`}>
                      {bid.timeLeft}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/auction/${bid.id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  <button
                    onClick={() => toggleBidHistory(bid.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm"
                  >
                    <History className="h-4 w-4 mr-1" />
                    History
                  </button>
                  <button
                    onClick={() => toggleWatchlist(bid.id)}
                    className={`bg-gray-100 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm ${bid.isWatched ? 'text-red-600' : 'text-gray-700'
                      }`}
                  >
                    <Bookmark className={`h-4 w-4 mr-1 ${bid.isWatched ? 'fill-current' : ''}`} />
                    {bid.isWatched ? 'Unwatch' : 'Watch'}
                  </button>
                  {bid.status === 'outbid' && bid.timeLeft !== 'Ended' && (
                    <button
                      onClick={() => setExpandedBid(expandedBid === bid.id ? null : bid.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm"
                    >
                      <Gavel className="h-4 w-4 mr-1" />
                      Quick Bid
                      {expandedBid === bid.id ?
                        <ChevronUp className="h-4 w-4 ml-1" /> :
                        <ChevronDown className="h-4 w-4 ml-1" />
                      }
                    </button>
                  )}
                </div>

                {/* Quick Bid Section */}
                {expandedBid === bid.id && bid.status === 'outbid' && bid.timeLeft !== 'Ended' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Quick Bid Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {bid.quickBidAmounts.map((amount, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickBid(bid.id, amount)}
                          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                        >
                          {formatPrice(amount)}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="number"
                        placeholder="Custom amount"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={bid.currentBid + bid.bidIncrement}
                        step={bid.bidIncrement}
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                        Place Bid
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Minimum increment: {formatPrice(bid.bidIncrement)} |
                      Estimated shipping: {formatPrice(bid.estimatedShipping)}
                    </p>
                  </div>
                )}

                {/* Bid History */}
                {showBidHistory[bid.id] && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Bid Timeline</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {bid.bidHistory.map((historyItem, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${historyItem.isMyBid ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                          }`}>
                          <div className="flex items-center">
                            <div className={`p-1 rounded-full mr-3 ${historyItem.isMyBid ? 'bg-blue-500' : 'bg-gray-400'
                              }`}>
                              <Target className="h-3 w-3 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-medium">
                                {historyItem.bidder}
                              </span>
                              <p className="text-xs text-gray-500">{historyItem.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(historyItem.amount)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outbid Alert */}
                {bid.status === 'outbid' && bid.timeLeft !== 'Ended' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-red-800">You've been outbid!</p>
                        <p className="text-sm text-red-700 mt-1">
                          Current bid is {formatPrice(bid.currentBid)}.
                          {bid.reserveMet ? ' Reserve met.' : ` Reserve (${formatPrice(bid.reservePrice)}) ${bid.reserveMet ? 'met' : 'not met'}.`}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleQuickBid(bid.id, bid.currentBid + bid.bidIncrement)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                          >
                            Quick Bid {formatPrice(bid.currentBid + bid.bidIncrement)}
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                            Set New Max
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

      {/*  Summary Stats */}
      {filteredBids.length > 0 && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Bidding Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {filteredBids.filter(b => b.status === 'winning').length}
              </p>
              <p className="text-sm text-gray-600">Currently Winning</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {filteredBids.filter(b => b.status === 'outbid').length}
              </p>
              <p className="text-sm text-gray-600">Outbid</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {formatPrice(filteredBids.reduce((sum, bid) => sum + bid.myBid, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Current Bids</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(filteredBids.reduce((sum, bid) => sum + bid.maxBid, 0))}
              </p>
              <p className="text-sm text-gray-600">Max Bid Potential</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;