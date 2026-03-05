import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import {
    MdChevronLeft,
    MdChevronRight,
    MdShoppingCart,
    MdRefresh,
} from "react-icons/md";
import { FaLeaf, FaSeedling } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy", "Herbs"];

// ── Skeleton card ────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
        <div className="h-44 bg-gray-100" />
        <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-8 bg-gray-100 rounded-xl mt-2" />
        </div>
    </div>
);

// ── Empty state ───────────────────────────────────────────────────
const EmptyState = ({ onRefresh }) => {
    const messages = [
        { emoji: "🌱", heading: "Wow, so empty!", sub: "Farmers are still waking up. Check back after chai." },
        { emoji: "🌾", heading: "Nothing to harvest yet.", sub: "The fields are quiet. Produce will arrive soon!" },
        { emoji: "🥕", heading: "Not a carrot in sight.", sub: "Farmers are probably still watering their crops." },
    ];
    const m = messages[Math.floor(Math.random() * messages.length)];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 px-4 text-center"
        >
            <div className="text-7xl mb-6 select-none">{m.emoji}</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">{m.heading}</h3>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed mb-8">{m.sub}</p>
            <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
                <MdRefresh className="w-4 h-4" /> Refresh
            </button>
        </motion.div>
    );
};

// ── Product card ─────────────────────────────────────────────────
const ProductCard = ({ product }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer"
    >
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
            {product.mediaUrl ? (
                <img
                    src={product.mediaUrl}
                    alt={product.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <FaSeedling className="w-12 h-12 text-green-200" />
                </div>
            )}
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide shadow">
                {product.cropType}
            </span>
        </div>

        {/* Body */}
        <div className="p-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                {product.sellerId?.name || "Local Farmer"}
            </p>
            <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{product.cropName}</h3>
            <p className="text-gray-400 text-xs line-clamp-2 min-h-[2.5rem]">{product.description || "Fresh farm produce, directly sourced."}</p>

            <div className="flex items-center justify-between mt-3">
                <span className="text-green-600 font-bold text-xl">₹{product.price}</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm">
                    <MdShoppingCart className="w-3.5 h-3.5" /> Add
                </button>
            </div>
        </div>
    </motion.div>
);

// ── Main Component ────────────────────────────────────────────────
const FeaturedProducts = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const rowRef = useRef(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/items?status=published&isActive=true&limit=30");
            setAllProducts(res.data?.items || res.data || []);
        } catch (err) {
            console.error("Failed to load products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const filtered =
        activeCategory === "All"
            ? allProducts
            : allProducts.filter((p) => p.cropType === activeCategory);

    const scrollLeft = () => rowRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    const scrollRight = () => rowRef.current?.scrollBy({ left: 300, behavior: "smooth" });

    return (
        <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Section heading */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full text-green-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <FaLeaf className="w-3 h-3" /> Live Listings
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                            Fresh from the <span className="text-green-600">Farm</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">
                            Real crops. Real farmers. No middlemen.
                        </p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 border-2 border-green-600 text-green-700 font-semibold text-sm rounded-xl hover:bg-green-600 hover:text-white transition-all"
                    >
                        <MdShoppingCart className="w-4 h-4" /> Browse All
                    </Link>
                </div>

                {/* Category pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === cat
                                    ? "bg-green-600 text-white border-green-600 shadow"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Horizontal scroll carousel */}
                {loading ? (
                    <div className="flex gap-5 overflow-hidden pb-2">
                        {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState onRefresh={fetchProducts} />
                ) : (
                    <div className="relative">
                        {/* Scroll arrows */}
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
                        >
                            <MdChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
                        >
                            <MdChevronRight className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* The scrollable row */}
                        <div
                            ref={rowRef}
                            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            <AnimatePresence>
                                {filtered.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Count badge */}
                {!loading && filtered.length > 0 && (
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> verified listing{filtered.length !== 1 ? "s" : ""}
                    </p>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
