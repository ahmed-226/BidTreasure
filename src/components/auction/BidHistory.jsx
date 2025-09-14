import React, { useState, useEffect } from 'react';
import {
  Clock,
  User,
  TrendingUp,
  Eye,
  EyeOff,
  Crown,
  Shield
} from 'lucide-react';

const BidHistory = ({ auctionId }) => {
  const [bidHistory, setBidHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  
  const mockBidHistory = [
    {
      id: 1,
      bidder: "You",
      amount: 15500,
      timestamp: "2024-02-15T14:30:00Z",
      isCurrentUser: true,
      isWinning: true
    },
    {
      id: 2,
      bidder: "collector89",
      amount: 15250,
      timestamp: "2024-02-15T14:25:00Z",
      isCurrentUser: false,
      isWinning: false
    },
    {
      id: 3,
      bidder: "vintage_lover",
      amount: 15000,
      timestamp: "2024-02-15T14:20:00Z",
      isCurrentUser: false,
      isWinning: false
    },
    {
      id: 4,
      bidder: "You",
      amount: 14750,
      timestamp: "2024-02-15T14:15:00Z",
      isCurrentUser: true,
      isWinning: false
    },
    {
      id: 5,
      bidder: "watch_expert",
      amount: 14500,
      timestamp: "2024-02-15T14:10:00Z",
      isCurrentUser: false,
      isWinning: false
    },
    {
      id: 6,
      bidder: "timepiece_pro",
      amount: 14250,
      timestamp: "2024-02-15T14:05:00Z",
      isCurrentUser: false,
      isWinning: false
    },
    {
      id: 7,
      bidder: "collector89",
      amount: 14000,
      timestamp: "2024-02-15T14:00:00Z",
      isCurrentUser: false,
      isWinning: false
    },
    {
      id: 8,
      bidder: "rolex_fan",
      amount: 13750,
      timestamp: "2024-02-15T13:55:00Z",
      isCurrentUser: false,
      isWinning: false
    }
  ];

  useEffect(() => {
    
    setTimeout(() => {
      setBidHistory(mockBidHistory);
      setIsLoading(false);
    }, 300);
  }, [auctionId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - bidTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getBidderDisplay = (bidder, isCurrentUser) => {
    if (isCurrentUser) {
      return (
        <span className="font-medium text-blue-600 flex items-center">
          <User className="h-3 w-3 mr-1" />
          You
        </span>
      );
    }
    
    
    const maskedName = bidder.charAt(0) + '*'.repeat(Math.max(0, bidder.length - 2)) + (bidder.length > 1 ? bidder.slice(-1) : '');
    return (
      <span className="font-medium text-gray-700 flex items-center">
        <User className="h-3 w-3 mr-1" />
        {maskedName}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Bid History ({bidHistory.length})
        </h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showHistory ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show All
            </>
          )}
        </button>
      </div>

      {/* Current High Bidder */}
      {bidHistory.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">Current High Bidder</p>
                <div className="flex items-center mt-1">
                  {getBidderDisplay(bidHistory[0].bidder, bidHistory[0].isCurrentUser)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">
                {formatPrice(bidHistory[0].amount)}
              </div>
              <div className="text-sm text-green-600">
                {getTimeAgo(bidHistory[0].timestamp)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid History List */}
      <div className="space-y-3">
        {(showHistory ? bidHistory : bidHistory.slice(0, 5)).map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              bid.isCurrentUser
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100'
            } ${index === 0 ? 'ring-2 ring-green-200' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              
              <div>
                <div className="flex items-center space-x-2">
                  {getBidderDisplay(bid.bidder, bid.isCurrentUser)}
                  {index === 0 && (
                    <Crown className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {formatTime(bid.timestamp)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`font-semibold ${
                bid.isCurrentUser ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {formatPrice(bid.amount)}
              </div>
              <div className="text-xs text-gray-500">
                {getTimeAgo(bid.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {!showHistory && bidHistory.length > 5 && (
          <button
            onClick={() => setShowHistory(true)}
            className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Show {bidHistory.length - 5} more bids
          </button>
        )}
      </div>

      {/* Bidding Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {bidHistory.length}
            </div>
            <div className="text-xs text-gray-500">Total Bids</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {new Set(bidHistory.map(b => b.bidder)).size}
            </div>
            <div className="text-xs text-gray-500">Unique Bidders</div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start text-xs text-gray-500">
          <Shield className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <p>
            Bidder usernames are masked to protect privacy. Only you can see your own bids clearly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BidHistory;