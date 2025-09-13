import React from 'react';
import { 
  Eye, 
  Edit, 
  Package, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Globe, 
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Truck
} from 'lucide-react';

const ReviewStep = ({ formData, updateFormData, errors }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getEstimatedEndTime = () => {
    if (!formData.duration) return 'Not set';
    
    const startDate = formData.scheduledStart ? new Date(formData.scheduledStart) : new Date();
    const endDate = new Date(startDate.getTime() + (formData.duration * 24 * 60 * 60 * 1000));
    
    return endDate.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getListingTypeDisplay = () => {
    switch (formData.listingType) {
      case 'auction':
        return 'Auction Only';
      case 'buy-now':
        return 'Buy It Now Only';
      case 'both':
        return 'Auction + Buy It Now';
      default:
        return 'Not specified';
    }
  };

  const getShippingMethods = () => {
    const methods = [];
    if (formData.shippingOptions.domestic.enabled) {
      methods.push(`Domestic (${formData.shippingOptions.domestic.methods?.length || 0} methods)`);
    }
    if (formData.shippingOptions.international.enabled) {
      methods.push('International');
    }
    return methods.length > 0 ? methods.join(', ') : 'No shipping methods';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Listing</h2>
        <p className="text-gray-600">Review all details before publishing your auction</p>
      </div>

      {/* Listing Preview */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Preview Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Listing Preview
            </h3>
            <span className="text-sm text-gray-500">This is how buyers will see your listing</span>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images Section */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Main Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {formData.images.length > 0 ? (
                    <img
                      src={formData.images[formData.mainImageIndex]?.preview || formData.images[0]?.preview}
                      alt={formData.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <p>No images uploaded</p>
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
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {formData.title || 'No title specified'}
                  </h1>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {formData.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Item Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Item Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="ml-2 text-gray-900">{formData.category || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <span className="ml-2 text-gray-900 capitalize">{formData.condition}</span>
                    </div>
                    {formData.brand && (
                      <div>
                        <span className="text-gray-600">Brand:</span>
                        <span className="ml-2 text-gray-900">{formData.brand}</span>
                      </div>
                    )}
                    {formData.model && (
                      <div>
                        <span className="text-gray-600">Model:</span>
                        <span className="ml-2 text-gray-900">{formData.model}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Section */}
            <div className="space-y-6">
              {/* Pricing Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 mb-1">Current bid</div>
                  <div className="text-3xl font-bold text-green-600">
                    {formData.startingBid ? formatPrice(parseFloat(formData.startingBid)) : 'Not set'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {getListingTypeDisplay()}
                    </span>
                  </div>

                  {formData.buyItNowPrice && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Buy It Now</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatPrice(parseFloat(formData.buyItNowPrice))}
                      </div>
                    </div>
                  )}

                  {formData.reservePrice && (
                    <div className="text-center text-sm text-gray-600">
                      Reserve: {formatPrice(parseFloat(formData.reservePrice))}
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                    Place Bid
                  </button>
                  {formData.buyItNowPrice && (
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold">
                      Buy It Now
                    </button>
                  )}
                </div>
              </div>

              {/* Auction Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Auction Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">{formData.duration} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ends:</span>
                    <span className="text-gray-900">{getEstimatedEndTime()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">{formData.itemLocation || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Methods:</span>
                    <span className="text-gray-900">{getShippingMethods()}</span>
                  </div>
                  {formData.shippingOptions.domestic.enabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Domestic:</span>
                      <span className="text-gray-900">
                        {formData.shippingOptions.domestic.cost === '0' || !formData.shippingOptions.domestic.cost
                          ? 'Free'
                          : `$${formData.shippingOptions.domestic.cost}`
                        }
                      </span>
                    </div>
                  )}
                  {formData.shippingOptions.international.enabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">International:</span>
                      <span className="text-gray-900">
                        {formData.shippingOptions.international.cost === '0' || !formData.shippingOptions.international.cost
                          ? 'Free'
                          : `$${formData.shippingOptions.international.cost}`
                        }
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Handling:</span>
                    <span className="text-gray-900">{formData.shippingOptions.domestic.handlingTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Information Checklist */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Information</h3>
          <div className="space-y-3">
            {[
              { label: 'Category selected', completed: !!formData.category },
              { label: 'Title provided', completed: !!formData.title?.trim() },
              { label: 'Description written', completed: !!formData.description?.trim() },
              { label: 'Images uploaded', completed: formData.images.length > 0 },
              { label: 'Pricing set', completed: !!formData.startingBid || !!formData.buyItNowPrice },
              { label: 'Duration selected', completed: !!formData.duration },
              { label: 'Location specified', completed: !!formData.itemLocation?.trim() },
              { label: 'Shipping configured', completed: formData.shippingOptions.domestic.enabled || formData.shippingOptions.international.enabled }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                )}
                <span className={`${item.completed ? 'text-gray-900' : 'text-red-600'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Listing Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Listing Type:</span>
              <span className="text-gray-900">{getListingTypeDisplay()}</span>
            </div>
            {formData.startingBid && (
              <div className="flex justify-between">
                <span className="text-gray-600">Starting Bid:</span>
                <span className="text-gray-900">{formatPrice(parseFloat(formData.startingBid))}</span>
              </div>
            )}
            {formData.reservePrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">Reserve Price:</span>
                <span className="text-gray-900">{formatPrice(parseFloat(formData.reservePrice))}</span>
              </div>
            )}
            {formData.buyItNowPrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">Buy It Now:</span>
                <span className="text-gray-900">{formatPrice(parseFloat(formData.buyItNowPrice))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="text-gray-900">{formData.duration} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto-Relist:</span>
              <span className="text-gray-900">{formData.autoRelist ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Images:</span>
              <span className="text-gray-900">{formData.images.length} uploaded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Checklist */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Before You Publish</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Double-check your details</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Review title and description for accuracy</li>
              <li>• Verify pricing and shipping costs</li>
              <li>• Confirm image quality and order</li>
              <li>• Check category and item condition</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Terms and policies</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You agree to BidTreasure's selling policies</li>
              <li>• Listing fees apply as per our fee structure</li>
              <li>• You're responsible for accurate descriptions</li>
              <li>• Cancellation may incur fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;