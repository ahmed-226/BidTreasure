import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  MessageCircle, 
  Package, 
  Clock, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const MessageNotifications = ({ unreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 'notif_001',
      type: 'new_message',
      title: 'New message from Sarah Johnson',
      message: 'Is the watch still available? I\'m very interested.',
      itemTitle: 'Vintage Rolex Submariner',
      timestamp: '2024-02-15T10:30:00Z',
      isRead: false,
      urgent: true,
      conversationId: 1
    },
    {
      id: 'notif_002',
      type: 'inquiry_received',
      title: 'New inquiry about your listing',
      message: 'Someone is interested in your MacBook Pro',
      itemTitle: 'MacBook Pro 16-inch M3',
      timestamp: '2024-02-15T09:15:00Z',
      isRead: false,
      urgent: false,
      conversationId: 2
    },
    {
      id: 'notif_003',
      type: 'payment_reminder',
      title: 'Payment confirmation received',
      message: 'Payment has been processed for your won auction',
      itemTitle: 'Vintage Guitar Collection',
      timestamp: '2024-02-14T16:45:00Z',
      isRead: true,
      urgent: false,
      conversationId: 3
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_message':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'inquiry_received':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'payment_reminder':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);

 return null;
 
};

export default MessageNotifications;