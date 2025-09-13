import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  User, 
  ChevronDown,
  ChevronUp,
  Star,
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const QASection = ({ itemId, sellerId, currentUser }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

  
  const mockQuestions = [
    {
      id: 'qa_001',
      question: 'Is this watch authentic? Do you have any certificates?',
      answer: 'Yes, this is a genuine Rolex Submariner from 1965. I have the original papers and a recent authentication certificate from a certified dealer. I can provide additional photos of the certificates upon request.',
      askedBy: {
        id: 'user_123',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c108?w=50&h=50&fit=crop&crop=face',
        rating: 4.8,
        verifiedBuyer: true
      },
      answeredBy: {
        id: 'seller_456',
        name: 'Watch Expert Pro',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        isSeller: true,
        verified: true
      },
      askedAt: '2024-02-14T10:30:00Z',
      answeredAt: '2024-02-14T11:15:00Z',
      helpful: 8,
      notHelpful: 1,
      userVote: null,
      isPublic: true,
      tags: ['authenticity', 'certificates']
    },
    {
      id: 'qa_002',
      question: 'What is the exact condition of the watch bracelet? Are there any scratches?',
      answer: 'The bracelet shows normal wear for a vintage piece. There are some light scratches on the clasp and minor desk diving marks on the bracelet links, which is expected for a 1965 watch. The scratches are superficial and don\'t affect functionality. I can send detailed photos of the bracelet if you\'re interested.',
      askedBy: {
        id: 'user_789',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        rating: 4.9,
        verifiedBuyer: false
      },
      answeredBy: {
        id: 'seller_456',
        name: 'Watch Expert Pro',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        isSeller: true,
        verified: true
      },
      askedAt: '2024-02-13T14:20:00Z',
      answeredAt: '2024-02-13T16:45:00Z',
      helpful: 12,
      notHelpful: 0,
      userVote: null,
      isPublic: true,
      tags: ['condition', 'bracelet']
    },
    {
      id: 'qa_003',
      question: 'Do you offer international shipping? What are the shipping costs to Europe?',
      answer: null, 
      askedBy: {
        id: 'user_101',
        name: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        rating: 4.7,
        verifiedBuyer: true
      },
      answeredBy: null,
      askedAt: '2024-02-15T09:10:00Z',
      answeredAt: null,
      helpful: 0,
      notHelpful: 0,
      userVote: null,
      isPublic: true,
      tags: ['shipping', 'international']
    }
  ];

  useEffect(() => {
    
    setTimeout(() => {
      setQuestions(mockQuestions);
      setIsLoading(false);
    }, 1000);
  }, [itemId]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsSubmitting(true);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const question = {
        id: `qa_${Date.now()}`,
        question: newQuestion,
        answer: null,
        askedBy: {
          id: currentUser?.id || 'current_user',
          name: currentUser?.name || 'You',
          avatar: currentUser?.avatar,
          rating: currentUser?.rating || 5.0,
          verifiedBuyer: currentUser?.verifiedBuyer || false
        },
        answeredBy: null,
        askedAt: new Date().toISOString(),
        answeredAt: null,
        helpful: 0,
        notHelpful: 0,
        userVote: null,
        isPublic: true,
        tags: []
      };

      setQuestions(prev => [question, ...prev]);
      setNewQuestion('');
      
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (questionId, voteType) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newQuestion = { ...q };
        
        
        if (q.userVote === 'helpful') {
          newQuestion.helpful -= 1;
        } else if (q.userVote === 'not_helpful') {
          newQuestion.notHelpful -= 1;
        }
        
        
        if (q.userVote !== voteType) {
          if (voteType === 'helpful') {
            newQuestion.helpful += 1;
          } else if (voteType === 'not_helpful') {
            newQuestion.notHelpful += 1;
          }
          newQuestion.userVote = voteType;
        } else {
          newQuestion.userVote = null;
        }
        
        return newQuestion;
      }
      return q;
    }));
  };

  const toggleExpanded = (questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful);
      case 'recent':
        return new Date(b.askedAt) - new Date(a.askedAt);
      case 'unanswered':
        return (a.answer ? 1 : 0) - (b.answer ? 1 : 0);
      default:
        return 0;
    }
  });

  const answeredQuestions = questions.filter(q => q.answer);
  const unansweredQuestions = questions.filter(q => !q.answer);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            Questions & Answers ({questions.length})
          </h3>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="unanswered">Unanswered First</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span>{answeredQuestions.length} answered</span>
          <span>{unansweredQuestions.length} pending</span>
          <span>{questions.reduce((sum, q) => sum + q.helpful, 0)} helpful votes</span>
        </div>
      </div>

      {/* Ask Question Form */}
      {currentUser && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Ask a question about this item</h4>
          <form onSubmit={handleSubmitQuestion} className="space-y-3">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here... Be specific and helpful to other buyers."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{newQuestion.length}/500 characters</span>
              <button
                type="submit"
                disabled={!newQuestion.trim() || isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Ask Question
                  </>
                )}
              </button>
            </div>
          </form>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Question Guidelines:</p>
                <ul className="space-y-1">
                  <li>• Ask about item condition, authenticity, or specifications</li>
                  <li>• Be respectful and specific in your questions</li>
                  <li>• Your question will be visible to other potential buyers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-400 mb-2">No questions yet</p>
          <p className="text-sm">Be the first to ask about this item!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedQuestions.map((qa) => (
            <div key={qa.id} className="border border-gray-200 rounded-lg p-4">
              {/* Question */}
              <div className="mb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={qa.askedBy.avatar || `https://ui-avatars.com/api/?name=${qa.askedBy.name}&background=random`}
                    alt={qa.askedBy.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{qa.askedBy.name}</span>
                      {qa.askedBy.verifiedBuyer && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Buyer
                        </span>
                      )}
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs text-gray-500">{qa.askedBy.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(qa.askedAt)}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">{qa.question}</p>
                  </div>
                </div>
              </div>

              {/* Answer */}
              {qa.answer ? (
                <div className="ml-11 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={qa.answeredBy.avatar || `https://ui-avatars.com/api/?name=${qa.answeredBy.name}&background=random`}
                      alt={qa.answeredBy.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{qa.answeredBy.name}</span>
                    {qa.answeredBy.isSeller && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Seller
                      </span>
                    )}
                    {qa.answeredBy.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(qa.answeredAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{qa.answer}</p>
                </div>
              ) : (
                <div className="ml-11 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-700 font-medium">
                      Waiting for seller's response
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              {qa.answer && (
                <div className="ml-11 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">Was this helpful?</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(qa.id, 'helpful')}
                        className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                          qa.userVote === 'helpful'
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-500 hover:text-green-600'
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{qa.helpful}</span>
                      </button>
                      <button
                        onClick={() => handleVote(qa.id, 'not_helpful')}
                        className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                          qa.userVote === 'not_helpful'
                            ? 'bg-red-100 text-red-700'
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        <span>{qa.notHelpful}</span>
                      </button>
                    </div>
                  </div>
                  
                  {qa.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {qa.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QASection;