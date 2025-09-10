import React from 'react';
import { 
  Gavel, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const DashboardOverview = ({ dashboardData, formatPrice }) => {
  return (
    <div className="space-y-8">
      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {dashboardData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${
                  activity.type === 'won_auction' ? 'bg-green-100' :
                  activity.type === 'outbid' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'won_auction' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : activity.type === 'outbid' ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Gavel className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPrice(activity.amount)}</p>
                <p className={`text-sm capitalize ${
                  activity.status === 'won' ? 'text-green-600' :
                  activity.status === 'outbid' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {activity.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Bidding Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">{dashboardData.stats.successRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${dashboardData.stats.successRate}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.totalBids}</p>
                <p className="text-sm text-gray-600">Total Bids</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{dashboardData.stats.wonAuctions}</p>
                <p className="text-sm text-gray-600">Won</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Total Spent</span>
              <span className="font-semibold text-gray-900">{formatPrice(dashboardData.stats.totalSpent)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Total Earned</span>
              <span className="font-semibold text-green-600">{formatPrice(dashboardData.stats.totalEarned)}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-900">Net Position</span>
              <span className={`font-bold ${
                dashboardData.stats.totalEarned - dashboardData.stats.totalSpent >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatPrice(dashboardData.stats.totalEarned - dashboardData.stats.totalSpent)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {dashboardData.notifications.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h3>
          <div className="space-y-4">
            {dashboardData.notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${
                  notification.urgent 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <AlertCircle className={`h-5 w-5 mr-3 mt-0.5 ${
                      notification.urgent ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;