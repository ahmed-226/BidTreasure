import React, { useState } from 'react';
import { 
  Star, 
  Clock, 
  Archive, 
  Trash2, 
  MoreHorizontal, 
  Package,
  User,
  CheckCircle2,
  Circle
} from 'lucide-react';

const ConversationList = ({ 
  conversations, 
  activeConversation, 
  onConversationSelect, 
  onStarConversation,
  onArchiveConversation,
  onDeleteConversation,
  isLoading 
}) => {
  const [hoveredConversation, setHoveredConversation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'buyer_inquiry':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'seller_inquiry':
        return <User className="h-4 w-4 text-green-500" />;
      case 'transaction':
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'buyer_inquiry':
        return 'Buying';
      case 'seller_inquiry':
        return 'Selling';
      case 'transaction':
        return 'Transaction';
      default:
        return 'General';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No conversations found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`relative cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
            activeConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
          }`}
          onClick={() => onConversationSelect(conversation)}
          onMouseEnter={() => setHoveredConversation(conversation.id)}
          onMouseLeave={() => setHoveredConversation(null)}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* Participant Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.participantAvatar}
                  alt={conversation.participantName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
              
              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-sm font-medium truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {conversation.participantName}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(conversation.type)}
                      <span className="text-xs text-gray-500">{getTypeLabel(conversation.type)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {conversation.isStarred && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* Item Info */}
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={conversation.itemImage}
                    alt={conversation.itemTitle}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span className="text-xs text-gray-600 truncate">
                    {conversation.itemTitle}
                  </span>
                </div>
                
                {/* Last Message */}
                <p className={`text-sm truncate ${
                  conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                }`}>
                  {conversation.lastMessage.senderId === 'current_user' ? 'You: ' : ''}
                  {conversation.lastMessage.content}
                </p>
                
                {/* Participant Rating */}
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(conversation.participantRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    {conversation.participantRating}
                  </span>
                </div>
              </div>
              
              {/* Action Menu */}
              {(hoveredConversation === conversation.id || showDropdown === conversation.id) && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(showDropdown === conversation.id ? null : conversation.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showDropdown === conversation.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[150px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStarConversation(conversation.id);
                          setShowDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {conversation.isStarred ? 'Unstar' : 'Star'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchiveConversation(conversation.id);
                          setShowDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                          setShowDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Active Indicator */}
          {activeConversation?.id === conversation.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConversationList;