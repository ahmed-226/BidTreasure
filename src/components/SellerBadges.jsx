import React, { useState, useEffect } from 'react';
import {
  Shield,
  Star,
  Award,
  CheckCircle,
  Zap,
  Crown,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ThumbsUp,
  Clock,
  Package,
  MessageCircle
} from 'lucide-react';

const SellerBadges = ({ sellerId, displayMode = 'full' }) => {
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const badgeTypes = {
    verified: {
      id: 'verified',
      name: 'Verified Seller',
      icon: Shield,
      color: 'blue',
      description: 'Identity and business details verified',
      requirements: ['Complete identity verification', 'Provide business documentation'],
      benefits: ['Increased buyer trust', 'Higher search ranking'],
      rarity: 'common'
    },
    top_rated: {
      id: 'top_rated',
      name: 'Top Rated',
      icon: Star,
      color: 'yellow',
      description: 'Consistently excellent customer service',
      requirements: ['4.8+ rating', '100+ transactions'],
      benefits: ['Top Rated badge', 'Priority customer support'],
      rarity: 'uncommon'
    },
    fast_shipper: {
      id: 'fast_shipper',
      name: 'Fast Shipper',
      icon: Zap,
      color: 'green',
      description: 'Ships items quickly and efficiently',
      requirements: ['Ships within 1 business day', '98% on-time rate'],
      benefits: ['Fast shipping badge', 'Search priority'],
      rarity: 'common'
    }
  };

  const mockBadges = [
    {
      id: 'verified',
      earnedDate: '2024-01-15T10:00:00Z',
      progress: 100,
      isActive: true
    },
    {
      id: 'top_rated',
      progress: 75,
      isActive: false,
      requirementsStatus: {
        'Rating': { current: 4.6, required: 4.8, percentage: 95 },
        'Transactions': { current: 85, required: 100, percentage: 85 }
      }
    }
  ];

  const mockStats = {
    totalBadges: 1,
    badgeScore: 850,
    rank: 'Top 15%',
    nextBadgeProgress: 75
  };

  useEffect(() => {
    setTimeout(() => {
      setBadges(mockBadges);
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, [sellerId]);

  const getBadgeColor = (colorName) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[colorName] || colors.blue;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (displayMode === 'compact') {
    const earnedBadges = badges.filter(badge => badge.isActive);
    return (
      <div className="flex items-center space-x-2">
        {earnedBadges.map((badge) => {
          const badgeType = badgeTypes[badge.id];
          if (!badgeType) return null;
          
          return (
            <div
              key={badge.id}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(badgeType.color)}`}
              title={badgeType.description}
            >
              <badgeType.icon className="h-3 w-3 mr-1" />
              {badgeType.name}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalBadges}</div>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.badgeScore}</div>
            <p className="text-sm text-gray-600">Badge Score</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{stats.rank}</div>
            <p className="text-sm text-gray-600">Seller Rank</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{stats.nextBadgeProgress}%</div>
            <p className="text-sm text-gray-600">Next Badge</p>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earned Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.filter(badge => badge.isActive).map((badge) => {
            const badgeType = badgeTypes[badge.id];
            if (!badgeType) return null;

            return (
              <div key={badge.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-full ${getBadgeColor(badgeType.color)}`}>
                    <badgeType.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{badgeType.name}</h4>
                    <p className="text-sm text-gray-500">Earned {formatDate(badge.earnedDate)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{badgeType.description}</p>
                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-1">Benefits:</p>
                  <ul className="space-y-1">
                    {badgeType.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Progress</h3>
        <div className="space-y-4">
          {badges.filter(badge => !badge.isActive).map((badge) => {
            const badgeType = badgeTypes[badge.id];
            if (!badgeType) return null;

            return (
              <div key={badge.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100">
                      <badgeType.icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900">{badgeType.name}</h4>
                      <p className="text-sm text-gray-500">{badgeType.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{badge.progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>

                {/* Requirements */}
                {badge.requirementsStatus && (
                  <div className="space-y-2">
                    {Object.entries(badge.requirementsStatus).map(([requirement, status]) => (
                      <div key={requirement} className="flex justify-between text-sm">
                        <span className="text-gray-600">{requirement}:</span>
                        <div className="flex items-center">
                          <span className={`font-medium ${status.percentage === 100 ? 'text-green-600' : 'text-gray-900'}`}>
                            {status.current} / {status.required}
                          </span>
                          {status.percentage === 100 && (
                            <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-2">Benefits when earned:</div>
                  <ul className="text-xs space-y-1">
                    {badgeType.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index} className="text-gray-600">• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerBadges;