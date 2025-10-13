import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
  Users,
  Package,
  MessageCircle,
  Award,
  AlertCircle
} from 'lucide-react';

const TrustScoreCalculator = ({ sellerId }) => {
  const [trustData, setTrustData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const mockTrustData = {
    overallScore: 4.8,
    trustLevel: 'Excellent',
    components: {
      verification: { score: 5.0, weight: 25, description: 'Identity verified' },
      ratings: { score: 4.8, weight: 30, description: 'Customer ratings' },
      transactions: { score: 4.9, weight: 20, description: 'Transaction history' },
      communication: { score: 4.7, weight: 15, description: 'Response time' },
      shipping: { score: 4.8, weight: 10, description: 'Shipping performance' }
    },
    badges: 3,
    recentTrend: 'positive'
  };

  useEffect(() => {
    setTimeout(() => {
      setTrustData(mockTrustData);
      setIsLoading(false);
    }, 1000);
  }, [sellerId]);

  const getTrustLevelColor = (level) => {
    const colors = {
      Excellent: 'text-green-600 bg-green-100',
      Good: 'text-blue-600 bg-blue-100',
      Fair: 'text-yellow-600 bg-yellow-100',
      Poor: 'text-red-600 bg-red-100'
    };
    return colors[level] || colors.Fair;
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Trust Score
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTrustLevelColor(trustData.trustLevel)}`}>
          {trustData.trustLevel}
        </span>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getScoreColor(trustData.overallScore)}`}>
          {trustData.overallScore}
        </div>
        <div className="flex justify-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 ${
                star <= trustData.overallScore
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600">Based on multiple trust factors</p>
      </div>

      {/* Components Breakdown */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Trust Components</h4>
        {Object.entries(trustData.components).map(([key, component]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 capitalize">{component.description}</span>
              <span className={`text-sm font-medium ${getScoreColor(component.score)}`}>
                {component.score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(component.score / 5) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              Weight: {component.weight}% of total score
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{trustData.badges}</div>
            <p className="text-sm text-gray-600">Trust Badges</p>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trustData.recentTrend}
            </div>
            <p className="text-sm text-gray-600">Recent Trend</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreCalculator;