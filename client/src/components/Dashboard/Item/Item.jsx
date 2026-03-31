import React, { useState, useEffect, useMemo } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { getItems } from '../../../api/itemAPI';
import OrderModal from './OrderModal';
import { MdFilterList, MdSearch, MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [orderProduct, setOrderProduct] = useState(null);

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50">
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

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-sm border border-emerald-100 tracking-tighter uppercase">
                        Marketplace
                    </span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">
                    Browse Harvests
                </h1>
                {!loading && (
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    {products.length} verified listings
                  </p>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                <div className="relative group flex-1 md:w-56">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-sm text-[10px] font-black uppercase focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-300"
                    />
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden flex items-center justify-center p-2.5 bg-white border border-gray-200 text-gray-900 rounded-sm active:bg-gray-50"
                >
                    <MdFilterList className="w-4 h-4 text-emerald-600" />
                </button>
            </div>
        </div>

        {/* Filters Summary */}
        {(selectedCategories.length > 0 || minPrice || maxPrice) && (
            <div className="flex flex-wrap gap-1.5">
                {selectedCategories.map(cat => (
                    <span key={cat} className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[8px] font-black rounded-sm border border-emerald-100 uppercase tracking-tighter">
                        {cat}
                        <MdClose className="cursor-pointer w-2.5 h-2.5" onClick={() => handleCategoryChange(cat)} />
                    </span>
                ))}
                {(minPrice || maxPrice) && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[8px] font-black rounded-sm border border-blue-100 uppercase tracking-tighter">
                        Price
                        <MdClose className="cursor-pointer w-2.5 h-2.5" onClick={() => { setMinPrice(''); setMaxPrice(''); }} />
                    </span>
                )}
                <button 
                  onClick={handleClearFilters}
                  className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1"
                >Clear</button>
            </div>
        )}

        {/* Content area */}
        <div className="min-h-[60vh]">
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 rounded-sm animate-pulse" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No matches</h3>
                    <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest">Try adjusting filters.</p>
                </div>
            ) : (
                <motion.div 
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3"
                >
                    <AnimatePresence mode="popLayout">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                mode="browse"
                                onAddToCart={isCustomer ? (p) => setOrderProduct(p) : undefined}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
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
