import React, { useState, useEffect, useRef } from "react";
import { DealsCarousel } from "./DealsCarousel";
import axiosInstance from "../../api/axios";
import {
    MdChevronLeft,
    MdChevronRight,
    MdShoppingCart,
    MdRefresh,
} from "react-icons/md";
import { FaLeaf, FaSeedling } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy", "Herbs"];

const EMPTY_MESSAGES = [
    { emoji: "🌱", heading: "Wow, so empty!", sub: "Farmers are still waking up. Check back after chai ☕" },
    { emoji: "🌾", heading: "Nothing to harvest yet.", sub: "The fields are quiet — produce is on its way!" },
    { emoji: "🥕", heading: "Not a carrot in sight.", sub: "Farmers are busy watering their crops 🚿" },
    { emoji: "🍅", heading: "The shelves are bare.", sub: "Fresh listings dropping soon. Stay tuned!" },
];

// ── Skeleton ──────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="flex-shrink-0 w-60 bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
        <div className="h-40 bg-gray-100" />
        <div className="p-4 space-y-3">
            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-2.5 bg-gray-100 rounded w-full" />
            <div className="h-7 bg-gray-100 rounded-xl" />
        </div>
    </div>
);

// ── Empty State ────────────────────────────────────────────────
const EmptyState = ({ onRefresh }) => {
    const m = EMPTY_MESSAGES[Math.floor(Math.random() * EMPTY_MESSAGES.length)];
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
        >
            <div className="text-6xl mb-4">{m.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{m.heading}</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6">{m.sub}</p>
            <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-full text-sm text-gray-500 hover:bg-gray-50 transition"
            >
                <MdRefresh className="w-4 h-4" /> Refresh
            </button>
        </motion.div>
    );
};

// ── Product Card ────────────────────────────────────────────────
const ProductCard = ({ product }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0 w-60 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer"
    >
        {/* Image */}
        <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
            {product.mediaUrl ? (
                <img
                    src={product.mediaUrl}
                    alt={product.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <FaSeedling className="w-10 h-10 text-green-200" />
                </div>
            )}
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                {product.cropType}
            </span>
        </div>

        {/* Info */}
        <div className="p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold truncate mb-0.5">
                {product.sellerId?.name || "Local Farmer"}
            </p>
            <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{product.cropName}</h3>
            <p className="text-gray-400 text-xs line-clamp-2 min-h-[2.5rem]">
                {product.description || "Fresh farm produce, directly sourced."}
            </p>
            <div className="flex items-center justify-between mt-3">
                <span className="text-green-600 font-bold text-lg">₹{product.price}</span>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-colors">
                    <MdShoppingCart className="w-3 h-3" /> Add
                </button>
            </div>
        </div>
    </motion.div>
);

// ── Main ──────────────────────────────────────────────────────
export default function CustomerOverview() {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const rowRef = useRef(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/items");
            // Backend returns plain array of published items
            setAllProducts(Array.isArray(res.data) ? res.data : (res.data?.items || []));
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
            : allProducts.filter((p) => p.cropType === activeCategory);

    const scroll = (dir) =>
        rowRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

    return (
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── 1. Deals Carousel (same as Farmer dashboard) ── */}
                <DealsCarousel />

                {/* ── 2. Marketplace Section ── */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FaLeaf className="text-green-600 w-4 h-4" />
                            <h2 className="text-lg font-semibold text-gray-800">Fresh from the Farm</h2>
                        </div>
                        <span className="text-xs text-gray-400">
                            {loading ? "Loading…" : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""}`}
                        </span>
                    </div>

                    {/* Category pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${activeCategory === cat
                                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Products row */}
                    {loading ? (
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <EmptyState onRefresh={fetchProducts} />
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => scroll(-1)}
                                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow items-center justify-center hover:bg-gray-50 transition"
                            >
                                <MdChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => scroll(1)}
                                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow items-center justify-center hover:bg-gray-50 transition"
                            >
                                <MdChevronRight className="w-5 h-5 text-gray-600" />
                            </button>

                            <div
                                ref={rowRef}
                                className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                <AnimatePresence>
                                    {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
