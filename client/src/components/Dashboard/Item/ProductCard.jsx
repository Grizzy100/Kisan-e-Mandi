import React from 'react';
import { motion } from 'framer-motion';
import { MdShoppingBasket, MdVerified, MdLocationOn } from 'react-icons/md';
import { FaTag, FaLeaf } from 'react-icons/fa';

export function ProductCard({ 
    product, 
    onAddToCart, 
    onViewDetail,
    isOrder = false 
}) {
    // Determine category styling
    const categoryStyles = {
        'Vegetables': 'text-emerald-600 bg-emerald-50 border-emerald-100',
        'Fruits': 'text-orange-600 bg-orange-50 border-orange-100',
        'Grains': 'text-amber-600 bg-amber-50 border-amber-100',
        'Dairy': 'text-blue-600 bg-blue-50 border-blue-100',
        'default': 'text-gray-600 bg-gray-50 border-gray-100'
    };

    const categoryColor = categoryStyles[product.category] || categoryStyles.default;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-sm overflow-hidden border border-gray-100 flex flex-col h-full"
        >
            {/* Image Container — No Hover Scale */}
            <div className="relative aspect-square rounded-sm overflow-hidden bg-gray-50 ring-1 ring-black/5 m-1">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/200x200?text=Harvest"; }}
                />
                
                {/* Status Badge — Static Top-Left */}
                <div className="absolute top-1 left-1 z-10">
                    <div className="px-1.5 py-0.5 bg-white/95 backdrop-blur-md rounded-sm border border-emerald-100/50">
                        <span className="text-[7px] font-black text-emerald-700 uppercase tracking-widest whitespace-nowrap">
                            {product.ticketCategory || product.cropType || "In Stock"}
                        </span>
                    </div>
                </div>
 
                {/* Quick Buy Button — Permanently Visible */}
                <div className="absolute bottom-1 right-1 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(product);
                        }}
                        className="w-7 h-7 bg-emerald-600 text-white rounded-sm flex items-center justify-center transition-all active:scale-90"
                    >
                        <MdShoppingBasket className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Info Section — Compact & Clean */}
            <div className="flex-1 p-3 sm:p-4 pt-1 sm:pt-1.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-1.5 mb-1 opacity-60">
                        <FaLeaf className="text-[8px] text-emerald-500" />
                        <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 truncate uppercase tracking-widest leading-none">
                            Freshly Harvested
                        </p>
                    </div>
                    
                    <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-tight mb-1 truncate group-hover:text-emerald-700 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-gray-400 font-medium mb-2 uppercase tracking-tighter">
                        <MdLocationOn className="text-emerald-500 shrink-0" />
                        <span className="truncate">{product.location || 'Local Farm'}</span>
                    </div>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                        <span className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">/ {product.unit || 'kg'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
