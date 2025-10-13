import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Heart, 
  Gavel, 
  Package, 
  Settings, 
  CheckCircle,
  DollarSign,
  Shield,
  Star,
  Award
} from 'lucide-react';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import MyBids from '../components/dashboard/MyBids';
import WonAuctions from '../components/dashboard/WonAuctions';
import MyListings from '../components/dashboard/MyListings';
import Watchlist from '../components/dashboard/Watchlist';
import DashboardSettings from '../components/dashboard/DashboardSettings';
import FeedbackRatingSystem from '../components/FeedbackRatingSystem';
import SellerBadges from '../components/SellerBadges';
import DisputeResolution from '../components/DisputeResolution';

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    if (activeTab !== 'overview') {
      setSearchParams({ tab: activeTab });
    } else {
      setSearchParams({});
    }
  }, [activeTab, setSearchParams]);

  
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBids: 147,
      activeBids: 12,
      wonAuctions: 23,
      activeListings: 5,
      watchlistItems: 8,
      totalSpent: 45230,
      totalEarned: 12800,
      successRate: 78
    },
    recentActivity: [],
    notifications: []
  });

  useEffect(() => {
    
    setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        recentActivity: [
          {
            id: 1,
            type: 'bid_placed',
            title: 'Vintage Rolex Submariner',
            amount: 16000,
            time: '2 hours ago',
            status: 'active'
          },
          {
            id: 2,
            type: 'won_auction',
            title: 'MacBook Pro 16-inch',
            amount: 2100,
            time: '1 day ago',
            status: 'won'
          },
          {
            id: 3,
            type: 'outbid',
            title: 'Original Banksy Artwork',
            amount: 42000,
            time: '2 days ago',
            status: 'outbid'
          }
        ],
        notifications: [
          {
            id: 1,
            type: 'bid_reminder',
            message: 'Your bid on "Vintage Camera" ends in 30 minutes',
            time: '30 minutes ago',
            urgent: true
          },
          {
            id: 2,
            type: 'payment_due',
            message: 'Payment required for "MacBook Pro 16-inch"',
            time: '1 day ago',
            urgent: true
          }
        ]
      }));
      setIsLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'my-bids', label: 'My Bids', icon: Gavel },
    { id: 'won-auctions', label: 'Won Auctions', icon: CheckCircle },
    { id: 'my-listings', label: 'My Listings', icon: Package },
    { id: 'watchlist', label: 'Watchlist', icon: Heart },
    { id: 'trust', label: 'Trust & Reviews', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Manage your bids, listings, and account from your personal dashboard.
          </p>
        </div>

        {/* Quick Stats */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Bids</p>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.stats.activeBids}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Gavel className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Won Auctions</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.stats.wonAuctions}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Listings</p>
                  <p className="text-3xl font-bold text-purple-600">{dashboardData.stats.activeListings}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(dashboardData.stats.totalSpent)}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <DashboardOverview 
              dashboardData={dashboardData} 
              formatPrice={formatPrice}
            />
          )}
          {activeTab === 'my-bids' && (
            <MyBids formatPrice={formatPrice} />
          )}
          {activeTab === 'won-auctions' && (
            <WonAuctions formatPrice={formatPrice} />
          )}
          {activeTab === 'my-listings' && (
            <MyListings formatPrice={formatPrice} />
          )}
          {activeTab === 'watchlist' && (
            <Watchlist formatPrice={formatPrice} />
          )}
          {activeTab === 'trust' && (
            <div className="space-y-8">
              {/* Seller Badges Overview */}
              <SellerBadges sellerId={user?.id} displayMode="full" />
              
              {/* Reviews Section */}
              <FeedbackRatingSystem 
                sellerId={user?.id} 
                currentUser={user} 
                mode="can-review" 
              />
              
              {/* Disputes Section */}
              <DisputeResolution 
                userType="buyer" 
                userId={user?.id} 
              />

              {/* Verification CTA */}
              {!user?.isVerified && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Get Verified to Build Trust
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Verified sellers get more bids, higher final prices, and increased buyer confidence.
                      </p>
                      <button
                        onClick={() => navigate('/seller-verification')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Verification Process
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'settings' && (
            <DashboardSettings user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;