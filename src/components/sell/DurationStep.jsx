import React from 'react';
import { Calendar, Clock, Zap, Info, AlertCircle } from 'lucide-react';

const DurationStep = ({ formData, updateFormData, errors }) => {
  const durationOptions = [
    { value: 1, label: '1 Day', description: 'Quick sale, high urgency', icon: '⚡' },
    { value: 3, label: '3 Days', description: 'Short auction, good for popular items', icon: '🔥' },
    { value: 5, label: '5 Days', description: 'Standard duration, most popular', icon: '⭐' },
    { value: 7, label: '7 Days', description: 'Full week, maximum exposure', icon: '📈' },
    { value: 10, label: '10 Days', description: 'Extended auction, rare items', icon: '💎' }
  ];

  const handleScheduledStartChange = (value) => {
    updateFormData('scheduledStart', value);
  };

  const handleAutoRelistChange = (checked) => {
    updateFormData('autoRelist', checked);
  };

  const getEstimatedEndTime = () => {
    if (!formData.duration) return null;
    
    const startDate = formData.scheduledStart ? new Date(formData.scheduledStart) : new Date();
    const endDate = new Date(startDate.getTime() + (formData.duration * 24 * 60 * 60 * 1000));
    
    return endDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Duration & Timing</h2>
        <p className="text-gray-600">Choose how long your auction will run and when it starts</p>
      </div>

      {/* Duration Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Auction Duration *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFormData('duration', option.value)}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                formData.duration === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{option.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{option.label}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              {formData.duration === option.value && (
                <div className="mt-3 flex items-center text-blue-600">
                  <Zap className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </button>
          ))}
        </div>
        {errors.duration && (
          <p className="text-red-500 text-sm mt-2">{errors.duration}</p>
        )}
      </div>

      {/* Scheduling Options */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Time Options</h3>
        
        <div className="space-y-4">
          {/* Start Now */}
          <div className="flex items-center">
            <input
              type="radio"
              id="start-now"
              name="startTime"
              checked={!formData.scheduledStart}
              onChange={() => handleScheduledStartChange('')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="start-now" className="ml-3 flex items-center">
              <div>
                <span className="font-medium text-gray-900">Start Immediately</span>
                <p className="text-sm text-gray-600">Auction begins as soon as you publish</p>
              </div>
            </label>
          </div>

          {/* Schedule for Later */}
          <div className="flex items-start">
            <input
              type="radio"
              id="start-later"
              name="startTime"
              checked={!!formData.scheduledStart}
              onChange={() => handleScheduledStartChange(new Date().toISOString().slice(0, 16))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
            />
            <label htmlFor="start-later" className="ml-3 flex-1">
              <div className="mb-3">
                <span className="font-medium text-gray-900">Schedule for Later</span>
                <p className="text-sm text-gray-600">Choose a specific start time</p>
              </div>
              
              {formData.scheduledStart !== '' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date & Time
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={formData.scheduledStart}
                        onChange={(e) => handleScheduledStartChange(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Auto-Relist Option */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto-Relist Options</h3>
        
        <div className="flex items-start">
          <input
            type="checkbox"
            id="auto-relist"
            checked={formData.autoRelist}
            onChange={(e) => handleAutoRelistChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="auto-relist" className="ml-3">
            <span className="font-medium text-gray-900">Automatically relist if unsold</span>
            <p className="text-sm text-gray-600 mt-1">
              If your item doesn't sell, we'll automatically create a new listing with the same details.
              You can set a lower starting price for the new listing.
            </p>
          </label>
        </div>

        {formData.autoRelist && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Auto-Relist Settings</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Will relist automatically if no bids are received</li>
                  <li>• You can modify pricing before each relist</li>
                  <li>• Maximum 3 automatic relists</li>
                  <li>• You'll be notified before each relist</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Duration Summary */}
      {formData.duration && (
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Auction Timeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700">Duration:</span>
              <span className="font-semibold text-green-900">
                {formData.duration} {formData.duration === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Start Time:</span>
              <span className="font-semibold text-green-900">
                {formData.scheduledStart ? 
                  new Date(formData.scheduledStart).toLocaleString() : 
                  'Immediately upon publishing'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Estimated End:</span>
              <span className="font-semibold text-green-900">
                {getEstimatedEndTime()}
              </span>
            </div>
            {formData.autoRelist && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Auto-Relist:</span>
                <span className="font-semibold text-green-900">Enabled</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Duration Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Duration Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Shorter Auctions (1-3 days)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Create urgency and excitement</li>
              <li>• Good for popular, in-demand items</li>
              <li>• Higher bidding activity</li>
              <li>• Less time for discovery</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Longer Auctions (7-10 days)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Maximum exposure to potential bidders</li>
              <li>• Good for rare or niche items</li>
              <li>• More time for research and consideration</li>
              <li>• Higher final sale prices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DurationStep;