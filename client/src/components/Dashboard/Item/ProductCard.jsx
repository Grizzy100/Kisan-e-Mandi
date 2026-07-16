import React from 'react';
import { motion } from 'framer-motion';
import { MdShoppingBasket, MdVerified, MdLocationOn, MdCheck } from 'react-icons/md';
import { FaTag, FaLeaf } from 'react-icons/fa';

export const ProductCard = React.memo(function ProductCard({ 
    product, 
    onAddToCart, 
    onViewDetail,
    isOrder = false,
    inCart = false,
    cartQuantity = 0
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
    const isSoldOut = product.quantity < (product.minOrderQuantity || 1);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative bg-white rounded-sm overflow-hidden border flex flex-col h-full transition-all duration-300 ${
              inCart ? "border-emerald-500 shadow-sm shadow-emerald-500/20" : "border-gray-100"
            } ${isSoldOut ? "opacity-75 grayscale-[0.4]" : ""}`}
        >
            {/* Image Container — No Hover Scale */}
            <div className="relative aspect-square rounded-sm overflow-hidden bg-gray-50 ring-1 ring-black/5 m-1">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/200x200?text=Harvest"; }}
                />
                
                {/* Sold Out Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-red-600 text-white font-black text-sm sm:text-base px-6 py-1.5 uppercase tracking-[0.2em] -rotate-12 shadow-xl border-y-2 border-white/50 backdrop-blur-md w-[120%] text-center transform scale-110">
                            Sold Out
                        </div>
                    </div>
                )}
                
                {/* Status Badge — Static Top-Left */}
                <div className="absolute top-1 left-1 z-10 flex gap-1 flex-col items-start">
                    <div className="px-1.5 py-0.5 bg-white/95 backdrop-blur-md rounded-sm border border-emerald-100/50">
                        <span className="text-[7px] font-black text-emerald-700 uppercase tracking-widest whitespace-nowrap">
                            {product.ticketCategory || product.cropType || "In Stock"}
                        </span>
                    </div>
                </div>
 
                {/* Quick Buy Button — Permanently Visible */}
                {!isSoldOut && (
                    <div className="absolute bottom-1 right-1 z-20">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart?.(product);
                            }}
                            className={`w-7 h-7 rounded-sm flex items-center justify-center transition-all active:scale-90 relative ${
                              inCart 
                                ? "bg-white text-emerald-600 border border-emerald-500 shadow-sm" 
                                : "bg-emerald-600 text-white"
                            }`}
                        >
                            {inCart ? <MdCheck className="w-4 h-4" /> : <MdShoppingBasket className="w-3.5 h-3.5" />}
                            {inCart && cartQuantity > 1 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white shadow-sm">
                                  {cartQuantity}
                                </span>
                            )}
                        </button>
                    </div>
                )}
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

                    <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-gray-400 font-medium mb-2.5 uppercase tracking-tighter">
                        <MdLocationOn className="text-emerald-500 shrink-0" />
                        <span className="truncate">{product.location || 'Local Farm'}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-700 text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-widest">
                        Stock: {product.quantity} {product.unit}
                      </div>
                      <div className="bg-orange-50/50 border border-orange-100 text-orange-700 text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-widest">
                        MOQ: {product.minOrderQuantity || 1} {product.unit}
                      </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tighter">₹{product.price}</span>
                        <span className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">/ {product.unit || 'kg'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
