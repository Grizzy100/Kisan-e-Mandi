import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, updateOrderStatus } from "../../api/orderAPI";
import { toast } from "react-toastify";
import { 
  MdLocalShipping, MdCheckCircle, MdCancel, 
  MdRefresh, MdHistory, MdShoppingBasket, MdStar, MdTimeline
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import TimelineTooltip from "./TimelineTooltip";
import { formatRelativeTime } from "../../utils/timeUtils";
import OrderModal from "./Item/OrderModal";

const STATUS_STYLE = {
  pending:   "bg-orange-50 text-orange-700 border-orange-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  shipped:   "bg-purple-50 text-purple-700 border-purple-100",
  delivered: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [reorderProduct, setReorderProduct] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = async () => {
    setLoading(true);
    try { setOrders(await getMyOrders()); }
    catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(id);
    try {
      await updateOrderStatus(id, "cancelled");
      toast.success("Order cancelled.");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel.");
    } finally {
      setCancelling(null);
    }
  };

  const handleBuyAgain = (order) => {
    setReorderProduct({
      id: order.itemId?._id || order.itemId,
      name: order.itemName,
      price: order.pricePerUnit || (order.totalPrice / order.quantity),
      unit: order.itemId?.unit || "kg",
      image: order.mediaUrl || order.itemId?.mediaUrl,
      sellerName: order.sellerId?.name || "Farmer",
      location: order.deliveryAddress?.split(',')[0]
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 lg:px-6 space-y-10 font-inter">
      {/* Standardized Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight leading-none">
                Order History
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Support your local farming community.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-sm text-[10px] font-black text-gray-900 shadow-sm transition-all active:scale-95 uppercase tracking-widest"
        >
          <MdRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Orders
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-50 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-sm border border-dashed border-gray-200">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No orders found</h3>
          <p className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest leading-relaxed">Your journey begins with the first harvest.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={order._id} 
                className="group relative bg-white border border-gray-100 rounded-sm shadow-sm flex flex-col transition-all duration-300"
              >
                {/* Horizontal Tooltip triggered on card hover (LG only) */}
                <div className="hidden lg:block">
                    <TimelineTooltip 
                        statusHistory={order.statusHistory} 
                        currentStatus={order.status} 
                        createdAt={order.createdAt}
                    />
                </div>

                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                      <div className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase border ${STATUS_STYLE[order.status]}`}>
                        {order.status}
                      </div>
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-sm border border-gray-100 overflow-hidden shrink-0">
                        <img
                            src={order.mediaUrl || order.itemId?.mediaUrl || "https://placehold.co/100x100?text=Harvest"}
                            alt={order.itemName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate mb-1">
                            {order.itemName}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                            <MdStar className="text-emerald-500" />
                            {order.sellerId?.name || "Local Farmer"}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {formatRelativeTime(order.createdAt)}
                        </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-tight mb-0.5">Quantity</span>
                      <span className="text-xs font-black text-gray-900">{order.quantity} {order.itemId?.unit || "kg"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-tight mb-0.5">Paid</span>
                      <span className="text-xs font-black text-emerald-700 font-mono">₹{order.totalPrice}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    {/* Mobile Track Button */}
                    <button 
                        onClick={() => navigate(`/dashboard/track/${order._id}`)}
                        className="lg:hidden flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-gray-900 text-gray-900 text-[9px] font-black rounded-sm uppercase tracking-widest active:bg-gray-50 transition-colors"
                    >
                        <MdTimeline className="w-3.5 h-3.5" />
                        Track
                    </button>

                    {["pending", "confirmed"].includes(order.status) ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(order._id); }}
                        disabled={cancelling === order._id}
                        className="flex-1 py-2.5 bg-red-600 text-white text-[9px] font-black rounded-sm uppercase tracking-widest active:bg-red-700 transition-colors"
                      >
                        {cancelling === order._id ? "..." : "Cancel"}
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleBuyAgain(order); }}
                        className="flex-1 py-2.5 bg-emerald-600 text-white text-[9px] font-black rounded-sm uppercase tracking-widest active:bg-emerald-700 transition-colors"
                      >
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {reorderProduct && (
        <OrderModal
          product={reorderProduct}
          userRole={user?.role}
          onClose={() => setReorderProduct(null)}
          onSuccess={() => {
            setReorderProduct(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
