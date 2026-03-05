import React, { useEffect, useState } from "react";
import { getMyOrders, updateOrderStatus } from "../../api/orderAPI";
import { toast } from "react-toastify";
import { MdLocalShipping, MdCheckCircle, MdCancel, MdHourglassTop, MdRefresh } from "react-icons/md";

const STATUS_STYLE = {
  pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  shipped:   "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
};

const STATUS_ICON = {
  pending:   <MdHourglassTop className="w-4 h-4" />,
  confirmed: <MdCheckCircle className="w-4 h-4" />,
  shipped:   <MdLocalShipping className="w-4 h-4" />,
  delivered: <MdCheckCircle className="w-4 h-4" />,
  cancelled: <MdCancel className="w-4 h-4" />,
};

const STEPS = ["pending", "confirmed", "shipped", "delivered"];

function OrderProgressBar({ status }) {
  const idx = STEPS.indexOf(status);
  if (status === "cancelled") return (
    <p className="text-xs text-red-500 font-medium mt-1">Order cancelled</p>
  );
  return (
    <div className="flex items-center gap-1 mt-2">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i <= idx ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
          {i < STEPS.length - 1 && (
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i < idx ? "bg-emerald-500" : "bg-gray-300"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function CustomerOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

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

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track your purchases from the marketplace.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-colors"
        >
          <MdRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-gray-500 font-medium">No orders yet.</p>
          <p className="text-gray-400 text-sm mt-1">Browse the marketplace and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
              <div className="flex items-start gap-4">
                <img
                  src={order.mediaUrl || order.itemId?.mediaUrl || "https://placehold.co/64x64?text=Item"}
                  alt={order.itemName}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                  onError={(e) => { e.target.src = "https://placehold.co/64x64?text=Item"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">{order.itemName}</h3>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_STYLE[order.status]}`}>
                      {STATUS_ICON[order.status]} {order.status}
                    </span>
                  </div>
                  {order.ticketCategory && (
                    <p className="text-xs text-emerald-700 font-medium">{order.ticketCategory}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                    <span>Qty: <strong>{order.quantity} {order.itemId?.unit || "kg"}</strong></span>
                    <span>Total: <strong className="text-green-700">₹{order.totalPrice.toLocaleString("en-IN")}</strong></span>
                    <span>COD</span>
                  </div>
                  <OrderProgressBar status={order.status} />
                </div>
              </div>

              <div className="text-xs text-gray-400 border-t border-gray-50 pt-3 flex flex-wrap gap-4 justify-between">
                <div>
                  <span className="font-medium text-gray-600">Vendor: </span>
                  {order.sellerId?.name || "Farmer"}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Deliver to: </span>
                  {order.deliveryAddress}
                </div>
                <div>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>

              {order.status === "pending" && (
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancelling === order._id}
                  className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
                >
                  {cancelling === order._id ? "Cancelling…" : "Cancel Order"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
