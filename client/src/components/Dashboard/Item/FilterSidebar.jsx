import React from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { MdFilterList, MdOutlineCategory, MdCurrencyRupee, MdSearch } from 'react-icons/md';

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
    { id: 'fruit', label: 'Fresh Fruits' },
    { id: 'vegetable', label: 'Green Vegetables' },
    { id: 'grain', label: 'Grains & Pulses' },
    { id: 'other', label: 'Other Harvests' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300" 
          onClick={onClose} 
        />
      )}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-64px)] bg-white/90 backdrop-blur-xl border-r border-gray-100 z-[70]
        w-72 lg:w-64 p-8 overflow-y-auto transition-all duration-500 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
      `}>
        <div className="flex items-center justify-between mb-10 lg:hidden">
          <div className="flex items-center gap-2">
            <MdFilterList className="text-emerald-600 w-5 h-5" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filters</h2>
          </div>
          <button onClick={onClose} className="p-2.5 bg-gray-50 rounded-sm transition-all active:scale-90">
            <FaTimes size={14} className="text-gray-400" />
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <MdFilterList className="text-emerald-600 w-5 h-5" />
            <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Filters</h2>
          </div>
          <button 
            onClick={onClearFilters} 
            className="text-[9px] font-black text-gray-400 transition-colors uppercase tracking-widest"
          >
            Reset
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-10 group">
          <div className="flex items-center gap-2 mb-4">
             <MdSearch className="text-emerald-500 w-4 h-4" />
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Search</h3>
          </div>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search crops..."
              className="w-full pl-4 pr-10 py-3 bg-gray-50/50 border border-gray-100 rounded-sm text-xs font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
             <MdOutlineCategory className="text-emerald-500 w-4 h-4" />
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classifications</h3>
          </div>
          <div className="space-y-4">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => onCategoryChange(category.id)}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-100 rounded-sm bg-gray-50 checked:bg-emerald-600 checked:border-emerald-600 transition-all cursor-pointer"
                    />
                    <FaTimes className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity rotate-45" />
                </div>
                <span className="ml-3 text-xs font-bold text-gray-500 transition-colors uppercase tracking-tight">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
             <MdCurrencyRupee className="text-emerald-500 w-4 h-4" />
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Bracket</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  min={0}
                  onChange={e => onPriceChange('min', e.target.value)}
                  className="w-full pl-6 pr-3 py-3 bg-gray-50/50 border border-gray-100 rounded-sm text-xs font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
            </div>
            <div className="w-2 h-0.5 bg-gray-100 rounded-full" />
            <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  min={0}
                  onChange={e => onPriceChange('max', e.target.value)}
                  className="w-full pl-6 pr-3 py-3 bg-gray-50/50 border border-gray-100 rounded-sm text-xs font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
            </div>
          </div>
        </div>

        {/* Mobile Clear Button */}
        <div className="lg:hidden mt-auto pt-6 border-t border-gray-50">
          <button
            onClick={() => { onClearFilters(); onClose(); }}
            className="w-full py-4 bg-gray-900 text-white rounded-sm text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};
