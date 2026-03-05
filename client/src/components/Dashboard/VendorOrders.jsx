import React, { useEffect, useState } from "react";
import { getVendorOrders, updateOrderStatus } from "../../api/orderAPI";
import { toast } from "react-toastify";
import { MdRefresh, MdLocalShipping, MdCheckCircle, MdCancel } from "react-icons/md";

const STATUS_STYLE = {
  pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  shipped:   "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
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
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incoming Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage purchases from your marketplace listings.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-colors"
        >
          <MdRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats row */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "pending",   label: "Pending",   color: "amber" },
            { key: "confirmed", label: "Confirmed", color: "blue" },
            { key: "shipped",   label: "Shipped",   color: "purple" },
            { key: "delivered", label: "Delivered", color: "green" },
          ].map(({ key, label, color }) => (
            <div key={key} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{counts[key] || 0}</p>
              <p className={`text-xs font-semibold text-${color}-600 mt-0.5`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
              filter === s
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {s === "all" ? "All Orders" : s} {s !== "all" && counts[s] ? `(${counts[s]})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-500 font-medium">No {filter === "all" ? "" : filter} orders yet.</p>
          <p className="text-gray-400 text-sm mt-1">Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-start gap-4">
                <img
                  src={order.mediaUrl || order.itemId?.mediaUrl || "https://placehold.co/64x64?text=Item"}
                  alt={order.itemName}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                  onError={(e) => { e.target.src = "https://placehold.co/64x64?text=Item"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">{order.itemName}</h3>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${STATUS_STYLE[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-gray-600">
                    <span>Qty: <strong>{order.quantity} kg</strong></span>
                    <span>Total: <strong className="text-green-700">₹{order.totalPrice.toLocaleString("en-IN")}</strong></span>
                    <span>COD</span>
                  </div>
                </div>

                {/* Action button */}
                {NEXT_STATUS[order.status] && (
                  <button
                    onClick={() => handleUpdate(order._id, NEXT_STATUS[order.status])}
                    disabled={updating === order._id}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {order.status === "pending"   && <MdCheckCircle className="w-4 h-4" />}
                    {order.status === "confirmed" && <MdLocalShipping className="w-4 h-4" />}
                    {order.status === "shipped"   && <MdCheckCircle className="w-4 h-4" />}
                    {updating === order._id ? "…" : NEXT_LABEL[order.status]}
                  </button>
                )}
                {order.status === "pending" && (
                  <button
                    onClick={() => handleUpdate(order._id, "cancelled")}
                    disabled={updating === order._id}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl border border-red-200 transition-colors disabled:opacity-50 ml-1"
                  >
                    <MdCancel className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400 flex flex-wrap gap-4">
                <span><strong className="text-gray-600">Buyer:</strong> {order.customerId?.name || "Customer"} — {order.customerId?.email}</span>
                <span><strong className="text-gray-600">Deliver to:</strong> {order.deliveryAddress}</span>
                {order.notes && <span><strong className="text-gray-600">Notes:</strong> {order.notes}</span>}
                <span className="ml-auto">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
