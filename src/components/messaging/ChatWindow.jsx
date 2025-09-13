import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  MoreHorizontal,
  Star,
  Flag,
  Archive,
  Phone,
  Video,
  Info,
  Package,
  ExternalLink,
  Clock,
  CheckCircle2
} from 'lucide-react';

const ChatWindow = ({ conversation, currentUser, onConversationUpdate }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  
  const mockMessages = [
    {
      id: 'msg_001',
      conversationId: conversation.id,
      senderId: conversation.participantId,
      senderName: conversation.participantName,
      senderAvatar: conversation.participantAvatar,
      content: 'Hi! I\'m interested in your Rolex Submariner. Is it still available?',
      timestamp: '2024-02-15T09:00:00Z',
      type: 'text',
      isRead: true,
      reactions: []
    },
    {
      id: 'msg_002',
      conversationId: conversation.id,
      senderId: 'current_user',
      senderName: 'You',
      senderAvatar: currentUser?.avatar,
      content: 'Yes, it\'s still available! Thanks for your interest. Do you have any specific questions about it?',
      timestamp: '2024-02-15T09:15:00Z',
      type: 'text',
      isRead: true,
      reactions: []
    },
    {
      id: 'msg_003',
      conversationId: conversation.id,
      senderId: conversation.participantId,
      senderName: conversation.participantName,
      senderAvatar: conversation.participantAvatar,
      content: 'Could you tell me more about the condition? Are there any scratches or issues I should know about?',
      timestamp: '2024-02-15T09:30:00Z',
      type: 'text',
      isRead: true,
      reactions: []
    },
    {
      id: 'msg_004',
      conversationId: conversation.id,
      senderId: 'current_user',
      senderName: 'You',
      senderAvatar: currentUser?.avatar,
      content: 'The watch is in excellent condition. There are minimal signs of wear, mostly on the bracelet clasp. The case and crystal are pristine. I can send you some additional detailed photos if that would help.',
      timestamp: '2024-02-15T10:00:00Z',
      type: 'text',
      isRead: true,
      reactions: []
    },
    {
      id: 'msg_005',
      conversationId: conversation.id,
      senderId: conversation.participantId,
      senderName: conversation.participantName,
      senderAvatar: conversation.participantAvatar,
      content: 'That would be great! Also, do you have the original box and papers?',
      timestamp: '2024-02-15T10:30:00Z',
      type: 'text',
      isRead: false,
      reactions: []
    }
  ];

  useEffect(() => {
    
    setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
    }, 500);
  }, [conversation.id]);

  useEffect(() => {
    
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId: 'current_user',
      senderName: 'You',
      senderAvatar: currentUser?.avatar,
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false,
      reactions: []
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    
    const updatedConversation = {
      ...conversation,
      lastMessage: {
        id: newMessage.id,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        senderId: 'current_user',
        isRead: false
      }
    };
    onConversationUpdate(updatedConversation);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    
    const fileMessage = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId: 'current_user',
      senderName: 'You',
      senderAvatar: currentUser?.avatar,
      content: file.name,
      timestamp: new Date().toISOString(),
      type: 'file',
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      fileSize: file.size,
      isRead: false,
      reactions: []
    };

    setMessages(prev => [...prev, fileMessage]);
    setShowAttachmentMenu(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={conversation.participantAvatar}
              alt={conversation.participantName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center">
                {conversation.participantName}
                {conversation.participantRating >= 4.5 && (
                  <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                )}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Package className="h-3 w-3" />
                <span>{conversation.itemTitle}</span>
                <a 
                  href={`/auction/${conversation.itemId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Info className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Item Quick Info */}
        <div className="mt-3 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={conversation.itemImage}
            alt={conversation.itemTitle}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{conversation.itemTitle}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Current Bid: $15,500</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                2h 34m left
              </span>
            </div>
          </div>
          <a
            href={`/auction/${conversation.itemId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            View Listing
          </a>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === 'current_user';
              const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                    showAvatar ? 'mt-4' : 'mt-1'
                  }`}
                >
                  <div className={`flex space-x-2 max-w-xs lg:max-w-md ${
                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {showAvatar && !isOwnMessage && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    
                    <div className={`${showAvatar && !isOwnMessage ? '' : 'ml-10'} ${
                      isOwnMessage ? 'mr-0' : ''
                    }`}>
                      {msg.type === 'text' ? (
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      ) : msg.type === 'file' ? (
                        <div
                          className={`px-4 py-3 rounded-lg border ${
                            isOwnMessage
                              ? 'bg-blue-50 border-blue-200 rounded-br-sm'
                              : 'bg-gray-50 border-gray-200 rounded-bl-sm'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{msg.content}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(msg.fileSize)}</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Download
                            </button>
                          </div>
                        </div>
                      ) : null}
                      
                      <div className={`flex items-center mt-1 space-x-1 ${
                        isOwnMessage ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs text-gray-400">
                          {formatTime(msg.timestamp)}
                        </span>
                        {isOwnMessage && (
                          <CheckCircle2 className={`h-3 w-3 ${
                            msg.isRead ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <img
                    src={conversation.participantAvatar}
                    alt={conversation.participantName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Attachment Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              
              {showAttachmentMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px] z-50">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    File
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </button>
                </div>
              )}
            </div>
            
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile className="h-4 w-4" />
            </button>
            
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  );
};

export default ChatWindow;