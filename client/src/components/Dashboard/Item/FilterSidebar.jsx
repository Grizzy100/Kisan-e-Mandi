import React from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';

export const FilterSidebar = ({
  selectedCategories,
  onCategoryChange,
  search,
  onSearchChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onClearFilters,
  isOpen,
  onClose
}) => {
  const categories = [
    { id: 'fruit', label: 'Fruits' },
    { id: 'vegetable', label: 'Vegetables' },
    { id: 'grain', label: 'Grains & Pulses' },
    { id: 'other', label: 'Other / Misc' }
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

        {/* Search */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-3 uppercase tracking-wide text-sm">Search</h3>
          <div className="relative">
            <FaSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Crop, description…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-4 uppercase tracking-wide text-sm">Category</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryChange(category.id)}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-4 uppercase tracking-wide text-sm">Price Range (₹)</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              min={0}
              onChange={e => onPriceChange('min', e.target.value)}
              className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              min={0}
              onChange={e => onPriceChange('max', e.target.value)}
              className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
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
