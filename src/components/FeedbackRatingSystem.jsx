import React, { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  Package,
  ShoppingCart,
  Award,
  TrendingUp,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  User
} from 'lucide-react';

const FeedbackRatingSystem = ({ sellerId, currentUser, mode = 'view' }) => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);

  
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    category: 'item_quality',
    wouldRecommend: true,
    transactionId: ''
  });

  const reviewCategories = [
    { value: 'item_quality', label: 'Item Quality', icon: Package },
    { value: 'communication', label: 'Communication', icon: MessageCircle },
    { value: 'shipping_speed', label: 'Shipping Speed', icon: TrendingUp },
    { value: 'overall_experience', label: 'Overall Experience', icon: Star }
  ];

  
  const mockFeedback = [
    {
      id: 'fb_001',
      buyerId: 'buyer_123',
      buyerName: 'Sarah Johnson',
      buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c108?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      title: 'Excellent seller, highly recommended!',
      comment: 'The Rolex watch was exactly as described. Shipping was fast and secure. Great communication throughout the process.',
      category: 'overall_experience',
      date: '2024-02-10T15:30:00Z',
      transactionId: 'txn_001',
      itemTitle: 'Vintage Rolex Submariner 1965',
      itemPrice: 15500,
      verifiedPurchase: true,
      helpful: 12,
      notHelpful: 0,
      sellerResponse: null,
      wouldRecommend: true,
      tags: ['fast_shipping', 'as_described', 'excellent_communication']
    },
    {
      id: 'fb_002',
      buyerId: 'buyer_456',
      buyerName: 'Michael Chen',
      buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      rating: 4,
      title: 'Good seller, minor packaging issue',
      comment: 'Item was authentic and in good condition. However, packaging could have been better for such an expensive item.',
      category: 'item_quality',
      date: '2024-02-08T10:15:00Z',
      transactionId: 'txn_002',
      itemTitle: 'Vintage Omega Speedmaster',
      itemPrice: 3200,
      verifiedPurchase: true,
      helpful: 8,
      notHelpful: 1,
      sellerResponse: {
        comment: 'Thank you for the feedback. I\'ve improved my packaging since then. All items now come with premium protective cases.',
        date: '2024-02-08T14:20:00Z'
      },
      wouldRecommend: true,
      tags: ['authentic', 'good_condition']
    },
    {
      id: 'fb_003',
      buyerId: 'buyer_789',
      buyerName: 'Emma Davis',
      buyerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      title: 'Outstanding service and quality',
      comment: 'Professional seller with deep knowledge of watches. Provided detailed authenticity certificates and history.',
      category: 'communication',
      date: '2024-02-05T16:45:00Z',
      transactionId: 'txn_003',
      itemTitle: 'Patek Philippe Calatrava',
      itemPrice: 25000,
      verifiedPurchase: true,
      helpful: 15,
      notHelpful: 0,
      sellerResponse: null,
      wouldRecommend: true,
      tags: ['professional', 'knowledgeable', 'authentic_certificates']
    }
  ];

  const mockStats = {
    overallRating: 4.8,
    totalReviews: 342,
    ratingDistribution: {
      5: 280,
      4: 45,
      3: 12,
      2: 3,
      1: 2
    },
    categoryRatings: {
      item_quality: 4.9,
      communication: 4.8,
      shipping_speed: 4.7,
      overall_experience: 4.8
    },
    recentTrend: 'positive',
    responseRate: 95,
    averageResponseTime: '2 hours',
    repeatCustomers: 68
  };

  useEffect(() => {
    
    setTimeout(() => {
      setFeedback(mockFeedback);
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, [sellerId]);

  const handleRatingClick = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) return;

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const review = {
        id: `fb_${Date.now()}`,
        buyerId: currentUser.id,
        buyerName: `${currentUser.firstName} ${currentUser.lastName}`,
        buyerAvatar: currentUser.avatar,
        ...newReview,
        date: new Date().toISOString(),
        verifiedPurchase: true,
        helpful: 0,
        notHelpful: 0,
        sellerResponse: null,
        tags: []
      };

      setFeedback(prev => [review, ...prev]);
      setShowAddReview(false);
      setNewReview({
        rating: 0,
        title: '',
        comment: '',
        category: 'item_quality',
        wouldRecommend: true,
        transactionId: ''
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStarColor = (rating, starIndex) => {
    if (starIndex <= rating) return 'text-yellow-400 fill-current';
    return 'text-gray-300';
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'positive' && item.rating >= 4) ||
      (activeFilter === 'negative' && item.rating < 4) ||
      (activeFilter === item.category);
    
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.overallRating}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${getStarColor(stats.overallRating, star)}`}
                />
              ))}
            </div>
            <p className="text-gray-600">Based on {stats.totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {stats.ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>

          {/* Category Ratings */}
          <div className="space-y-3">
            {reviewCategories.map((category) => (
              <div key={category.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <category.icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= stats.categoryRatings[category.value]
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.categoryRatings[category.value]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.responseRate}%</div>
              <p className="text-sm text-gray-600">Response Rate</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.averageResponseTime}</div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.repeatCustomers}%</div>
              <p className="text-sm text-gray-600">Repeat Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Reviews' },
              { value: 'positive', label: 'Positive (4-5★)' },
              { value: 'negative', label: 'Critical (1-3★)' },
              ...reviewCategories.map(cat => ({ value: cat.value, label: cat.label }))
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {mode === 'can-review' && (
              <button
                onClick={() => setShowAddReview(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredFeedback.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={review.buyerAvatar}
                  alt={review.buyerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.buyerName}</h4>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${getStarColor(review.rating, star)}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {reviewCategories.find(cat => cat.value === review.category)?.label}
                </div>
                {review.wouldRecommend && (
                  <div className="text-xs text-green-600 font-medium mt-1">
                    ✓ Recommends seller
                  </div>
                )}
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            {/* Transaction Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Item: {review.itemTitle}</span>
                <span className="font-medium text-gray-900">
                  ${review.itemPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Tags */}
            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {review.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Seller Response */}
            {review.sellerResponse && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Seller Response</span>
                  <span className="text-xs text-blue-600">
                    {formatDate(review.sellerResponse.date)}
                  </span>
                </div>
                <p className="text-blue-800 text-sm">{review.sellerResponse.comment}</p>
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsDown className="h-4 w-4" />
                  <span>Not helpful ({review.notHelpful})</span>
                </button>
              </div>
              
              {currentUser && currentUser.id === sellerId && !review.sellerResponse && (
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Respond to Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add Review</h3>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Category
                  </label>
                  <select
                    value={newReview.category}
                    onChange={(e) => setNewReview(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {reviewCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share details about your experience with this seller"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Recommendation */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newReview.wouldRecommend}
                    onChange={(e) => setNewReview(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    I would recommend this seller to others
                  </label>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={newReview.rating === 0}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* No Reviews State */}
      {filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search or filters' : 'Be the first to leave a review!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackRatingSystem;