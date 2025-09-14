import React, { useState } from 'react';
import { useMessaging } from '../../contexts/MessagingContext';
import { 
  X, 
  MessageCircle, 
  Package, 
  User, 
  Star, 
  Send,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactSellerModal = ({ isOpen, onClose, seller, item }) => {
  const navigate = useNavigate();
  const { sendContactMessage } = useMessaging();
  const [message, setMessage] = useState('');
  const [contactReason, setContactReason] = useState('general_inquiry');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const contactReasons = [
    { value: 'general_inquiry', label: 'General Inquiry' },
    { value: 'condition_question', label: 'Question about Condition' },
    { value: 'shipping_inquiry', label: 'Shipping Question' },
    { value: 'price_negotiation', label: 'Price Discussion' },
    { value: 'additional_photos', label: 'Request Additional Photos' },
    { value: 'return_policy', label: 'Return Policy Question' },
    { value: 'authentication', label: 'Authentication Inquiry' },
    { value: 'other', label: 'Other' }
  ];

  const messageTemplates = {
    general_inquiry: `Hi! I'm interested in your ${item?.title}. Could you tell me more about it?`,
    condition_question: `Hi! Could you provide more details about the condition of the ${item?.title}?`,
    shipping_inquiry: `Hi! I'd like to know more about shipping options for the ${item?.title}.`,
    price_negotiation: `Hi! I'm interested in the ${item?.title}. Would you consider any price negotiations?`,
    additional_photos: `Hi! Could you please provide additional photos of the ${item?.title}? I'd particularly like to see...`,
    return_policy: `Hi! What is your return policy for the ${item?.title}?`,
    authentication: `Hi! Do you have any authentication certificates or proof of authenticity for the ${item?.title}?`,
    other: `Hi! I have a question about your ${item?.title}.`
  };

  const handleReasonChange = (reason) => {
    setContactReason(reason);
    setMessage(messageTemplates[reason] || messageTemplates.other);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const messageData = {
        recipientId: seller.id || seller.userId,
        recipientName: seller.name || seller.displayName || seller.username,
        recipientAvatar: seller.avatar,
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.image || item.images?.[0] || item.thumbnail,
        content: message,
        reason: contactReason
      };

      
      const result = sendContactMessage(messageData);
      
      console.log('Message sent successfully:', result);
      
      setShowSuccess(true);
      
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setMessage('');
        setContactReason('general_inquiry');
        navigate('/messages');
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  
  React.useEffect(() => {
    if (isOpen && !message) {
      setMessage(messageTemplates.general_inquiry);
    }
  }, [isOpen, item?.title]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            Contact Seller
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {showSuccess ? (
          <div className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600 mb-4">
              Your message has been sent to {seller?.name || seller?.displayName}. 
              Redirecting to messages...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="p-6">
            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  {seller?.avatar ? (
                    <img
                      src={seller.avatar}
                      alt={seller.name || seller.displayName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-xl">
                      {(seller?.name || seller?.displayName || 'S').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    {seller?.name || seller?.displayName || 'Seller'}
                    {seller?.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500 ml-2" />
                    )}
                  </h3>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(seller?.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {seller?.rating || 'No rating'} ({seller?.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    Member since {seller?.memberSince || '2020'}
                  </div>
                </div>
              </div>
            </div>

            {/* Item Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">About this item:</h4>
              <div className="flex items-center space-x-4">
                <img
                  src={item?.image || item?.images?.[0] || item?.thumbnail || 'https://via.placeholder.com/64'}
                  alt={item?.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{item?.title}</h5>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>Current Bid: ${item?.currentBid?.toLocaleString() || item?.price?.toLocaleString() || 'N/A'}</span>
                    <span>{item?.timeLeft || item?.endTime || 'Auction active'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to ask about? *
                </label>
                <select
                  value={contactReason}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {contactReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Be specific and polite. The seller will respond directly to your message.
                  </p>
                  <span className="text-xs text-gray-500">{message.length}/1000</span>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">Message Guidelines</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Be respectful and professional</li>
                      <li>• Ask specific questions about the item</li>
                      <li>• Don't share personal contact information</li>
                      <li>• All communication should happen through our platform</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSellerModal;