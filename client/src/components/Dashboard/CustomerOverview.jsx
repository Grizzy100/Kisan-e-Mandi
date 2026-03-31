import React, { useState, useEffect, useRef } from "react";
import { DealsCarousel } from "./DealsCarousel";
import EarningsChart from "./EarningsChart";
import axiosInstance from "../../api/axios";
import {
    MdChevronLeft,
    MdChevronRight,
    MdShoppingCart,
    MdRefresh,
    MdLocalOffer,
    MdStar,
} from "react-icons/md";
import { FaLeaf, FaSeedling } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./Item/ProductCard";
import OrderModal from "./Item/OrderModal";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy", "Herbs"];

const EMPTY_MESSAGES = [
    { emoji: "🌱", heading: "Wow, so empty!", sub: "Farmers are still waking up. Check back after chai ☕" },
    { emoji: "🌾", heading: "Nothing to harvest yet.", sub: "The fields are quiet — produce is on its way!" },
    { emoji: "🥕", heading: "Not a carrot in sight.", sub: "Farmers are busy watering their crops 🚿" },
    { emoji: "🍅", heading: "The shelves are bare.", sub: "Fresh listings dropping soon. Stay tuned!" },
];

const SkeletonCard = () => (
    <div className="aspect-[4/5] bg-gray-100 rounded-sm animate-pulse shadow-inner" />
);

const EmptyState = ({ onRefresh }) => {
    const m = EMPTY_MESSAGES[Math.floor(Math.random() * EMPTY_MESSAGES.length)];
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center text-gray-400 font-medium"
        >
            <div className="text-6xl mb-4">{m.emoji}</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{m.heading}</h3>
            <p className="text-sm max-w-xs mb-8">{m.sub}</p>
            <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest active:scale-95"
            >
                <MdRefresh className="w-4 h-4" /> REFRESH FEED
            </button>
        </motion.div>
    );
};

export default function CustomerOverview() {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [orderProduct, setOrderProduct] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const isCustomer = user?.role === 'customer';

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/items");
            const data = Array.isArray(res.data) ? res.data : (res.data?.items || []);
            setAllProducts(data.map(item => ({
                id: item._id,
                name: item.name,
                cropName: item.name,
                description: item.description,
                price: item.price,
                unit: item.unit,
                quantity: item.quantity,
                image: item.mediaUrl || item.imageUrl,
                mediaType: item.mediaType || 'image',
                cropType: item.cropType,
                sellerName: item.sellerId?.name || 'Farmer',
                location: item.location
            })));
        } catch (err) {
            console.error("Failed to fetch items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const filtered =
        activeCategory === "All"
            ? allProducts
            : allProducts.filter((p) => p.cropType?.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 lg:px-6 space-y-10 font-inter pb-24 sm:pb-8">
            {/* Standardized Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-sm border border-emerald-100 tracking-tighter uppercase">
                            Overview
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">
                        Marketplace Insights
                    </h1>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Support local farm harvests.</p>
                </div>
                <div className="hidden md:flex items-center gap-4 bg-white border border-gray-100 p-2.5 rounded-sm shadow-sm font-mono">
                    <div className="px-4 py-0.5 text-center border-r border-gray-100">
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Listings</p>
                        <p className="text-xl font-black text-emerald-600 tracking-tighter">{allProducts.length}</p>
                    </div>
                </div>
            </div>

            {/* ── 1. Deals Carousel ── */}
            <DealsCarousel />

            {/* ── 2. Spending Analytics ── */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spending Analytics</h2>
                </div>
                <EarningsChart 
                    endpoint="/analytics/spending" 
                    title="Spending Snapshot" 
                    description="Tracking your total purchases and market spending." 
                    dataKey="spending"
                />
            </div>

            {/* ── 3. Marketplace Grid Section ── */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Marketplace Browse</h2>
                    </div>
                    
                    {/* Category Pills */}
                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="flex p-1 bg-gray-50 rounded-sm border border-gray-100 flex-nowrap whitespace-nowrap min-w-max">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-sm text-[8px] font-black transition-all duration-300 uppercase tracking-widest ${activeCategory === cat
                                            ? "bg-white text-emerald-700 shadow-sm border border-gray-100"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dense Grid Layout */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-gray-100 border-dashed rounded-sm py-16">
                        <EmptyState onRefresh={fetchProducts} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 auto-rows-fr">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((p) => (
                                <ProductCard 
                                    key={p.id} 
                                    product={p} 
                                    mode="browse"
                                    onAddToCart={isCustomer ? (prod) => setOrderProduct(prod) : undefined}
                                />
                            ))}
                        </AnimatePresence>
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
}
