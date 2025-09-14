import React, { useState } from 'react';
import { useAuction } from '../../contexts/AuctionContext';
import {
  Bell,
  X,
  Gavel,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';

const AuctionNotifications = () => {
  const { notifications, markNotificationAsRead } = useAuction();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const recentNotifications = notifications.slice(0, 10);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'outbid':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'bid_placed':
        return <Gavel className="h-4 w-4 text-blue-500" />;
      case 'auto_bid_placed':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'auto_bid_set':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'buy_it_now':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'auction_ending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'auction_won':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'watch_added':
        return <Eye className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type, urgent) => {
    if (urgent) return 'border-l-red-500 bg-red-50';
    
    switch (type) {
      case 'outbid':
        return 'border-l-red-500 bg-red-50';
      case 'bid_placed':
      case 'auto_bid_placed':
        return 'border-l-blue-500 bg-blue-50';
      case 'auto_bid_set':
      case 'buy_it_now':
      case 'auction_won':
        return 'border-l-green-500 bg-green-50';
      case 'auction_ending':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getNotificationColor(notification.type, notification.urgent)} ${
                      !notification.isRead ? 'font-medium' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm ${!notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        {notification.amount && (
                          <p className="text-sm font-medium text-green-600">
                            ${notification.amount.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  recentNotifications.forEach(notif => {
                    if (!notif.isRead) markNotificationAsRead(notif.id);
                  });
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuctionNotifications;