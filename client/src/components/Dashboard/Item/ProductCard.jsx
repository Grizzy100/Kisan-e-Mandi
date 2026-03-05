import React from 'react';
import { FaShoppingCart, FaMapMarkerAlt, FaBoxOpen, FaTrash } from 'react-icons/fa';
import { FcAcceptDatabase } from 'react-icons/fc';
import { MdOutlineWatchLater } from 'react-icons/md';

const CATEGORY_COLORS = {
  fruit:     'bg-pink-50 text-pink-700 border-pink-100',
  vegetable: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  grain:     'bg-amber-50 text-amber-700 border-amber-100',
  other:     'bg-gray-50 text-gray-600 border-gray-200',
};

/**
 * mode="browse"   – public marketplace card (Buy Now on hover, only if onAddToCart provided)
 * mode="pending"  – admin-approved, awaiting vendor Accept / Later (on hover)
 * mode="later"    – shelved by vendor, can Accept or Delete (on hover)
 * mode="active"   – live listing in farmer's view (no hover action)
 */
export const ProductCard = ({ product, onAddToCart, mode = 'browse', onAccept, onLater, onDelete }) => {
  const categoryColor = CATEGORY_COLORS[product.cropType] || CATEGORY_COLORS.other;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.mediaType === 'video' ? (
          <video
            src={product.image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            muted
            playsInline
            controls
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={e => { e.target.src = 'https://placehold.co/400x400?text=No+Photo'; }}
          />
        )}

        {/* Category badge — top-left */}
        <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold border ${categoryColor}`}>
          {product.ticketCategory || (product.cropType ? product.cropType.charAt(0).toUpperCase() + product.cropType.slice(1) : 'Other')}
        </span>

        {/* Status badge — top-right (vendor modes only) */}
        {mode === 'pending' && (
          <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-amber-400 text-amber-900 font-bold shadow">
            Admin Approved
          </span>
        )}
        {mode === 'later' && (
          <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-gray-500 text-white font-bold shadow">
            Shelved
          </span>
        )}
        {mode === 'active' && (
          <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-emerald-500 text-white font-bold shadow">
            Live
          </span>
        )}

        {/* Hover action overlay — slides up */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          {mode === 'browse' && onAddToCart && (
            <button
              onClick={() => onAddToCart?.(product)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              <FaShoppingCart size={13} />
              Buy Now
            </button>
          )}
          {mode === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => onAccept?.(product.id)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-1 text-xs shadow-lg"
                title="Accept and publish to marketplace"
              >
                ✓ Accept
              </button>
              <button
                onClick={() => onLater?.(product.id)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-1 text-xs shadow-lg"
                title="Decide later"
              >
                ⏲ Later
              </button>
            </div>
          )}
          {mode === 'later' && (
            <div className="flex gap-2">
              <button
                onClick={() => onAccept?.(product.id)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-1 text-xs shadow-lg"
                title="Accept and publish to marketplace"
              >
                ✓ Accept
              </button>
              <button
                onClick={() => onDelete?.(product.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-1 text-xs shadow-lg"
                title="Delete listing"
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">

        {/* Crop name tag */}
        {product.cropName && (
          <span className="text-xs font-medium text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full self-start">
            {product.cropName}
          </span>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Meta row: quantity + location */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
          {product.quantity && (
            <span className="flex items-center gap-1">
              <FaBoxOpen size={10} className="text-gray-400" />
              {product.quantity} {product.unit}
            </span>
          )}
          {product.location && (
            <span className="flex items-center gap-1 truncate">
              <FaMapMarkerAlt size={10} className="text-gray-400" />
              {product.location}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-1 pt-2 flex items-center justify-between">
          {/* Price */}
          <span className="text-base font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-gray-400 ml-1">/{product.unit}</span>
          </span>

          {/* Seller */}
          <div className="flex items-center gap-1.5">
            {product.sellerAvatar ? (
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold flex items-center justify-center ring-1 ring-green-200">
                {product.sellerName?.charAt(0)?.toUpperCase() || 'F'}
              </div>
            )}
            <span className="text-xs text-gray-500 max-w-[80px] truncate">{product.sellerName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


