import React from 'react';
import { DollarSign, TrendingUp, Zap, Info } from 'lucide-react';

const PricingStep = ({ formData, updateFormData, errors }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const listingTypes = [
    {
      id: 'auction',
      title: 'Auction Only',
      icon: TrendingUp,
      description: 'Let buyers bid against each other',
      features: ['Starting bid required', 'Higher final prices', 'Time-limited']
    },
    {
      id: 'buy-now',
      title: 'Buy It Now Only',
      icon: Zap,
      description: 'Set a fixed price for immediate purchase',
      features: ['Fixed price', 'Instant sale', 'No waiting']
    },
    {
      id: 'both',
      title: 'Auction + Buy It Now',
      icon: DollarSign,
      description: 'Offer both bidding and immediate purchase options',
      features: ['Maximum flexibility', 'Wider buyer appeal', 'Higher visibility']
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Pricing</h2>
        <p className="text-gray-600">Choose how you want to sell your item</p>
      </div>

      {/* Listing Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Selling Format *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listingTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => updateFormData('listingType', type.id)}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                formData.listingType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-3">
                <type.icon className={`h-6 w-6 mr-3 ${
                  formData.listingType === type.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <h3 className="font-semibold text-gray-900">{type.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>
              <ul className="space-y-1">
                {type.features.map((feature, index) => (
                  <li key={index} className="text-xs text-gray-500 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Auction Pricing */}
      {(formData.listingType === 'auction' || formData.listingType === 'both') && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Bid * ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.startingBid}
                  onChange={(e) => updateFormData('startingBid', e.target.value)}
                  placeholder="0.99"
                  className={`input-field pl-10 ${errors.startingBid ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.startingBid && (
                <p className="text-red-500 text-sm mt-1">{errors.startingBid}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Lower starting bids often attract more bidders
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reserve Price ($) <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.reservePrice}
                  onChange={(e) => updateFormData('reservePrice', e.target.value)}
                  placeholder="Optional"
                  className={`input-field pl-10 ${errors.reservePrice ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.reservePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.reservePrice}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Minimum price you'll accept (hidden from bidders)
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Reserve Price Tips</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Reserve prices can reduce bidding activity. Consider starting with a higher starting bid instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy It Now Pricing */}
      {(formData.listingType === 'buy-now' || formData.listingType === 'both') && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Buy It Now Price</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buy It Now Price * ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.buyItNowPrice}
                  onChange={(e) => updateFormData('buyItNowPrice', e.target.value)}
                  placeholder="99.99"
                  className={`input-field pl-10 ${errors.buyItNowPrice ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.buyItNowPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.buyItNowPrice}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Price for immediate purchase
              </p>
            </div>

            {formData.listingType === 'both' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Offer
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      onChange={(e) => updateFormData('acceptOffers', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Accept Best Offers</span>
                  </label>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Let buyers make offers below your Buy It Now price
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      {(formData.startingBid || formData.buyItNowPrice) && (
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Pricing Summary</h3>
          <div className="space-y-3">
            {formData.startingBid && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Starting Bid:</span>
                <span className="font-semibold text-green-900">
                  {formatPrice(parseFloat(formData.startingBid) || 0)}
                </span>
              </div>
            )}
            {formData.reservePrice && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Reserve Price:</span>
                <span className="font-semibold text-green-900">
                  {formatPrice(parseFloat(formData.reservePrice) || 0)}
                </span>
              </div>
            )}
            {formData.buyItNowPrice && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Buy It Now:</span>
                <span className="font-semibold text-green-900">
                  {formatPrice(parseFloat(formData.buyItNowPrice) || 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Research */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Research</h3>
        <p className="text-gray-600 mb-4">
          See what similar items have sold for to help price your item competitively.
        </p>
        <button className="btn-secondary">
          View Completed Listings
        </button>
      </div>
    </div>
  );
};

export default PricingStep;