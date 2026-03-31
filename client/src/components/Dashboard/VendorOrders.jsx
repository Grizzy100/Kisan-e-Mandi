import React, { useEffect, useState } from "react";
import { getVendorOrders, updateOrderStatus } from "../../api/orderAPI";
import { toast } from "react-toastify";
import { MdRefresh, MdCheckCircle, MdCancel, MdAccessTime } from "react-icons/md";
import TimelineTooltip from "./TimelineTooltip";
import { formatRelativeTime } from "../../utils/timeUtils";

const STATUS_STYLE = {
  pending:   "bg-orange-50 text-orange-700 border-orange-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  shipped:   "bg-purple-50 text-purple-700 border-purple-100",
  delivered: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

const NEXT_STATUS = {
  pending:   "confirmed",
  confirmed: "shipped",
  shipped:   "delivered",
};

const NEXT_LABEL = {
  pending:   "Confirm Order",
  confirmed: "Mark Shipped",
  shipped:   "Mark Delivered",
};

export default function VendorOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter]     = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try { setOrders(await getVendorOrders()); }
    catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order marked as ${status} ✅`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 font-inter">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
            Incoming Orders
          </h1>
          <p className="text-gray-500 text-sm">Manage purchases from your marketplace listings</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-sm text-xs text-gray-600 font-bold shadow-sm transition-all"
        >
          <MdRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: "pending",   label: "Pending",   color: "orange" },
          { key: "confirmed", label: "Confirmed", color: "blue" },
          { key: "shipped",   label: "Shipped",   color: "purple" },
          { key: "delivered", label: "Delivered", color: "green" },
        ].map(({ key, label, color }) => (
          <div key={key} className="bg-white rounded-sm p-4 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{counts[key] || 0}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest text-${color}-600 mt-1`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Unified Filter Tabs */}
      <div className="w-full overflow-hidden mb-8">
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex p-1 bg-gray-100/50 backdrop-blur-md rounded-sm border border-gray-200/50 shadow-inner flex-nowrap whitespace-nowrap min-w-max">
          {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex items-center gap-2 px-5 py-2 rounded-sm text-[10px] font-black transition-all duration-300 ${filter === s
                ? "bg-white text-emerald-700 shadow-sm border border-gray-100"
                : "text-gray-400"
                }`}
            >
              {s === "all" ? "ALL" : s.toUpperCase()} 
              {s !== "all" && counts[s] > 0 && (
                <span className={`ml-1 text-[8px] px-1.5 py-0.5 rounded-sm ${filter === s ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                  {counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-50 rounded-sm animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-sm flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
          <h3 className="text-gray-900 font-bold">No orders found</h3>
          <p className="text-gray-500 text-xs mt-1">Orders in the "{filter}" category will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order._id} className="group relative bg-white border border-gray-100 rounded-sm shadow-sm transition-all p-3">
              
              <TimelineTooltip 
                statusHistory={order.statusHistory} 
                currentStatus={order.status} 
                createdAt={order.createdAt}
              />

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* LEFT: Image */}
                <div className="shrink-0 relative">
                  <img
                    src={order.mediaUrl || order.itemId?.mediaUrl || "https://placehold.co/80x80?text=Item"}
                    alt={order.itemName}
                    className="w-full sm:w-20 h-20 rounded-sm object-cover border border-gray-100 shadow-sm"
                    onError={(e) => { e.target.src = "https://placehold.co/80x80?text=Item"; }}
                  />
                  <div className="absolute -bottom-1 -left-1 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-sm px-1.5 py-0.5 shadow-sm flex items-center gap-0.5 text-[8px] font-black text-gray-400 whitespace-nowrap z-10 uppercase">
                    <MdAccessTime className="w-2.5 h-2.5 text-emerald-500" />
                    {formatRelativeTime(order.updatedAt)}
                  </div>
                </div>

                {/* CENTER: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{order.itemName}</h3>
                      <span className="text-[8px] font-black text-gray-300 shrink-0">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className={`shrink-0 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase shadow-sm border ${STATUS_STYLE[order.status]} flex items-center gap-1`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/50 p-2.5 rounded-sm border border-gray-100/50">
                    <div className="flex flex-col">
                      <span className="text-gray-300 text-[8px] uppercase font-black tracking-widest">Qty</span>
                      <span className="text-gray-700 text-xs font-black">{order.quantity} {order.itemId?.unit || "kg"}</span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 pl-3">
                      <span className="text-gray-300 text-[8px] uppercase font-black tracking-widest">Total</span>
                      <span className="text-emerald-700 text-xs font-black">₹{order.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 pt-1.5 sm:border-none sm:pt-0 sm:border-l sm:pl-3">
                       <span className="text-gray-300 text-[8px] uppercase font-black tracking-widest">Customer</span>
                       <span className="text-gray-700 text-[10px] font-bold truncate">{order.customerId?.name || "Customer"}</span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 pl-3 pt-1.5 border-t sm:border-t-0 sm:pt-0">
                       <span className="text-gray-300 text-[8px] uppercase font-black tracking-widest">Date</span>
                       <span className="text-gray-700 text-[10px] font-black uppercase">
                         {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                       </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="w-full sm:w-auto flex flex-col gap-1.5 min-w-[140px]">
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleUpdate(order._id, NEXT_STATUS[order.status])}
                      disabled={updating === order._id}
                      className="w-full py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm disabled:opacity-50"
                    >
                      {updating === order._id ? "..." : NEXT_LABEL[order.status]}
                    </button>
                  )}
                  {["pending", "confirmed"].includes(order.status) && (
                    <button
                      onClick={() => handleUpdate(order._id, "cancelled")}
                      disabled={updating === order._id}
                      className="w-full py-2 bg-white text-red-500 text-[9px] font-black uppercase tracking-widest rounded-sm border border-red-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
