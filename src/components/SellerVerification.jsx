import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  User,
  CreditCard,
  Building,
  Phone,
  Mail,
  Camera,
  FileText,
  Clock,
  X,
  Check
} from 'lucide-react';

const SellerVerification = ({ user, onVerificationComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    identityType: '',
    identityDocument: null,
    businessDocument: null,
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    bankAccount: {
      accountType: '',
      routingNumber: '',
      accountNumber: ''
    },
    businessInfo: {
      businessName: '',
      taxId: '',
      businessType: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const verificationSteps = [
    { id: 1, title: 'Identity Verification', icon: User, description: 'Verify your identity' },
    { id: 2, title: 'Address Verification', icon: Building, description: 'Confirm your address' },
    { id: 3, title: 'Phone Verification', icon: Phone, description: 'Verify your phone' },
    { id: 4, title: 'Payment Method', icon: CreditCard, description: 'Add payment method' },
    { id: 5, title: 'Review & Submit', icon: FileText, description: 'Review and submit' }
  ];

  const identityTypes = [
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'state_id', label: 'State ID Card' }
  ];

  const handleFileUpload = (field, file) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setVerificationData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setVerificationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!verificationData.identityType) newErrors.identityType = 'Please select an identity type';
        if (!verificationData.identityDocument) newErrors.identityDocument = 'Please upload your identity document';
        break;
      case 2:
        if (!verificationData.address.street) newErrors.street = 'Street address is required';
        if (!verificationData.address.city) newErrors.city = 'City is required';
        if (!verificationData.address.state) newErrors.state = 'State is required';
        if (!verificationData.address.zipCode) newErrors.zipCode = 'ZIP code is required';
        break;
      case 3:
        if (!verificationData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        break;
      case 4:
        if (!verificationData.bankAccount.accountType) newErrors.accountType = 'Account type is required';
        if (!verificationData.bankAccount.routingNumber) newErrors.routingNumber = 'Routing number is required';
        if (!verificationData.bankAccount.accountNumber) newErrors.accountNumber = 'Account number is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onVerificationComplete({
        status: 'pending',
        submittedAt: new Date().toISOString(),
        estimatedReview: '2-3 business days'
      });
    } catch (error) {
      console.error('Verification submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your identity document type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {identityTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('identityType', type.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      verificationData.identityType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
              {errors.identityType && (
                <p className="text-red-500 text-sm mt-1">{errors.identityType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload your identity document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('identityDocument', e.target.files[0])}
                  className="hidden"
                  id="identity-upload"
                />
                <label htmlFor="identity-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {verificationData.identityDocument 
                      ? verificationData.identityDocument.name
                      : 'Click to upload or drag and drop'
                    }
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, or PDF up to 10MB</p>
                </label>
              </div>
              {errors.identityDocument && (
                <p className="text-red-500 text-sm mt-1">{errors.identityDocument}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Your information is secure</p>
                  <ul className="space-y-1">
                    <li>• All documents are encrypted and stored securely</li>
                    <li>• Information is only used for verification purposes</li>
                    <li>• We comply with all privacy regulations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={verificationData.address.street}
                  onChange={(e) => handleInputChange('street', e.target.value, 'address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={verificationData.address.city}
                  onChange={(e) => handleInputChange('city', e.target.value, 'address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={verificationData.address.state}
                  onChange={(e) => handleInputChange('state', e.target.value, 'address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="NY"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={verificationData.address.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value, 'address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={verificationData.address.country}
                  onChange={(e) => handleInputChange('country', e.target.value, 'address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={verificationData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Phone Verification</p>
                  <p>We'll send you a verification code via SMS to confirm your phone number.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                value={verificationData.bankAccount.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value, 'bankAccount')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Account Type</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business">Business</option>
              </select>
              {errors.accountType && <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routing Number
              </label>
              <input
                type="text"
                value={verificationData.bankAccount.routingNumber}
                onChange={(e) => handleInputChange('routingNumber', e.target.value, 'bankAccount')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="123456789"
              />
              {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={verificationData.bankAccount.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value, 'bankAccount')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1234567890"
              />
              {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-1">Secure Banking</p>
                  <p>Your banking information is encrypted and securely stored. We use bank-level security.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Submit</h3>
              <p className="text-gray-600">
                Please review your information before submitting for verification.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Identity Document</h4>
                <p className="text-sm text-gray-600">
                  {verificationData.identityType && identityTypes.find(t => t.value === verificationData.identityType)?.label}
                  {verificationData.identityDocument && ` - ${verificationData.identityDocument.name}`}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                <p className="text-sm text-gray-600">
                  {verificationData.address.street}, {verificationData.address.city}, {verificationData.address.state} {verificationData.address.zipCode}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Phone Number</h4>
                <p className="text-sm text-gray-600">{verificationData.phoneNumber}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bank Account</h4>
                <p className="text-sm text-gray-600">
                  {verificationData.bankAccount.accountType} - ****{verificationData.bankAccount.accountNumber.slice(-4)}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Verification Timeline</p>
                  <p>Your verification will be reviewed within 2-3 business days. You'll receive an email notification once completed.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {verificationSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              
              {index < verificationSteps.length - 1 && (
                <div
                  className={`hidden md:block w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {verificationSteps[currentStep - 1]?.title}
          </h2>
          <p className="text-gray-600">
            {verificationSteps[currentStep - 1]?.description}
          </p>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Submitting...
                </>
              ) : (
                'Submit for Verification'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerVerification;