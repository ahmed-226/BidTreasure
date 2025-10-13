import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Upload,
  User,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Send,
  ArrowRight
} from 'lucide-react';

const DisputeResolution = ({ userType = 'buyer', userId }) => {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showCreateDispute, setShowCreateDispute] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mockDisputes = [
    {
      id: 'DISP_001',
      transactionId: 'TXN_123',
      itemTitle: 'Vintage Rolex Watch',
      itemPrice: 15500,
      status: 'open',
      type: 'item_not_received',
      createdDate: '2024-02-10T14:30:00Z',
      lastUpdate: '2024-02-12T09:15:00Z',
      description: 'Item was not received after 2 weeks',
      buyerName: 'John Smith',
      sellerName: 'Watch Expert Pro',
      caseManager: 'Sarah Johnson',
      resolution: null,
      messages: [
        {
          id: 1,
          sender: 'buyer',
          message: 'I have not received my watch after 2 weeks.',
          timestamp: '2024-02-10T14:30:00Z',
          attachments: []
        }
      ]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDisputes(mockDisputes);
      setIsLoading(false);
    }, 1000);
  }, [userId]);

  const disputeTypes = [
    { value: 'item_not_received', label: 'Item Not Received' },
    { value: 'item_not_described', label: 'Item Not As Described' },
    { value: 'damaged_item', label: 'Item Damaged in Shipping' },
    { value: 'authentication', label: 'Authenticity Concerns' },
    { value: 'payment_issue', label: 'Payment Problem' },
    { value: 'other', label: 'Other Issue' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.open;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const CreateDisputeForm = () => {
    const [formData, setFormData] = useState({
      transactionId: '',
      disputeType: '',
      description: '',
      evidence: []
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      setShowCreateDispute(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create Dispute</h3>
              <button
                onClick={() => setShowCreateDispute(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  placeholder="TXN_123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type *
                </label>
                <select
                  value={formData.disputeType}
                  onChange={(e) => setFormData(prev => ({ ...prev, disputeType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select issue type</option>
                  {disputeTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateDispute(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Create Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dispute Resolution</h2>
          <p className="text-gray-600 mt-1">Manage and resolve transaction disputes</p>
        </div>
        <button
          onClick={() => setShowCreateDispute(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Create Dispute
        </button>
      </div>

      {/* Disputes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Disputes</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="p-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedDispute(dispute)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">#{dispute.id}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {dispute.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 font-medium mb-1">{dispute.itemTitle}</p>
                  <p className="text-gray-600 text-sm mb-2">{dispute.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {formatDate(dispute.createdDate)}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${dispute.itemPrice.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {dispute.messages.length} messages
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Last updated</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(dispute.lastUpdate)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {disputes.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Disputes</h3>
            <p className="text-gray-600">You don't have any active disputes.</p>
          </div>
        )}
      </div>

      {/* Dispute Detail Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Dispute #{selectedDispute.id}
                </h3>
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Dispute Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Dispute Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Item:</span>
                        <span className="ml-2 text-gray-900">{selectedDispute.itemTitle}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-2 text-gray-900">${selectedDispute.itemPrice.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 text-gray-900">
                          {disputeTypes.find(t => t.value === selectedDispute.type)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Case Manager</h4>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {selectedDispute.caseManager.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-900">{selectedDispute.caseManager}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-900">Messages</h4>
                {selectedDispute.messages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">{message.sender}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>

              {/* Resolution Status */}
              {selectedDispute.resolution ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-900">Dispute Resolved</span>
                  </div>
                  <p className="text-green-800">{selectedDispute.resolution}</p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium text-yellow-900">Under Review</span>
                  </div>
                  <p className="text-yellow-800 mt-1">
                    Our team is reviewing this dispute. We'll update you within 24-48 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Dispute Modal */}
      {showCreateDispute && <CreateDisputeForm />}
    </div>
  );
};

export default DisputeResolution;