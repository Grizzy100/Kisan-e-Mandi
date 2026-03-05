import React, { useState } from "react";
import { FaTimes, FaMotorcycle } from "react-icons/fa";
import { MdLocationOn, MdStickyNote2 } from "react-icons/md";
import { toast } from "react-toastify";
import { placeOrder } from "../../../api/orderAPI";

export default function OrderModal({ product, onClose, onSuccess, userRole }) {
  if (userRole && userRole !== "customer") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col items-center justify-center p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Order Not Allowed</h2>
          <p className="text-gray-600 text-sm mb-4 text-center">Only customers can place orders. Vendors and admins cannot purchase items.</p>
          <button onClick={onClose} className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-xl transition-colors">Close</button>
        </div>
      </div>
    );
  }

  const [quantity, setQuantity]   = useState(1);
  const [address, setAddress]     = useState("");
  const [notes, setNotes]         = useState("");
  const [loading, setLoading]     = useState(false);

  const total = (product.price * quantity).toLocaleString("en-IN");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter a delivery address.");
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
      toast.success("Order placed! Vendor has been notified. 🎉");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Place Order</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FaTimes size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Item preview */}
        <div className="flex items-center gap-4 px-6 py-4 bg-green-50/50 border-b border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
            onError={(e) => { e.target.src = "https://placehold.co/64x64?text=No+Photo"; }}
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{product.name}</p>
            {product.ticketCategory && (
              <p className="text-xs text-emerald-700 font-medium">{product.ticketCategory}</p>
            )}
            <p className="text-green-700 font-bold text-lg">₹{product.price.toLocaleString("en-IN")} / {product.unit || "kg"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quantity ({product.unit || "kg"})
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold text-lg transition-colors flex items-center justify-center"
              >−</button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center border border-gray-200 rounded-xl py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold text-lg transition-colors flex items-center justify-center"
              >+</button>
              <span className="ml-auto text-sm text-gray-500">
                Total: <strong className="text-green-700 text-base">₹{total}</strong>
              </span>
            </div>
          </div>

          {/* Delivery address */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <MdLocationOn className="text-emerald-600" /> Delivery Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no., street, city, state, PIN"
              required
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <MdStickyNote2 className="text-emerald-600" /> Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any instructions for the vendor…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Payment note */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
            <FaMotorcycle className="flex-shrink-0" />
            <span>Payment: <strong>Cash on Delivery (COD)</strong> — pay when you receive.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Placing Order…" : `Place Order — ₹${total}`}
          </button>
        </form>
      </div>
    </div>
  );
}
