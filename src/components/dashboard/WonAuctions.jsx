import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import {
  CheckCircle,
  Clock,
  CreditCard,
  Truck,
  Star,
  Download,
  AlertTriangle,
  Package,
  Calendar,
  DollarSign,
  MessageCircle,
  ExternalLink,
  Award,
  Shield,
  RefreshCw
} from 'lucide-react';

const WonAuctions = ({ formatPrice }) => {
  const [wonAuctions, setWonAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const mockWonAuctions = [
    {
      id: 1,
      itemTitle: "Apple MacBook Pro 16-inch M3 Max",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=150&fit=crop",
      winningBid: 2100,
      platformFee: 210,
      shippingCost: 25,
      totalAmount: 2335,
      wonDate: "2024-02-14T15:30:00Z",
      paymentStatus: "paid",
      paymentDate: "2024-02-14T16:00:00Z",
      shippingStatus: "shipped",
      trackingNumber: "1Z999AA1234567890",
      estimatedDelivery: "2024-02-18",
      sellerName: "TechDeals Pro",
      sellerRating: 4.8,
      category: "Electronics",
      invoiceUrl: "/invoices/inv_001.pdf",
      protectionCoverage: true,
      insuranceAmount: 2500
    },
    {
      id: 2,
      itemTitle: "Vintage Omega Speedmaster Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop",
      winningBid: 3200,
      platformFee: 320,
      shippingCost: 45,
      totalAmount: 3565,
      wonDate: "2024-02-12T18:45:00Z",
      paymentStatus: "paid",
      paymentDate: "2024-02-12T19:00:00Z",
      shippingStatus: "delivered",
      trackingNumber: "1Z999BB9876543210",
      deliveredDate: "2024-02-16",
      sellerName: "Luxury Timepieces",
      sellerRating: 4.9,
      category: "Watches",
      invoiceUrl: "/invoices/inv_002.pdf",
      canReview: true,
      protectionCoverage: true,
      insuranceAmount: 3500,
      deliveryConfirmation: true
    },
    {
      id: 3,
      itemTitle: "Gibson Les Paul Standard Guitar",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop",
      winningBid: 1800,
      platformFee: 180,
      shippingCost: 65,
      totalAmount: 2045,
      wonDate: "2024-02-13T20:15:00Z",
      paymentStatus: "pending",
      paymentDueDate: "2024-02-16T20:15:00Z",
      shippingStatus: "pending_payment",
      sellerName: "Music Instruments Co",
      sellerRating: 4.6,
      category: "Musical Instruments",
      daysLeft: 2,
      protectionCoverage: true,
      insuranceAmount: 2000,
      paymentReminders: 2
    },
    {
      id: 4,
      itemTitle: "Original Banksy Print Limited Edition",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=150&fit=crop",
      winningBid: 5500,
      platformFee: 550,
      shippingCost: 125,
      totalAmount: 6175,
      wonDate: "2024-02-10T14:20:00Z",
      paymentStatus: "paid",
      paymentDate: "2024-02-10T15:00:00Z",
      shippingStatus: "preparing",
      sellerName: "Art Gallery NYC",
      sellerRating: 4.7,
      category: "Art",
      invoiceUrl: "/invoices/inv_004.pdf",
      protectionCoverage: true,
      insuranceAmount: 6000,
      authenticationCertificate: true
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setWonAuctions(mockWonAuctions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getShippingStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'preparing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending_payment':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getShippingStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'pending_payment':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAuctions = wonAuctions.filter(auction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'payment_pending') return auction.paymentStatus === 'pending';
    if (activeFilter === 'shipped') return auction.shippingStatus === 'shipped';
    if (activeFilter === 'delivered') return auction.shippingStatus === 'delivered';
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'All Orders', count: wonAuctions.length },
    { value: 'payment_pending', label: 'Payment Pending', count: wonAuctions.filter(a => a.paymentStatus === 'pending').length },
    { value: 'shipped', label: 'Shipped', count: wonAuctions.filter(a => a.shippingStatus === 'shipped').length },
    { value: 'delivered', label: 'Delivered', count: wonAuctions.filter(a => a.shippingStatus === 'delivered').length }
  ];

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Won Auctions</h2>
        <p className="text-gray-600">Manage your won items, payments, and deliveries</p>
      </div>

      {/* Payment Reminders */}
      {wonAuctions.some(a => a.paymentStatus === 'pending') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800">Pending Payments</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have {wonAuctions.filter(a => a.paymentStatus === 'pending').length} items waiting for payment.
                Complete payment to secure your items and start shipping.
              </p>
              <button className="mt-2 btn-primary text-sm">
                Pay All Outstanding
              </button>
            </div>
          </div>
        </div>
      )}

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


      {/* Won Auctions List */}
      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No won auctions found</h3>
          <p className="text-gray-500">
            {activeFilter === 'all'
              ? "You haven't won any auctions yet."
              : `No auctions match the "${activeFilter.replace('_', ' ')}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAuctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="space-y-6">
                {/* Top Section: Item Info and Image */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Item Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={auction.image}
                      alt={auction.itemTitle}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                    />
                    {auction.protectionCoverage && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <Shield className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">
                      {auction.itemTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {auction.category}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Won on {new Date(auction.wonDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="text-gray-400 mr-1">Seller:</span>
                        {auction.sellerName}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        {auction.sellerRating}
                      </span>
                      {auction.authenticationCertificate && (
                        <span className="flex items-center text-blue-600">
                          <Award className="h-4 w-4 mr-1" />
                          Authenticated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex-shrink-0 flex flex-col gap-3">  {/* Changed from space-y-2 space-x-2 to flex flex-col gap-3 */}
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium text-sm ${getPaymentStatusColor(auction.paymentStatus)}`}>
                      {auction.paymentStatus === 'paid' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      <span className="capitalize">
                        Payment {auction.paymentStatus}
                      </span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-2 rounded-lg border font-medium text-sm ${getShippingStatusColor(auction.shippingStatus)}`}>
                      {getShippingStatusIcon(auction.shippingStatus)}
                      <span className="ml-2 capitalize">
                        {auction.shippingStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Winning Bid</p>
                    <p className="font-semibold text-gray-900 text-lg">{formatPrice(auction.winningBid)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Platform Fee</p>
                    <p className="font-semibold text-purple-600 text-lg">{formatPrice(auction.platformFee)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Shipping</p>
                    <p className="font-semibold text-blue-600 text-lg">{formatPrice(auction.shippingCost)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-green-600 text-lg">{formatPrice(auction.totalAmount)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {auction.invoiceUrl && (
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download Invoice
                    </button>
                  )}
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Contact Seller
                  </button>
                  {auction.canReview && (
                    <button
                      onClick={() => {
                        setSelectedAuction(auction);
                        setShowReviewModal(true);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Leave Review
                    </button>
                  )}
                  {auction.authenticationCertificate && (
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm">
                      <Award className="h-4 w-4 mr-1" />
                      View Certificate
                    </button>
                  )}
                </div>

                {/* Payment Pending Alert */}
                {auction.paymentStatus === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-800">Payment Required</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Please complete payment by {new Date(auction.paymentDueDate).toLocaleDateString()}
                          ({auction.daysLeft} days remaining)
                        </p>
                        {auction.paymentReminders > 0 && (
                          <p className="text-xs text-yellow-600 mt-1">
                            {auction.paymentReminders} reminder(s) sent
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                            Pay Now
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                            Contact Seller
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Package Tracking */}
                {auction.trackingNumber && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">Package Tracking</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Tracking: {auction.trackingNumber}
                        </p>
                        {auction.estimatedDelivery && (
                          <p className="text-sm text-blue-700">
                            Estimated delivery: {new Date(auction.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                        {auction.deliveredDate && (
                          <p className="text-sm text-green-700">
                            Delivered on: {new Date(auction.deliveredDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Track Package
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Insurance Coverage Info */}
                {auction.insuranceAmount && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Insured up to {formatPrice(auction.insuranceAmount)}
                    </span>
                    {auction.protectionCoverage && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Buyer Protection Included
                      </span>
                    )}
                    {auction.deliveryConfirmation && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        Delivery Confirmed
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/*  Summary Stats */}
      {filteredAuctions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 bg-green-50 border-green-200">
          <h3 className="font-semibold text-gray-900 mb-4">Winning Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {wonAuctions.length}
              </p>
              <p className="text-sm text-gray-600">Total Won</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(wonAuctions.reduce((sum, auction) => sum + auction.totalAmount, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {wonAuctions.filter(a => a.paymentStatus === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending Payment</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {wonAuctions.filter(a => a.shippingStatus === 'delivered').length}
              </p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </div>
        </div>
      )}
      {/* Review Modal (placeholder) */}
      {showReviewModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
            <p className="text-gray-600 mb-4">
              How was your experience with {selectedAuction.sellerName}?
            </p>
            <div className="flex space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-yellow-400 fill-current cursor-pointer" />
              ))}
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              rows="3"
              placeholder="Share your feedback..."
            ></textarea>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button className="btn-primary flex-1">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WonAuctions;