import React, { useState, useEffect } from 'react';
import {
  Clock,
  Heart,
  Eye,
  Gavel,
  Users,
  DollarSign,
  Target,
  Timer,
  TrendingUp,
  AlertCircle,
  Zap,
  Settings,
  Check,
  X
} from 'lucide-react';

const LiveBiddingPanel = ({ auctionId, user }) => {
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [maxBidAmount, setMaxBidAmount] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [showAutoBidForm, setShowAutoBidForm] = useState(false);
  const [showBidConfirm, setShowBidConfirm] = useState(false); 
  const [showAutoBidConfirm, setShowAutoBidConfirm] = useState(false); 
  const [isWatched, setIsWatched] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [autoBidMaxLimit, setAutoBidMaxLimit] = useState('');
  const [autoBidIncrement, setAutoBidIncrement] = useState(250);
  const [currentAutoBid, setCurrentAutoBid] = useState(null);

  
  const mockAuction = {
    id: auctionId,
    currentBid: 15500,
    startingBid: 8000,
    reservePrice: 12000,
    reserveMet: true,
    bidIncrement: 250,
    endDate: "2024-12-15T18:00:00Z",
    bidCount: 23,
    watchCount: 89,
    viewCount: 1247,
    buyItNowPrice: 18000,
    isActive: true,
    highBidder: "collector89"
  };

  useEffect(() => {
    setTimeout(() => {
      setAuction(mockAuction);
      setBidAmount((mockAuction.currentBid + mockAuction.bidIncrement).toString());
      setAutoBidIncrement(mockAuction.bidIncrement);
      setIsLoading(false);
    }, 500);
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endDate).getTime();
      const distance = endTime - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Auction Ended');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  
  useEffect(() => {
    if (!auction || !autoBidEnabled || !currentAutoBid) return;

    const checkForNewBids = () => {
      if (auction.highBidder !== 'You' && 
          auction.currentBid < parseFloat(autoBidMaxLimit)) {
        
        const newBidAmount = auction.currentBid + autoBidIncrement;
        
        if (newBidAmount <= parseFloat(autoBidMaxLimit)) {
          handleAutoBid(newBidAmount);
        } else {
          setAutoBidEnabled(false);
          
          showNotification(`Auto-bid limit reached! Maximum bid of ${formatPrice(parseFloat(autoBidMaxLimit))} was hit.`, 'warning');
        }
      }
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.1 && auction.highBidder === 'You') {
        setAuction(prev => ({
          ...prev,
          currentBid: prev.currentBid + prev.bidIncrement,
          highBidder: 'Someone else',
          bidCount: prev.bidCount + 1
        }));
        checkForNewBids();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [auction, autoBidEnabled, currentAutoBid, autoBidMaxLimit, autoBidIncrement]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-600 text-white' : 
      type === 'warning' ? 'bg-yellow-600 text-white' : 
      'bg-blue-600 text-white'
    }`;
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(bidAmount) >= auction.currentBid + auction.bidIncrement) {
      setShowBidConfirm(true);
    }
  };

  const confirmBid = () => {
    setAuction(prev => ({
      ...prev,
      currentBid: parseFloat(bidAmount),
      bidCount: prev.bidCount + 1,
      highBidder: 'You'
    }));
    setShowBidForm(false);
    setShowBidConfirm(false);
    setBidAmount((parseFloat(bidAmount) + auction.bidIncrement).toString());
    
    showNotification('Bid placed successfully!', 'success');
    
  };

  const cancelBid = () => {
    setShowBidConfirm(false);
  };



  const handleAutoBidSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(autoBidMaxLimit) >= auction.currentBid + autoBidIncrement) {
      setShowAutoBidConfirm(true);
    }
  };

  const confirmAutoBid = () => {
    setCurrentAutoBid({
      maxLimit: parseFloat(autoBidMaxLimit),
      increment: autoBidIncrement,
      startTime: new Date().toISOString()
    });
    setAutoBidEnabled(true);
    setShowAutoBidForm(false);
    setShowAutoBidConfirm(false);
    showNotification(`Auto-bid activated! Will bid up to ${formatPrice(parseFloat(autoBidMaxLimit))} with ${formatPrice(autoBidIncrement)} increments.`, 'info');
  };

  const cancelAutoBid = () => {
    setShowAutoBidConfirm(false);
  };

  const handleAutoBid = (bidAmount) => {
    setAuction(prev => ({
      ...prev,
      currentBid: bidAmount,
      bidCount: prev.bidCount + 1,
      highBidder: 'You'
    }));
    
    showNotification(`Auto-bid placed: ${formatPrice(bidAmount)}`, 'info');
  };

  const disableAutoBid = () => {
    setAutoBidEnabled(false);
    setCurrentAutoBid(null);
    setAutoBidMaxLimit('');
    showNotification('Auto-bid disabled', 'info');
  };

  const handleBuyItNow = () => {
    if (auction.buyItNowPrice) {
      showNotification(`Congratulations! You bought this item for ${formatPrice(auction.buyItNowPrice)}`, 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center">Unable to load auction data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6  top-4">


      {/* Time Remaining */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Timer className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-lg font-bold text-red-600">{timeLeft}</span>
        </div>
        <p className="text-gray-600 text-sm">Time remaining</p>
      </div>

      {/* Current Bid */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-green-600 mb-1">
          {formatPrice(auction.currentBid)}
        </div>
        <p className="text-gray-600">Current bid</p>
        <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{auction.bidCount} bids</span>
          <Eye className="h-4 w-4 ml-4 mr-1" />
          <span>{auction.watchCount} watching</span>
        </div>
        {auction.highBidder === 'You' && (
          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            You're the high bidder!
          </div>
        )}
      </div>

      {/* Auto-bid Status */}
      {autoBidEnabled && currentAutoBid && (
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Auto-bid Active</span>
              </div>
              <button
                onClick={disableAutoBid}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Disable
              </button>
            </div>
            <div className="mt-1 text-xs text-blue-700">
              Up to {formatPrice(currentAutoBid.maxLimit)} with {formatPrice(autoBidIncrement)} increments
            </div>
          </div>
        </div>
      )}

      {/* Reserve Status */}
      {auction.reservePrice && (
        <div className="mb-4">
          <div className={`flex items-center justify-center py-2 px-4 rounded-lg ${
            auction.reserveMet 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
          }`}>
            <Target className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {auction.reserveMet ? 'Reserve met' : `Reserve not met (${formatPrice(auction.reservePrice)})`}
            </span>
          </div>
        </div>
      )}

      {/* Bidding Section */}
      {auction.isActive && timeLeft !== 'Auction Ended' ? (
        <div className="space-y-3">
          {/* Quick Bid */}
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Gavel className="h-5 w-5 mr-2" />
              Bid {formatPrice(auction.currentBid + auction.bidIncrement)}
            </button>
          ) : (
            <form onSubmit={handleBidSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your bid (minimum: {formatPrice(auction.currentBid + auction.bidIncrement)})
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={auction.currentBid + auction.bidIncrement}
                  step={auction.bidIncrement}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your bid"
                />
              </div>
              
              {/* UPDATED: Inline Confirmation instead of separate step */}
              {!showBidConfirm ? (
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Place Bid
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 mb-3 font-medium">
                    Confirm your bid of {formatPrice(parseFloat(bidAmount))}?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={confirmBid}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm Bid
                    </button>
                    <button
                      type="button"
                      onClick={cancelBid}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}


          {/* Auto-bid Feature */}
          {!autoBidEnabled && !showAutoBidForm ? (
            <button
              onClick={() => setShowAutoBidForm(true)}
              className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center justify-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              Enable Auto-Bid
            </button>
          ) : !autoBidEnabled && showAutoBidForm ? (
            <form onSubmit={handleAutoBidSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-bid up to (maximum limit)
                </label>
                <input
                  type="number"
                  value={autoBidMaxLimit}
                  onChange={(e) => setAutoBidMaxLimit(e.target.value)}
                  min={auction.currentBid + autoBidIncrement}
                  step={autoBidIncrement}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={`Enter maximum (e.g., ${auction.currentBid + 1000})`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-bid increment
                </label>
                <select
                  value={autoBidIncrement}
                  onChange={(e) => setAutoBidIncrement(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={250}>$250 (Recommended)</option>
                  <option value={500}>$500</option>
                  <option value={1000}>$1,000</option>
                  <option value={auction.bidIncrement}>Minimum ({formatPrice(auction.bidIncrement)})</option>
                </select>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Settings className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                  <div className="text-xs text-purple-700">
                    <p className="font-medium mb-1">How Auto-bid Works:</p>
                    <ul className="space-y-1">
                      <li>• Automatically bids {formatPrice(autoBidIncrement)} above any new high bid</li>
                      <li>• Stops when your maximum limit is reached</li>
                      <li>• You'll be notified of each auto-bid placed</li>
                      <li>• Can be disabled at any time</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* UPDATED: Auto-bid Confirmation */}
              {!showAutoBidConfirm ? (
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Enable Auto-Bid
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAutoBidForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-800 mb-3 font-medium">
                    Enable auto-bid up to {formatPrice(parseFloat(autoBidMaxLimit))} with {formatPrice(autoBidIncrement)} increments?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={confirmAutoBid}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={cancelAutoBid}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : null}

          {/* Buy It Now */}
          {auction.buyItNowPrice && (
            <button
              onClick={handleBuyItNow}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Buy It Now - {formatPrice(auction.buyItNowPrice)}
            </button>
          )}

          {/* Watch Item */}
          <button
            onClick={() => setIsWatched(!isWatched)}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
              isWatched
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-4 w-4 mr-2 ${isWatched ? 'fill-current' : ''}`} />
            {isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">Auction has ended</p>
    </div>
      )}

      {/* Bid Increment Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Bid increments: {formatPrice(auction.bidIncrement)}
        </p>
      </div>
    </div>
  );
};

export default LiveBiddingPanel;