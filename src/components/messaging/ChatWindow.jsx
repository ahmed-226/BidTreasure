import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '../../contexts/MessagingContext';
import EmojiPicker from 'emoji-picker-react';
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
  CheckCircle2,
  Download,
  X
} from 'lucide-react';

const ChatWindow = ({ conversation, currentUser }) => {
  const { sendMessage, getMessages, addMessageToConversation } = useMessaging();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  
  useEffect(() => {
    if (conversation) {
      setIsLoading(true);
      const conversationMessages = getMessages(conversation.id);
      setMessages(conversationMessages);
      setIsLoading(false);
    }
  }, [conversation?.id, getMessages]);

  
    useEffect(() => {
      if (messagesEndRef.current) {
        
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }, [messages]);

  
  useEffect(() => {
    if (!conversation) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.1) { 
        const newMessage = {
          id: `msg_${Date.now()}_incoming`,
          conversationId: conversation.id,
          senderId: conversation.participantId,
          senderName: conversation.participantName,
          senderAvatar: conversation.participantAvatar,
          content: 'Thanks for your interest! Let me know if you have any other questions.',
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: false
        };

        addMessageToConversation(conversation.id, newMessage);
        setMessages(prev => [...prev, newMessage]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [conversation, addMessageToConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !conversation) return;

    
    const newMessage = sendMessage(conversation.id, message);
    
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  
  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !conversation) return;

    setUploadingFile(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const fileUrl = URL.createObjectURL(file);
      const fileData = {
        fileUrl,
        fileType: file.type,
        fileSize: file.size,
        fileName: file.name
      };

      const fileMessage = sendMessage(
        conversation.id, 
        file.name, 
        'file', 
        fileData
      );

      setMessages(prev => [...prev, fileMessage]);
      setShowAttachmentMenu(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDownloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
      if (!event.target.closest('.attachment-menu-container')) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

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
                            {msg.fileType?.startsWith('image/') ? (
                              <div className="flex items-center space-x-3">
                                <img
                                  src={msg.fileUrl}
                                  alt={msg.fileName || msg.content}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{msg.fileName || msg.content}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(msg.fileSize)}</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Paperclip className="h-4 w-4 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{msg.fileName || msg.content}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(msg.fileSize)}</p>
                                </div>
                              </>
                            )}
                            <button 
                              onClick={() => handleDownloadFile(msg.fileUrl, msg.fileName || msg.content)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                            >
                              <Download className="h-3 w-3 mr-1" />
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

            {uploadingFile && (
              <div className="flex justify-end">
                <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg max-w-xs">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-700">Uploading file...</span>
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
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
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
            <div className="relative attachment-menu-container">
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors h-11 w-11 flex items-center justify-center"
                disabled={uploadingFile}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              
              {showAttachmentMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px] z-50">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachmentMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    disabled={uploadingFile}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachmentMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    disabled={uploadingFile}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </button>
                </div>
              )}
            </div>
            
            {/* Emoji Picker - UPDATED WITH LIBRARY */}
            <div className="relative emoji-picker-container">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors h-11 w-11 flex items-center justify-center"
              >
                <Smile className="h-4 w-4" />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 z-50">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={320}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    previewConfig={{
                      defaultEmoji: "1f60a",
                      defaultCaption: "What's on your mind?"
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || uploadingFile}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-11 w-11 flex items-center justify-center"
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
          accept="image/*,.pdf,.doc,.docx,.txt,.zip"
        />
      </div>
    </div>
  );
};

export default ChatWindow;