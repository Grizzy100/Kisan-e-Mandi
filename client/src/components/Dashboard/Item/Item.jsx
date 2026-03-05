import React, { useState, useEffect, useMemo } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { getItems } from '../../../api/itemAPI';
import OrderModal from './OrderModal';

const formatItem = (item, fallbackUser) => ({
  id: item._id,
  name: item.name,
  description: item.description || '',
  price: item.price,
  unit: item.unit,
  quantity: item.quantity,
  image: item.mediaUrl || item.imageUrl || 'https://placehold.co/400x400?text=No+Photo',
  mediaType: item.mediaType || 'image',
  category: item.cropType,
  ticketCategory: item.ticketCategory || '',
  cropType: item.cropType,
  cropName: item.cropName,
  location: item.location || '',
  sellerName: item.sellerId?.name || fallbackUser?.name || 'Farmer',
  sellerAvatar: item.sellerId?.avatar || fallbackUser?.avatar || '',
});

const Item = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);

  const isCustomer = user?.role === 'customer';

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null); // product to order

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (minPrice !== '') params.minPrice = minPrice;
        if (maxPrice !== '') params.maxPrice = maxPrice;

        const data = await getItems(params);
        setAllProducts(data.map((item) => formatItem(item, user)));
      } catch (err) {
        console.error('Marketplace fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, user]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setProducts(allProducts);
      return;
    }
    setProducts(allProducts.filter((p) => selectedCategories.includes(p.category)));
  }, [allProducts, selectedCategories]);

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handlePriceChange = (type, value) => {
    if (type === 'min') setMinPrice(value);
    else setMaxPrice(value);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <FilterSidebar
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        search={search}
        onSearchChange={setSearch}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
        onClearFilters={handleClearFilters}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 px-4 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Marketplace</h1>
            {!loading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {products.length} {products.length === 1 ? 'listing' : 'listings'} found
              </p>
            )}
          </div>
          <button
            className="lg:hidden px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow font-medium text-sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            Filters
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-4xl mb-4">🌾</p>
            <p className="text-lg font-medium text-gray-500">No listings found</p>
            <p className="text-sm mt-1">Approved crop tickets will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                mode="browse"
                onAddToCart={isCustomer ? (p) => setOrderProduct(p) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {orderProduct && isCustomer && (
        <OrderModal
          product={orderProduct}
          userRole={user?.role}
          onClose={() => setOrderProduct(null)}
          onSuccess={() => setOrderProduct(null)}
        />
      )}
    </div>
  );
};


export default Item;
