import React from 'react';
import { Check } from 'lucide-react';

const CategoryStep = ({ formData, updateFormData, errors }) => {
  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '📱',
      subcategories: ['Smartphones', 'Laptops', 'Gaming', 'Audio', 'Cameras', 'Smart Home']
    },
    {
      id: 'fashion',
      name: 'Fashion',
      icon: '👕',
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Bags', 'Jewelry']
    },
    {
      id: 'collectibles',
      name: 'Collectibles',
      icon: '🏆',
      subcategories: ['Trading Cards', 'Coins', 'Stamps', 'Memorabilia', 'Vintage Items', 'Antiques']
    },
    {
      id: 'vehicles',
      name: 'Vehicles',
      icon: '🚗',
      subcategories: ['Cars', 'Motorcycles', 'Boats', 'RVs', 'Parts & Accessories', 'Classic Cars']
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      icon: '🏡',
      subcategories: ['Furniture', 'Home Decor', 'Kitchen', 'Garden Tools', 'Appliances', 'Storage']
    },
    {
      id: 'art',
      name: 'Art & Crafts',
      icon: '🎨',
      subcategories: ['Paintings', 'Sculptures', 'Photography', 'Handmade', 'Supplies', 'Digital Art']
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '⚽',
      subcategories: ['Exercise Equipment', 'Outdoor Gear', 'Team Sports', 'Water Sports', 'Winter Sports', 'Cycling']
    },
    {
      id: 'books-media',
      name: 'Books & Media',
      icon: '📚',
      subcategories: ['Books', 'DVDs', 'Music', 'Video Games', 'Magazines', 'Educational']
    }
  ];

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Category</h2>
        <p className="text-gray-600">Select the category that best describes your item</p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Main Category *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFormData('category', category.id)}
              className={`p-4 border-2 rounded-lg transition-all hover:border-blue-300 ${
                formData.category === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-gray-900">{category.name}</div>
                {formData.category === category.id && (
                  <div className="mt-2">
                    <Check className="h-5 w-5 text-blue-500 mx-auto" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="text-red-500 text-sm mt-2">{errors.category}</p>
        )}
      </div>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Subcategory (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedCategory.subcategories.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => updateFormData('subcategory', subcategory)}
                className={`p-3 border rounded-lg text-sm transition-all ${
                  formData.subcategory === subcategory
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Item Type */}
      {formData.category && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Item Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => updateFormData('itemType', 'new')}
              className={`p-4 border rounded-lg text-left transition-all ${
                formData.itemType === 'new'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">Brand New</div>
              <div className="text-sm text-gray-600 mt-1">
                Never used, in original packaging
              </div>
            </button>
            <button
              onClick={() => updateFormData('itemType', 'used')}
              className={`p-4 border rounded-lg text-left transition-all ${
                formData.itemType === 'used'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">Used</div>
              <div className="text-sm text-gray-600 mt-1">
                Previously owned, various conditions
              </div>
            </button>
            <button
              onClick={() => updateFormData('itemType', 'refurbished')}
              className={`p-4 border rounded-lg text-left transition-all ${
                formData.itemType === 'refurbished'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">Refurbished</div>
              <div className="text-sm text-gray-600 mt-1">
                Restored to working condition
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryStep;