import React, { createContext, useContext, useState, useEffect } from 'react';

const MessagingContext = createContext();

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

export const MessagingProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  
  useEffect(() => {
    const loadPersistedData = () => {
      try {
        const savedConversations = JSON.parse(localStorage.getItem('bidtreasure_conversations') || '[]');
        const savedNotifications = JSON.parse(localStorage.getItem('bidtreasure_notifications') || '[]');
        
        if (savedConversations.length > 0) {
          setConversations(savedConversations);
          const totalUnread = savedConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
          setUnreadCount(totalUnread);
        } else {
          
          initializeMockData();
        }
        
        if (savedNotifications.length > 0) {
          setNotifications(savedNotifications);
        }
      } catch (error) {
        console.error('Error loading persisted messaging data:', error);
        initializeMockData();
      }
    };

    loadPersistedData();
  }, []);

  
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('bidtreasure_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('bidtreasure_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const initializeMockData = () => {
    const mockConversations = [
      {
        id: 1,
        participantId: 'user_123',
        participantName: 'Sarah Johnson',
        participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c108?w=100&h=100&fit=crop&crop=face',
        participantRating: 4.8,
        itemId: 'auction_456',
        itemTitle: 'Vintage Rolex Submariner',
        itemImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        lastMessage: {
          id: 'msg_001',
          content: 'Is the watch still available? I\'m very interested.',
          timestamp: '2024-02-15T10:30:00Z',
          senderId: 'user_123',
          isRead: false
        },
        unreadCount: 2,
        type: 'buyer_inquiry',
        status: 'active',
        createdAt: '2024-02-15T09:00:00Z',
        isStarred: false,
        isArchived: false,
        messages: [
          {
            id: 'msg_001',
            conversationId: 1,
            senderId: 'user_123',
            senderName: 'Sarah Johnson',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c108?w=100&h=100&fit=crop&crop=face',
            content: 'Hi! I\'m interested in your Rolex Submariner. Is it still available?',
            timestamp: '2024-02-15T09:00:00Z',
            type: 'text',
            isRead: true
          },
          {
            id: 'msg_002',
            conversationId: 1,
            senderId: 'current_user',
            senderName: 'You',
            content: 'Yes, it\'s still available! Thanks for your interest.',
            timestamp: '2024-02-15T09:15:00Z',
            type: 'text',
            isRead: true
          },
          {
            id: 'msg_003',
            conversationId: 1,
            senderId: 'user_123',
            senderName: 'Sarah Johnson',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c108?w=100&h=100&fit=crop&crop=face',
            content: 'Is the watch still available? I\'m very interested.',
            timestamp: '2024-02-15T10:30:00Z',
            type: 'text',
            isRead: false
          }
        ]
      }
    ];

    setConversations(mockConversations);
    const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    setUnreadCount(totalUnread);
  };

  
  const findOrCreateConversation = (participantId, participantName, itemId, itemTitle, itemImage, participantAvatar = null) => {
    
    let existingConversation = conversations.find(conv => 
      conv.participantId === participantId && conv.itemId === itemId
    );

    if (existingConversation) {
      return existingConversation;
    }

    
    const newConversation = {
      id: Date.now(),
      participantId,
      participantName,
      participantAvatar: participantAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participantName)}&background=random`,
      participantRating: 4.5,
      itemId,
      itemTitle,
      itemImage,
      lastMessage: null,
      unreadCount: 0,
      type: 'buyer_inquiry',
      status: 'active',
      createdAt: new Date().toISOString(),
      isStarred: false,
      isArchived: false,
      messages: []
    };

    setConversations(prev => {
      const updated = [newConversation, ...prev];
      return updated;
    });
    
    return newConversation;
  };

  
  const sendMessage = (conversationId, messageContent, messageType = 'text', fileData = null) => {
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: 'current_user',
      senderName: 'You',
      content: messageContent,
      timestamp: new Date().toISOString(),
      type: messageType,
      isRead: false,
      ...fileData 
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...(conv.messages || []), newMessage];
        return {
          ...conv,
          lastMessage: {
            id: newMessage.id,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            senderId: 'current_user',
            isRead: false
          },
          messages: updatedMessages
        };
      }
      return conv;
    }));

    return newMessage;
  };

  
  const sendContactMessage = (messageData) => {
    const { recipientId, recipientName, itemId, itemTitle, itemImage, content, reason, recipientAvatar } = messageData;
    
    
    const conversation = findOrCreateConversation(
      recipientId, 
      recipientName, 
      itemId, 
      itemTitle, 
      itemImage,
      recipientAvatar
    );

    
    const message = sendMessage(conversation.id, content);

    
    const notification = {
      id: `notif_${Date.now()}`,
      type: 'message_sent',
      title: 'Message sent successfully',
      message: `Your message to ${recipientName} has been sent`,
      itemTitle,
      timestamp: new Date().toISOString(),
      isRead: false,
      urgent: false,
      conversationId: conversation.id
    };

    setNotifications(prev => {
      const updated = [notification, ...prev.slice(0, 19)]; 
      return updated;
    });

    return { conversation, message };
  };

  
  const markConversationAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId && conv.unreadCount > 0) {
        const unreadReduction = conv.unreadCount;
        setUnreadCount(current => Math.max(0, current - unreadReduction));
        
        
        const updatedMessages = conv.messages?.map(msg => ({ ...msg, isRead: true })) || [];
        
        return {
          ...conv,
          unreadCount: 0,
          lastMessage: conv.lastMessage ? { ...conv.lastMessage, isRead: true } : null,
          messages: updatedMessages
        };
      }
      return conv;
    }));
  };

  
  const addMessageToConversation = (conversationId, messageData) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...(conv.messages || []), messageData];
        const newUnreadCount = messageData.senderId !== 'current_user' ? conv.unreadCount + 1 : conv.unreadCount;
        
        if (messageData.senderId !== 'current_user') {
          setUnreadCount(current => current + 1);
        }
        
        return {
          ...conv,
          lastMessage: {
            id: messageData.id,
            content: messageData.content,
            timestamp: messageData.timestamp,
            senderId: messageData.senderId,
            isRead: messageData.senderId === 'current_user'
          },
          messages: updatedMessages,
          unreadCount: newUnreadCount
        };
      }
      return conv;
    }));
  };

  
  const toggleStarConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isStarred: !conv.isStarred }
        : conv
    ));
  };

  
  const archiveConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isArchived: true }
        : conv
    ));
  };

  
  const deleteConversation = (conversationId) => {
    setConversations(prev => {
      const conversationToDelete = prev.find(conv => conv.id === conversationId);
      if (conversationToDelete && conversationToDelete.unreadCount > 0) {
        setUnreadCount(current => Math.max(0, current - conversationToDelete.unreadCount));
      }
      return prev.filter(conv => conv.id !== conversationId);
    });
  };

  
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('bidtreasure_notifications');
  };

  
  const getConversation = (conversationId) => {
    return conversations.find(conv => conv.id === conversationId);
  };

  
  const getMessages = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    return conversation?.messages || [];
  };

  const restoreConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isArchived: false }
        : conv
    ));
  };


  const value = {
    conversations,
    notifications,
    unreadCount,
    sendMessage,
    sendContactMessage,
    markConversationAsRead,
    findOrCreateConversation,
    getConversation,
    getMessages,
    addMessageToConversation,
    toggleStarConversation,
    archiveConversation,
    restoreConversation, 
    deleteConversation,
    markNotificationAsRead,
    clearAllNotifications,
    setConversations,
    setNotifications,
    setUnreadCount
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};