import React from 'react';
import { Camera, Heart, Share2, Flag, Clock, Users, Eye } from 'lucide-react';

const ListingPreview = ({ formData }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              {formData.images.length > 0 ? (
                <img
                  src={formData.images[formData.mainImageIndex]?.preview || formData.images[0]?.preview}
                  alt={formData.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">No images uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {formData.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === formData.mainImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.preview}
                      alt={`${formData.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Title and Description */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.title || 'Your Item Title'}
              </h1>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {formData.description || 'Your item description will appear here...'}
                </p>
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 font-medium">Category:</span>
                  <span className="ml-2 text-gray-900">{formData.category || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Condition:</span>
                  <span className="ml-2 text-gray-900 capitalize">{formData.condition}</span>
                </div>
                {formData.brand && (
                  <div>
                    <span className="text-gray-600 font-medium">Brand:</span>
                    <span className="ml-2 text-gray-900">{formData.brand}</span>
                  </div>
                )}
                {formData.model && (
                  <div>
                    <span className="text-gray-600 font-medium">Model:</span>
                    <span className="ml-2 text-gray-900">{formData.model}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bidding */}
          <div className="space-y-6">
            {/* Auction Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {formData.duration ? `${formData.duration} days` : 'Duration not set'}
                </div>
                <p className="text-gray-600">Auction duration</p>
              </div>

              {/* Current Bid */}
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formData.startingBid ? formatPrice(parseFloat(formData.startingBid)) : 'No starting bid'}
                </div>
                <p className="text-gray-600">Starting bid</p>
              </div>

              {/* Buy It Now */}
              {formData.buyItNowPrice && (
                <div className="text-center mb-6">
                  <div className="text-xl font-bold text-blue-600 mb-1">
                    {formatPrice(parseFloat(formData.buyItNowPrice))}
                  </div>
                  <p className="text-gray-600">Buy It Now</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Place Bid
                </button>
                {formData.buyItNowPrice && (
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg">
                    Buy It Now
                  </button>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 flex items-center justify-center py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">
                  <Heart className="h-4 w-4 mr-1" />
                  Watch
                </button>
                <button className="flex items-center justify-center py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Auction Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{formData.duration || 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Listing type:</span>
                  <span className="font-semibold capitalize">
                    {formData.listingType === 'both' ? 'Auction + Buy Now' : formData.listingType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold">{formData.itemLocation || 'Not specified'}</span>
                </div>
                {formData.autoRelist && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Auto-relist:</span>
                    <span className="font-semibold text-green-600">Enabled</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Handling</h3>
              <div className="space-y-3 text-sm">
                {formData.shippingOptions.domestic.enabled && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Domestic shipping:</span>
                    <span className="font-semibold">
                      {formData.shippingOptions.domestic.cost === '0' || !formData.shippingOptions.domestic.cost
                        ? 'Free'
                        : formatPrice(parseFloat(formData.shippingOptions.domestic.cost))
                      }
                    </span>
                  </div>
                )}
                {formData.shippingOptions.international.enabled && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">International:</span>
                    <span className="font-semibold">
                      {formData.shippingOptions.international.cost === '0' || !formData.shippingOptions.international.cost
                        ? 'Free'
                        : formatPrice(parseFloat(formData.shippingOptions.international.cost))
                      }
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Handling time:</span>
                  <span className="font-semibold">{formData.shippingOptions.domestic.handlingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ships from:</span>
                  <span className="font-semibold">{formData.itemLocation || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPreview;