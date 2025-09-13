import React from 'react';
import { MapPin, Truck, Globe, Package, DollarSign, Clock, Info, AlertCircle } from 'lucide-react';

const ShippingStep = ({ formData, updateFormData, errors }) => {
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', time: '3-5 business days', icon: Truck },
    { id: 'expedited', name: 'Expedited Shipping', time: '1-2 business days', icon: Package },
    { id: 'overnight', name: 'Overnight', time: 'Next business day', icon: Clock }
  ];

  const handlingTimeOptions = [
    '1 business day',
    '1-2 business days',
    '2-3 business days',
    '3-5 business days',
    '1 week'
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Japan', 'Italy', 'Spain', 'Netherlands'
  ];

  const updateShippingOption = (type, field, value) => {
    updateFormData('shippingOptions', {
      ...formData.shippingOptions,
      [type]: {
        ...formData.shippingOptions[type],
        [field]: value
      }
    });
  };

  const toggleShippingMethod = (type, method) => {
    const currentMethods = formData.shippingOptions[type].methods || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    
    updateShippingOption(type, 'methods', newMethods);
  };

  const addRestriction = (country) => {
    const currentRestrictions = formData.shippingOptions.international.restrictions || [];
    if (!currentRestrictions.includes(country)) {
      updateShippingOption('international', 'restrictions', [...currentRestrictions, country]);
    }
  };

  const removeRestriction = (country) => {
    const currentRestrictions = formData.shippingOptions.international.restrictions || [];
    updateShippingOption('international', 'restrictions', 
      currentRestrictions.filter(c => c !== country)
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipping & Location</h2>
        <p className="text-gray-600">Set up shipping options and specify your item location</p>
      </div>

      {/* Item Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={formData.itemLocation}
            onChange={(e) => updateFormData('itemLocation', e.target.value)}
            placeholder="City, State, Country (e.g., New York, NY, USA)"
            className={`input-field pl-10 ${errors.itemLocation ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.itemLocation && (
          <p className="text-red-500 text-sm mt-1">{errors.itemLocation}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          This helps buyers estimate shipping costs and delivery times
        </p>
      </div>

      {/* Domestic Shipping */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Domestic Shipping</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.shippingOptions.domestic.enabled}
              onChange={(e) => updateShippingOption('domestic', 'enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Enable domestic shipping</span>
          </label>
        </div>

        {formData.shippingOptions.domestic.enabled && (
          <div className="space-y-6">
            {/* Shipping Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Cost *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shippingOptions.domestic.cost}
                    onChange={(e) => updateShippingOption('domestic', 'cost', e.target.value)}
                    placeholder="0.00"
                    className={`input-field pl-10 ${errors.shippingCost ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.shippingCost && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingCost}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">Enter 0 for free shipping</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Handling Time
                </label>
                <select
                  value={formData.shippingOptions.domestic.handlingTime}
                  onChange={(e) => updateShippingOption('domestic', 'handlingTime', e.target.value)}
                  className="input-field"
                >
                  {handlingTimeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <p className="text-gray-500 text-sm mt-1">
                  Time to prepare and ship your item
                </p>
              </div>
            </div>

            {/* Shipping Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Shipping Methods
              </label>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.shippingOptions.domestic.methods?.includes(method.id) || false}
                        onChange={() => toggleShippingMethod('domestic', method.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex items-center">
                        <method.icon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* International Shipping */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">International Shipping</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.shippingOptions.international.enabled}
              onChange={(e) => updateShippingOption('international', 'enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Enable international shipping</span>
          </label>
        </div>

        {formData.shippingOptions.international.enabled && (
          <div className="space-y-6">
            {/* International Shipping Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                International Shipping Cost
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingOptions.international.cost}
                  onChange={(e) => updateShippingOption('international', 'cost', e.target.value)}
                  placeholder="0.00"
                  className="input-field pl-10"
                />
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Cost for international shipping (buyers pay customs/duties)
              </p>
            </div>

            {/* Shipping Restrictions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Shipping Restrictions (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Select countries you do NOT ship to. Leave empty to ship worldwide.
              </p>
              
              <div className="space-y-3">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addRestriction(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="input-field"
                >
                  <option value="">Add country restriction...</option>
                  {countries.filter(country => 
                    !formData.shippingOptions.international.restrictions?.includes(country)
                  ).map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>

                {formData.shippingOptions.international.restrictions?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-700 mb-2">Countries excluded from shipping:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.shippingOptions.international.restrictions.map((country) => (
                        <span
                          key={country}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                        >
                          {country}
                          <button
                            onClick={() => removeRestriction(country)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Shipping Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Pricing Strategy</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include packaging costs in shipping price</li>
              <li>• Consider offering free shipping with higher starting bid</li>
              <li>• Check competitor shipping rates</li>
              <li>• Factor in insurance for valuable items</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">International Considerations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Buyers pay customs duties and taxes</li>
              <li>• Consider shipping restrictions by country</li>
              <li>• Use tracking for international shipments</li>
              <li>• Allow extra time for international delivery</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shipping Summary */}
      {(formData.shippingOptions.domestic.enabled || formData.shippingOptions.international.enabled) && (
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Shipping Summary</h3>
          <div className="space-y-3">
            {formData.shippingOptions.domestic.enabled && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Domestic Shipping:</span>
                <span className="font-semibold text-green-900">
                  {formData.shippingOptions.domestic.cost === '0' || formData.shippingOptions.domestic.cost === '' 
                    ? 'Free' 
                    : `$${formData.shippingOptions.domestic.cost}`
                  }
                </span>
              </div>
            )}
            {formData.shippingOptions.international.enabled && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">International Shipping:</span>
                <span className="font-semibold text-green-900">
                  {formData.shippingOptions.international.cost === '0' || formData.shippingOptions.international.cost === '' 
                    ? 'Free' 
                    : `$${formData.shippingOptions.international.cost}`
                  }
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-green-700">Handling Time:</span>
              <span className="font-semibold text-green-900">
                {formData.shippingOptions.domestic.handlingTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Ships From:</span>
              <span className="font-semibold text-green-900">
                {formData.itemLocation || 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingStep;