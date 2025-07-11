import React from 'react';
import { FaTimes } from 'react-icons/fa';

export const FilterSidebar = ({
  selectedCategories,
  selectedTypes,
  onCategoryChange,
  onTypeChange,
  onClearFilters,
  isOpen,
  onClose
}) => {
  const categories = [
    { id: 'seeds', label: 'Seeds' },
    { id: 'fertilizers', label: 'Fertilizers' },
    { id: 'manure', label: 'Manure' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'irrigation', label: 'Irrigation Tools' },
    { id: 'plants', label: 'Plants' }
  ];

  const types = [
    { id: 'organic', label: 'Organic' },
    { id: 'chemical', label: 'Chemical' },
    { id: 'seasonal', label: 'Seasonal' },
    { id: 'tools', label: 'Tools' }
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto bg-white border-r border-gray-200 z-50
        w-80 lg:w-64 p-6 overflow-y-auto transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes size={16} />
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Filters</h2>
          <button onClick={onClearFilters} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Clear all
          </button>
        </div>

        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-4 uppercase tracking-wide text-sm">Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryChange(category.id)}
                  className="w-4 h-4"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-4 uppercase tracking-wide text-sm">Type</h3>
          <div className="space-y-3">
            {types.map((type) => (
              <label key={type.id} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => onTypeChange(type.id)}
                  className="w-4 h-4"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <button
            onClick={onClearFilters}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};
