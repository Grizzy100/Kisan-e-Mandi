import React, { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { products } from './products';
import { useCart } from './useCart';

const Item = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const { addToCart } = useCart();

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleTypeChange = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const typeMatch =
      selectedTypes.length === 0 || selectedTypes.includes(product.type);
    return categoryMatch && typeMatch;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Filter Sidebar */}
      <FilterSidebar
        selectedCategories={selectedCategories}
        selectedTypes={selectedTypes}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
        onClearFilters={handleClearFilters}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 px-4 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Explore Products</h1>
          <button
            className="lg:hidden px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow font-medium"
            onClick={() => setIsSidebarOpen(true)}
          >
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-lg">No products found with current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
