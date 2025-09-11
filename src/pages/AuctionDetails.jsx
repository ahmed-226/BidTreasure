import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  Heart, 
  Eye, 
  Share2, 
  Flag, 
  Star,
  MapPin,
  Shield,
  Truck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Users,
  Calendar,
  Package,
  DollarSign,
  Award,
  ChevronDown,
  ChevronUp,
  Target,
  Timer,
  CheckCircle
} from 'lucide-react';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [maxBidAmount, setMaxBidAmount] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [showMaxBidForm, setShowMaxBidForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const mockAuction = {
    id: parseInt(id),
    title: "Vintage Rolex Submariner 1965 - Excellent Condition",
    description: "This exceptional vintage Rolex Submariner from 1965 represents one of the most sought-after timepieces in horological history. The watch features the iconic black dial with luminous hour markers, the distinctive Mercedes hands, and the legendary rotating bezel.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3acd481a46d?w=800&h=600&fit=crop"
    ],
    currentBid: 15500,
    startingBid: 8000,
    reservePrice: 12000,
    reserveMet: true,
    bidIncrement: 250,
    timeRemaining: "2h 34m 15s",
    endDate: "2024-12-15T18:00:00Z",
    bidCount: 23,
    watchCount: 89,
    viewCount: 1247,
    category: "Watches",
    condition: "Excellent",
    location: "New York, NY",
    shipping: {
      cost: 25,
      handlingTime: "1-2 business days"
    },
    seller: {
      displayName: "Premium Watch Collector",
      rating: 4.9,
      feedbackCount: 342,
      memberSince: "2018",
      verified: true,
      topRated: true
    },
    specifications: {
      "Brand": "Rolex",
      "Model": "Submariner",
      "Year": "1965",
      "Case Material": "Stainless Steel",
      "Case Size": "40mm"
    },
    features: [
      "Original Box & Papers",
      "Recently Serviced",
      "Excellent Condition"
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setAuction(mockAuction);
      setBidAmount((mockAuction.currentBid + mockAuction.bidIncrement).toString());
      setIsLoading(false);
    }, 1000);
  }, [id]);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(bidAmount) >= auction.currentBid + auction.bidIncrement) {
      setAuction(prev => ({
        ...prev,
        currentBid: parseFloat(bidAmount),
        bidCount: prev.bidCount + 1
      }));
      setShowBidForm(false);
      setBidAmount((parseFloat(bidAmount) + auction.bidIncrement).toString());
    }
  };

  const handleMaxBidSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(maxBidAmount) >= auction.currentBid + auction.bidIncrement) {
      setShowMaxBidForm(false);
      alert(`Maximum bid of ${formatPrice(parseFloat(maxBidAmount))} has been set!`);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % auction.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + auction.images.length) % auction.images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h2>
          <p className="text-gray-600 mb-6">The auction you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/search" className="text-blue-600 hover:text-blue-800">Auctions</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{auction.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="relative">
                <img
                  src={auction.images[currentImageIndex]}
                  alt={auction.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Image Navigation */}
                {auction.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {auction.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {auction.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${auction.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {auction.description}
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(auction.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {auction.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Bidding and Details */}
          <div className="space-y-6">
            {/* Auction Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${
                  timeLeft === 'Auction Ended' ? 'text-gray-500' : 'text-red-600'
                }`}>
                  {timeLeft}
                </div>
                <p className="text-gray-600">
                  {timeLeft === 'Auction Ended' ? 'This auction has ended' : 'Time remaining'}
                </p>
              </div>

              {/* Current Bid */}
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatPrice(auction.currentBid)}
                </div>
                <p className="text-gray-600">Current bid</p>
                {auction.reserveMet && (
                  <div className="flex items-center justify-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Reserve met</span>
                  </div>
                )}
              </div>

              {/* Bidding Actions */}
              {timeLeft !== 'Auction Ended' && (
                <div className="space-y-3">
                  {!showBidForm && !showMaxBidForm && (
                    <>
                      <button
                        onClick={() => setShowBidForm(true)}
                        className="w-full btn-primary text-lg py-3"
                      >
                        <Gavel className="h-5 w-5 mr-2" />
                        Place Bid
                      </button>
                      <button
                        onClick={() => setShowMaxBidForm(true)}
                        className="w-full btn-secondary"
                      >
                        Set Max Bid
                      </button>
                    </>
                  )}

                  {/* Bid Form */}
                  {showBidForm && (
                    <form onSubmit={handleBidSubmit} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your bid (minimum {formatPrice(auction.currentBid + auction.bidIncrement)})
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            min={auction.currentBid + auction.bidIncrement}
                            step={auction.bidIncrement}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowBidForm(false)}
                          className="flex-1 btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 btn-primary"
                        >
                          Place Bid
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Max Bid Form */}
                  {showMaxBidForm && (
                    <form onSubmit={handleMaxBidSubmit} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum bid amount
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            value={maxBidAmount}
                            onChange={(e) => setMaxBidAmount(e.target.value)}
                            min={auction.currentBid + auction.bidIncrement}
                            step={auction.bidIncrement}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          We'll automatically bid up to this amount for you
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowMaxBidForm(false)}
                          className="flex-1 btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 btn-primary"
                        >
                          Set Max Bid
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setIsWatched(!isWatched)}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border transition-colors ${
                    isWatched 
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isWatched ? 'fill-current' : ''}`} />
                  {isWatched ? 'Watching' : 'Watch'}
                </button>
                <button className="flex items-center justify-center py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Auction Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Bids</span>
                  </div>
                  <span className="font-semibold">{auction.bidCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Watchers</span>
                  </div>
                  <span className="font-semibold">{auction.watchCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Views</span>
                  </div>
                  <span className="font-semibold">{auction.viewCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Starting bid</span>
                  </div>
                  <span className="font-semibold">{formatPrice(auction.startingBid)}</span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">
                      {auction.seller.displayName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900">{auction.seller.displayName}</span>
                      {auction.seller.verified && (
                        <Shield className="h-4 w-4 text-blue-500 ml-2" />
                      )}
                      {auction.seller.topRated && (
                        <Award className="h-4 w-4 text-yellow-500 ml-1" />
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">
                        {auction.seller.rating} ({auction.seller.feedbackCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{auction.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Member since {auction.seller.memberSince}</span>
                  </div>
                </div>

                <button className="w-full btn-secondary flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </button>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Handling</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Shipping cost</span>
                  </div>
                  <span className="font-semibold">{formatPrice(auction.shipping.cost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Handling time</span>
                  </div>
                  <span className="font-semibold">{auction.shipping.handlingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Ships from</span>
                  </div>
                  <span className="font-semibold">{auction.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;