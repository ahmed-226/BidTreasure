import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Heart, 
  Gavel, 
  Star,
  ChevronLeft,
  ChevronRight,
  Timer,
  ShoppingBag
} from 'lucide-react';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveStats, setLiveStats] = useState({
    activeUsers: 15847,
    liveAuctions: 1247,
    itemsSold: 89234,
    totalValue: 12580000
  });

  const featuredAuctions = [
    {
      id: 1,
      title: "Vintage Rolex Submariner 1965",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      currentBid: 15500,
      timeLeft: "2h 34m",
      bidCount: 23,
      category: "Watches"
    },
    {
      id: 2,
      title: "Original Banksy Street Art Piece",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      currentBid: 45000,
      timeLeft: "1d 5h",
      bidCount: 67,
      category: "Art"
    },
    {
      id: 3,
      title: "1969 Ford Mustang Boss 429",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      currentBid: 125000,
      timeLeft: "3d 12h",
      bidCount: 156,
      category: "Vehicles"
    }
  ];

  const trendingItems = [
    {
      id: 1,
      title: "MacBook Pro 16-inch M3",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop",
      currentBid: 2100,
      timeLeft: "4h 23m",
      bidCount: 34
    },
    {
      id: 2,
      title: "Hermès Birkin Bag",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
      currentBid: 8500,
      timeLeft: "2d 8h",
      bidCount: 89
    },
    {
      id: 3,
      title: "Pokémon Card Collection",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop",
      currentBid: 1200,
      timeLeft: "6h 45m",
      bidCount: 78
    },
    {
      id: 4,
      title: "Gibson Les Paul Guitar",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      currentBid: 3400,
      timeLeft: "1d 14h",
      bidCount: 45
    }
  ];

  const heroSlides = [
    {
      title: "Discover Rare Treasures",
      subtitle: "Bid on exclusive items from around the world",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=600&fit=crop",
      cta: "Start Bidding"
    },
    {
      title: "Sell Your Valuables",
      subtitle: "Reach millions of collectors and enthusiasts",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&h=600&fit=crop",
      cta: "List Your Item"
    },
    {
      title: "Live Auctions Daily",
      subtitle: "Experience the thrill of real-time bidding",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=600&fit=crop",
      cta: "View Live Auctions"
    }
  ];

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        liveAuctions: prev.liveAuctions + Math.floor(Math.random() * 6) - 3,
        itemsSold: prev.itemsSold + Math.floor(Math.random() * 3),
        totalValue: prev.totalValue + Math.floor(Math.random() * 10000) - 5000
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <section className="relative h-[calc(100vh-18rem)] overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                index === currentSlide ? 'translate-x-0' : 
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`
                }}
              >
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
                  <div className="text-white max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 animate-slide-up">
                      {slide.subtitle}
                    </p>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 animate-slide-up">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>
      {/* Live Statistics Bar */}
      <section className="h-[8rem] bg-primary-600 text-white py-6 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-full">
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{formatNumber(liveStats.activeUsers)}</span>
              </div>
              <p className="text-primary-100">Active Users</p>
            </div>
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="flex items-center justify-center mb-2">
                <Gavel className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{formatNumber(liveStats.liveAuctions)}</span>
              </div>
              <p className="text-primary-100">Live Auctions</p>
            </div>
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="flex items-center justify-center mb-2">
                <ShoppingBag className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{formatNumber(liveStats.itemsSold)}</span>
              </div>
              <p className="text-primary-100">Items Sold</p>
            </div>
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{formatPrice(liveStats.totalValue)}</span>
              </div>
              <p className="text-primary-100">Total Value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">Featured Auctions</h2>
            <p className="text-xl text-secondary-600">Don't miss these premium items ending soon</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAuctions.map((auction) => (
              <div key={auction.id} className="card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {auction.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Timer className="h-4 w-4 mr-1" />
                    {auction.timeLeft}
                  </div>
                  <button className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-secondary-600" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3 line-clamp-2">
                    {auction.title}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Current Bid:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(auction.currentBid)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-secondary-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {auction.bidCount} bids
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {auction.timeLeft}
                      </span>
                    </div>
                    <button className="w-full btn-primary">
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-secondary text-lg px-8 py-3">
              View All Featured Auctions
            </button>
          </div>
        </div>
      </section>

      {/* Trending Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-secondary-900 mb-4">Trending Now</h2>
              <p className="text-xl text-secondary-600">Hot items that everyone's bidding on</p>
            </div>
            <div className="flex items-center text-primary-600">
              <TrendingUp className="h-6 w-6 mr-2" />
              <span className="font-semibold">Live Updates</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.map((item) => (
              <div key={item.id} className="card overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    HOT
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(item.currentBid)}
                      </span>
                      <span className="text-sm text-secondary-500">
                        {item.bidCount} bids
                      </span>
                    </div>
                    <div className="text-sm text-red-600 font-medium">
                      {item.timeLeft} left
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">How BidTreasure Works</h2>
            <p className="text-xl text-secondary-600">Start bidding in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Browse & Discover</h3>
              <p className="text-secondary-600">
                Explore thousands of unique items across various categories. Use our advanced filters to find exactly what you're looking for.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Place Your Bid</h3>
              <p className="text-secondary-600">
                Set your maximum bid and let our system automatically bid for you, or manually place bids in real-time during live auctions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Win & Pay</h3>
              <p className="text-secondary-600">
                If you win, you'll be notified immediately. Complete your purchase securely and have your item shipped directly to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">Why Choose BidTreasure?</h2>
            <p className="text-xl text-secondary-600">Trusted by millions of buyers and sellers worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <div className="bg-green-500 p-2 rounded-full">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Secure Payments</h3>
              <p className="text-secondary-600 text-sm">SSL-encrypted transactions with buyer protection</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Verified Sellers</h3>
              <p className="text-secondary-600 text-sm">All sellers go through identity verification</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <div className="bg-purple-500 p-2 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">24/7 Support</h3>
              <p className="text-secondary-600 text-sm">Round-the-clock customer service</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <div className="bg-orange-500 p-2 rounded-full">
                  <Gavel className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Fair Bidding</h3>
              <p className="text-secondary-600 text-sm">Anti-sniping protection and transparent bidding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Never Miss a Deal</h2>
          <p className="text-xl text-primary-100 mb-8">
            Get notified about new auctions, ending soon alerts, and exclusive offers
          </p>
          <div className="flex flex-col md:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-primary-100 text-sm mt-4">
            Join 50,000+ subscribers. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
