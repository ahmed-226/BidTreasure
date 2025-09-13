import React, { useState, useEffect } from 'react';
import { useMessaging } from '../../contexts/MessagingContext'; 
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  CheckCircle2, 
  Circle,
  MoreHorizontal,
  Archive,
  Trash2,
  Flag,
  User,
  Package
} from 'lucide-react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const MessageCenter = ({ user }) => {
  const { conversations, unreadCount, markConversationAsRead } = useMessaging(); 
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    setIsLoading(false);
  }, [conversations]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && conv.unreadCount > 0) ||
                         (filterType === 'starred' && conv.isStarred) ||
                         (filterType === 'archived' && conv.isArchived) ||
                         (filterType === conv.type);
    
    return matchesSearch && matchesFilter && !conv.isArchived;
  });

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
    
    
    if (conversation.unreadCount > 0) {
      markConversationAsRead(conversation.id);
    }
  };

  const handleStarConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isStarred: !conv.isStarred }
        : conv
    ));
  };

  const handleArchiveConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isArchived: true }
        : conv
    ));
    
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Messages
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', count: conversations.length },
              { value: 'unread', label: 'Unread', count: conversations.filter(c => c.unreadCount > 0).length },
              { value: 'starred', label: 'Starred', count: conversations.filter(c => c.isStarred).length },
              { value: 'buyer_inquiry', label: 'Buying', count: conversations.filter(c => c.type === 'buyer_inquiry').length },
              { value: 'seller_inquiry', label: 'Selling', count: conversations.filter(c => c.type === 'seller_inquiry').length }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === filter.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </button>
            ))}
          </div>
        </div>
        
        {/* Conversations List */}
        <ConversationList
          conversations={filteredConversations}
          activeConversation={activeConversation}
          onConversationSelect={handleConversationSelect}
          onStarConversation={handleStarConversation}
          onArchiveConversation={handleArchiveConversation}
          onDeleteConversation={handleDeleteConversation}
          isLoading={isLoading}
        />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUser={user}
            onConversationUpdate={(updatedConv) => {
              setConversations(prev => prev.map(conv => 
                conv.id === updatedConv.id ? updatedConv : conv
              ));
              setActiveConversation(updatedConv);
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
      
      {/* Message Notifications */}
      <MessageNotifications unreadCount={unreadCount} />
    </div>
  );
};

export default MessageCenter;