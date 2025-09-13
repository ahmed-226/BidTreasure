import React, { useState } from 'react';
import { Upload, X, Camera, Plus } from 'lucide-react';

const DetailsStep = ({ formData, updateFormData, errors }) => {
  const [dragOver, setDragOver] = useState(false);

  const conditions = [
    { value: 'new', label: 'New', description: 'Brand new, unused, unopened' },
    { value: 'like_new', label: 'Like New', description: 'Used but appears new' },
    { value: 'excellent', label: 'Excellent', description: 'Minimal wear, fully functional' },
    { value: 'very_good', label: 'Very Good', description: 'Light wear, works perfectly' },
    { value: 'good', label: 'Good', description: 'Moderate wear, functions normally' },
    { value: 'fair', label: 'Fair', description: 'Heavy wear but works' },
    { value: 'poor', label: 'Poor', description: 'Significant wear, may need repair' }
  ];

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    updateFormData('images', [...formData.images, ...newImages].slice(0, 10));
  };

  const removeImage = (imageId) => {
    const updatedImages = formData.images.filter(img => img.id !== imageId);
    updateFormData('images', updatedImages);
    
    if (formData.mainImageIndex >= updatedImages.length) {
      updateFormData('mainImageIndex', 0);
    }
  };

  const setMainImage = (index) => {
    updateFormData('mainImageIndex', index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Details</h2>
        <p className="text-gray-600">Provide detailed information about your item</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title * <span className="text-gray-500">({formData.title.length}/80)</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          placeholder="Enter a descriptive title for your item"
          maxLength={80}
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Include brand, model, size, color, and key features
        </p>
      </div>

      {/* Brand and Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => updateFormData('brand', e.target.value)}
            placeholder="e.g., Apple, Nike, Samsung"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => updateFormData('model', e.target.value)}
            placeholder="e.g., iPhone 15 Pro, Air Jordan 1"
            className="input-field"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description * <span className="text-gray-500">({formData.description.length}/2000)</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe your item in detail. Include condition, features, history, and any flaws."
          rows={6}
          maxLength={2000}
          className={`input-field ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Be honest and detailed. Include measurements, materials, and any defects.
        </p>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Condition *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {conditions.map((condition) => (
            <button
              key={condition.value}
              onClick={() => updateFormData('condition', condition.value)}
              className={`p-4 border rounded-lg text-left transition-all ${
                formData.condition === condition.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{condition.label}</div>
              <div className="text-sm text-gray-600 mt-1">{condition.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Photos * ({formData.images.length}/10)
        </label>
        
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Add photos of your item
            </p>
            <p className="text-gray-600 mb-4">
              Drag and drop images here, or click to browse
            </p>
            <div className="btn-secondary inline-flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </div>
          </label>
        </div>
        
        {errors.images && (
          <p className="text-red-500 text-sm mt-2">{errors.images}</p>
        )}

        {/* Image Preview Grid */}
        {formData.images.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-4">Your Photos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div
                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      index === formData.mainImageIndex
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setMainImage(index)}
                  >
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    {index === formData.mainImageIndex && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {/* Add More Button */}
              {formData.images.length < 10 && (
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center">
                    <Plus className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">Add More</span>
                  </div>
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click on an image to set it as the main photo. First photo will be used as thumbnail.
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Photo Tips:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use good lighting and clear, high-resolution images</li>
            <li>• Show multiple angles and any defects or wear</li>
            <li>• Include close-ups of important details</li>
            <li>• First photo should be the best overall view</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;