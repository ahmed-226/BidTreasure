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
  }, []);

  
  const findOrCreateConversation = (participantId, participantName, itemId, itemTitle, itemImage) => {
    
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
      participantAvatar: `https://ui-avatars.com/api/?name=${participantName}&background=random`,
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

    setConversations(prev => [newConversation, ...prev]);
    return newConversation;
  };

  
  const sendMessage = (conversationId, messageContent, messageType = 'text') => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: 'current_user',
      senderName: 'You',
      content: messageContent,
      timestamp: new Date().toISOString(),
      type: messageType,
      isRead: false
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: {
            id: newMessage.id,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            senderId: 'current_user',
            isRead: false
          },
          messages: [...(conv.messages || []), newMessage]
        };
      }
      return conv;
    }));

    return newMessage;
  };

  
  const sendContactMessage = (messageData) => {
    const { recipientId, recipientName, itemId, itemTitle, itemImage, content, reason } = messageData;
    
    
    const conversation = findOrCreateConversation(
      recipientId, 
      recipientName, 
      itemId, 
      itemTitle, 
      itemImage
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

    setNotifications(prev => [notification, ...prev]);

    return { conversation, message };
  };

  
  const markConversationAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId && conv.unreadCount > 0) {
        setUnreadCount(current => current - conv.unreadCount);
        return {
          ...conv,
          unreadCount: 0,
          lastMessage: conv.lastMessage ? { ...conv.lastMessage, isRead: true } : null
        };
      }
      return conv;
    }));
  };

  
  const getConversation = (conversationId) => {
    return conversations.find(conv => conv.id === conversationId);
  };

  
  const getMessages = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    return conversation?.messages || [];
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