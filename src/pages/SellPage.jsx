import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  Camera,
  FileText,
  Settings,
  Globe
} from 'lucide-react';

import CategoryStep from '../components/sell/CategoryStep';
import DetailsStep from '../components/sell/DetailsStep';
import PricingStep from '../components/sell/PricingStep';
import DurationStep from '../components/sell/DurationStep';
import ShippingStep from '../components/sell/ShippingStep';
import ReviewStep from '../components/sell/ReviewStep';
import ListingPreview from '../components/sell/ListingPreview';

const SellPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    
    category: '',
    subcategory: '',
    itemType: '',
    
    
    title: '',
    description: '',
    condition: 'new',
    brand: '',
    model: '',
    
    
    images: [],
    mainImageIndex: 0,
    
    
    listingType: 'auction', 
    startingBid: '',
    reservePrice: '',
    buyItNowPrice: '',
    
    
    duration: 7, 
    scheduledStart: '', 
    autoRelist: false,
    
    
    shippingOptions: {
      domestic: {
        enabled: true,
        cost: '',
        handlingTime: '1-2 business days',
        methods: ['standard']
      },
      international: {
        enabled: false,
        cost: '',
        restrictions: []
      }
    },
    itemLocation: '',
    
    
    specifications: {},
    customAttributes: [],
    
    
    returnPolicy: '30-day returns',
    warranty: '',
    authenticity: false,
    
    
    tags: [],
    seoTitle: '',
    seoDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [drafts, setDrafts] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDraftDropdown, setShowDraftDropdown] = useState(false);


  const totalSteps = 6;

  const steps = [
    { id: 1, title: 'Category', icon: Package, description: 'Choose your item category' },
    { id: 2, title: 'Details', icon: FileText, description: 'Item information & photos' },
    { id: 3, title: 'Pricing', icon: DollarSign, description: 'Set your prices' },
    { id: 4, title: 'Duration', icon: Calendar, description: 'Auction timing' },
    { id: 5, title: 'Shipping', icon: Globe, description: 'Shipping & location' },
    { id: 6, title: 'Review', icon: Eye, description: 'Preview & publish' }
  ];

  
  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem('bidtreasure_drafts') || '[]');
    setDrafts(savedDrafts);
  }, []);

  
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title || formData.description) {
        saveDraft(true); 
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };



    const deleteDraft = (draftId) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    setDrafts(updatedDrafts);
    localStorage.setItem('bidtreasure_drafts', JSON.stringify(updatedDrafts));
    };

    const clearAllDrafts = () => {
    setDrafts([]);
    localStorage.removeItem('bidtreasure_drafts');
    };

    

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (showDraftDropdown && !event.target.closest('.relative')) {
        setShowDraftDropdown(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, [showDraftDropdown]);

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1: 
        if (!formData.category) newErrors.category = 'Please select a category';
        break;
        
      case 2: 
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (formData.title.length > 80) newErrors.title = 'Title must be 80 characters or less';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
        
      case 3: 
        if (formData.listingType === 'auction' || formData.listingType === 'both') {
          if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
            newErrors.startingBid = 'Starting bid must be greater than 0';
          }
        }
        if (formData.listingType === 'buy-now' || formData.listingType === 'both') {
          if (!formData.buyItNowPrice || parseFloat(formData.buyItNowPrice) <= 0) {
            newErrors.buyItNowPrice = 'Buy It Now price must be greater than 0';
          }
        }
        if (formData.reservePrice && parseFloat(formData.reservePrice) < parseFloat(formData.startingBid)) {
          newErrors.reservePrice = 'Reserve price must be higher than starting bid';
        }
        break;
        
      case 4: 
        if (!formData.duration) newErrors.duration = 'Please select auction duration';
        break;
        
      case 5: 
        if (!formData.itemLocation.trim()) newErrors.itemLocation = 'Item location is required';
        if (formData.shippingOptions.domestic.enabled && !formData.shippingOptions.domestic.cost) {
          newErrors.shippingCost = 'Domestic shipping cost is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const saveDraft = async (silent = false) => {
    setIsSaving(true);
    
    try {
      const draft = {
        id: Date.now(),
        ...formData,
        savedAt: new Date().toISOString(),
        step: currentStep
      };

      const existingDrafts = JSON.parse(localStorage.getItem('bidtreasure_drafts') || '[]');
      const newDrafts = [draft, ...existingDrafts.slice(0, 4)]; 
      
      localStorage.setItem('bidtreasure_drafts', JSON.stringify(newDrafts));
      setDrafts(newDrafts);
      
      if (!silent) {
        
        alert('Draft saved successfully!');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

    const loadDraft = (draft) => {
    const { id, savedAt, step, ...draftFormData } = draft;
    
    setFormData(draftFormData);
    setCurrentStep(step || 1);
    
    setErrors({});
    
    alert('Draft loaded successfully!');
    };

  const publishListing = async () => {
    
    let isValid = true;
    for (let i = 1; i <= totalSteps - 1; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!isValid) return;

    setIsPublishing(true);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      
      const existingDrafts = JSON.parse(localStorage.getItem('bidtreasure_drafts') || '[]');
      const filteredDrafts = existingDrafts.filter(draft => 
        draft.title !== formData.title
      );
      localStorage.setItem('bidtreasure_drafts', JSON.stringify(filteredDrafts));
      
      
      navigate('/dashboard?tab=my-listings&success=listing-created');
      
    } catch (error) {
      console.error('Error publishing listing:', error);
      alert('Error publishing listing. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CategoryStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 2:
        return <DetailsStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 3:
        return <PricingStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 4:
        return <DurationStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 5:
        return <ShippingStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 6:
        return <ReviewStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sell Your Item</h1>
                <p className="text-gray-600 mt-1">List your item and reach millions of buyers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {drafts.length > 0 && (
                <div className="relative">
                    <button 
                            className="btn-secondary flex items-center"
                            onClick={() => setShowDraftDropdown(!showDraftDropdown)}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Drafts ({drafts.length})
                        </button>
                      {/* Draft Dropdown */}
                {showDraftDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900">Saved Drafts</h3>
                        <p className="text-sm text-gray-600">Click to load a draft</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {drafts.map((draft, index) => (
                        <div
                            key={draft.id}
                            className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                            onClick={() => {
                            loadDraft(draft);
                            setShowDraftDropdown(false);
                            }}
                        >
                            <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                {draft.title || 'Untitled Draft'}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                Step {draft.step} of {totalSteps} • {draft.category || 'No category'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                Saved {new Date(draft.savedAt).toLocaleDateString()} at{' '}
                                {new Date(draft.savedAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                deleteDraft(draft.id);
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                        <button
                        onClick={() => {
                            clearAllDrafts();
                            setShowDraftDropdown(false);
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                        >
                        Clear All Drafts
                        </button>
                    </div>
                    </div>
                )}
                </div>
              )}
              
                <button
                    onClick={() => saveDraft()}
                    disabled={isSaving}
                    className="btn-secondary flex items-center"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                
                {currentStep === totalSteps && (
                    <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="btn-secondary flex items-center"
                    >
                    <Eye className="h-4 w-4 mr-2" />
                    {isPreviewMode ? 'Edit' : 'Preview'}
                    </button>
                )}

            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
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
                
                {index < steps.length - 1 && (
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
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isPreviewMode ? (
            <ListingPreview formData={formData} />
          ) : (
            <div className="p-8">
              {renderStepContent()}
            </div>
          )}
          
          {/* Navigation Footer */}
          {!isPreviewMode && (
            <div className="border-t border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-3">
                  {currentStep < totalSteps ? (
                    <button
                      onClick={nextStep}
                      className="btn-primary flex items-center"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={publishListing}
                      disabled={isPublishing}
                      className="btn-primary flex items-center"
                    >
                      {isPublishing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4 mr-2" />
                          Publish Listing
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellPage;