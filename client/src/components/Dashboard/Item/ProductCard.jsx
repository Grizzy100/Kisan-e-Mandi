import React, { useState } from 'react';
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';

export const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              NEW
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              SALE
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <FaHeart size={14} className={isLiked ? 'fill-current' : ''} />
          </button>
          <button className="p-2 rounded-full bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200">
            <FaEye size={14} />
          </button>
        </div>

        {/* Quick Add to Cart */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-medium text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
