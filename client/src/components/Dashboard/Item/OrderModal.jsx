import React, { useState } from "react";
import { FaTimes, FaMotorcycle } from "react-icons/fa";
import { MdLocationOn, MdStickyNote2, MdShoppingBasket, MdVerified, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { placeOrder } from "../../../api/orderAPI";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderModal({ product, onClose, onSuccess, userRole }) {
  const [quantity, setQuantity]   = useState(1);
  const [address, setAddress]     = useState("");
  const [notes, setNotes]         = useState("");
  const [loading, setLoading]     = useState(false);

  const total = (product.price * quantity);

  if (userRole && userRole !== "customer") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden flex flex-col items-center justify-center p-12 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-sm flex items-center justify-center mb-6">
              <MdClose className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tighter">Access Restricted</h2>
          <p className="text-gray-400 text-sm mb-8 font-medium">Only customer accounts can initiate purchases. Please switch roles to place an order.</p>
          <button 
            onClick={onClose} 
            className="w-full bg-gray-900 text-white font-black py-4 rounded-sm transition-all active:scale-95 uppercase tracking-widest text-[11px]"
          >
            I Understand
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter a valid delivery address.");
      return;
    }
    setLoading(true);
    try {
      await placeOrder({
        itemId: product.id,
        quantity,
        deliveryAddress: address.trim(),
        notes: notes.trim(),
      });
      toast.success("Order placed successfully! 🎉");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white rounded-sm shadow-xl w-full max-w-[440px] overflow-hidden border border-gray-100 my-auto max-h-[95vh] flex flex-col"
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-7 sm:py-4 border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-sm flex items-center justify-center border border-emerald-100">
                  <MdShoppingBasket className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                  <h2 className="text-[10px] sm:text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Secure Checkout</h2>
                  <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MdVerified className="text-blue-500 w-3 h-3" /> Encrypted
                  </p>
              </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 rounded-sm bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90">
            <FaTimes size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-3.5 sm:px-7 sm:py-5 space-y-2.5 sm:space-y-4 overflow-y-auto no-scrollbar">
          {/* Product Preview — More Compact */}
          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-gray-50/50 rounded-sm border border-gray-100/50">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-sm overflow-hidden shadow-sm border border-white shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Harvest"; }}
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[8px] sm:text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-0.5">
                    {product.ticketCategory || product.cropType || "Premium Harvest"}
                </p>
                <h3 className="text-sm sm:text-base font-black text-gray-900 truncate leading-tight mb-1">{product.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black text-gray-900 tracking-tighter">₹{product.price.toLocaleString("en-IN")}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">/ {product.unit || "unit"}</span>
                </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4">
              {/* Quantity Selection */}
              <div className="space-y-1.5 sm:space-y-3">
                <label className="block text-[7px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Volume</label>
                <div className="flex items-center justify-between p-1 bg-gray-50 rounded-sm border border-gray-100">
                    <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-sm bg-white text-gray-900 shadow-sm border border-gray-100 font-black text-[10px] sm:text-xs hover:text-emerald-600 transition-all active:scale-90 flex items-center justify-center"
                    >−</button>
                    <div className="flex flex-col items-center">
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className="w-10 sm:w-14 bg-transparent text-center font-black text-xs sm:text-base focus:outline-none"
                        />
                        <span className="text-[7px] sm:text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">{product.unit || "kg"}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-sm bg-white text-gray-900 shadow-sm border border-gray-100 font-black text-[10px] sm:text-xs hover:text-emerald-600 transition-all active:scale-90 flex items-center justify-center"
                    >+</button>
                </div>
              </div>

              {/* Summary */}
               <div className="space-y-1.5 sm:space-y-3">
                <label className="block text-[7px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimate Total</label>
                <div className="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-emerald-500/5 rounded-sm border border-emerald-100/50 flex flex-col justify-center min-h-[36px] sm:min-h-[48px]">
                    <span className="text-[7px] sm:text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-0.5 leading-none">Total</span>
                    <span className="text-base sm:text-2xl font-black text-emerald-700 tracking-tighter leading-none">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
          </div>

          {/* Fields */}
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 text-left">
                <label className="flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <MdLocationOn className="text-emerald-500 w-3.5 h-3.5" /> Ship to Destination
                </label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provide detailed address..."
                    required
                    rows={2}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-sm px-4 py-2 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300 resize-none leading-relaxed"
                />
            </div>

            <div className="space-y-1.5 text-left">
                <label className="flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <MdStickyNote2 className="text-emerald-500 w-3.5 h-3.5" /> Delivery Notes
                </label>
                <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific instructions (optional)..."
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-sm px-4 py-2 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-gray-300"
                />
            </div>
          </div>

          {/* Payment Condition */}
          <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-sm text-white shadow-xl">
             <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 rounded-sm flex items-center justify-center shrink-0">
                <FaMotorcycle className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5 shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
             </div>
             <div className="text-left">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Payment Strategy</p>
                <p className="text-[10px] font-bold">Pay via <span className="text-emerald-400 uppercase tracking-widest">Cash on Delivery</span></p>
             </div>
          </div>

          {/* Action Button */}
          <div className="pt-1.5 sm:pt-3 shrink-0 pb-2">
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white font-black py-4 sm:py-4.5 rounded-sm shadow-xl transition-all duration-300 disabled:opacity-50 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] sm:text-[11px]"
            >
                {loading ? "Transacting..." : `Confirm Purchase — ₹${total.toLocaleString("en-IN")}`}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
