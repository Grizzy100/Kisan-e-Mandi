import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MdChevronLeft, MdLocalShipping, MdCheckCircle, 
  MdHistory, MdPlace, MdAccessTime 
} from "react-icons/md";
import { getMyOrders } from "../../api/orderAPI";

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await getMyOrders();
        const found = orders.find(o => o._id === orderId);
        setOrder(found);
      } catch (err) {
        console.error("Failed to fetch order for tracking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Locating Shipment...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Order Not Found</h3>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest"
        >
          Go Back
        </button>
      </div>
    );
  }

  const STEPS = [
    { id: 'pending', label: 'Order Placed', desc: 'We have received your order' },
    { id: 'confirmed', label: 'Confirmed', desc: 'The farmer has accepted your request' },
    { id: 'shipped', label: 'Out for Delivery', desc: 'Your fresh harvest is on the way' },
    { id: 'delivered', label: 'Delivered', desc: 'Order completed successfully' },
  ];

  const currentIdx = STEPS.findIndex(s => s.id === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-white font-inter pb-20">
      {/* Mobile Top Nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <MdChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">Track Order</h1>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Order Info Card */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-50 rounded-sm border border-gray-100 overflow-hidden shrink-0">
            <img 
              src={order.mediaUrl || order.itemId?.mediaUrl || "https://placehold.co/100x100?text=Harvest"} 
              alt={order.itemName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none mb-1">
              {order.itemName}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mt-2 bg-emerald-50 inline-block px-2 py-0.5 rounded-sm border border-emerald-100">
              ₹{order.totalPrice} • {order.quantity} {order.itemId?.unit || "kg"}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0 relative">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-100" />
          
          {isCancelled ? (
            <div className="relative pl-10">
               <div className="absolute left-0 w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center border-2 border-white shadow-sm z-10">
                  <MdCancel className="w-4 h-4 text-white" />
               </div>
               <div>
                  <h3 className="text-xs font-black text-red-600 uppercase tracking-widest">Order Cancelled</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">This order was revoked.</p>
               </div>
            </div>
          ) : (
            STEPS.map((step, idx) => {
              const completed = idx <= currentIdx;
              const history = order.statusHistory?.find(h => h.to === step.id);

              return (
                <div key={step.id} className="relative pl-10 pb-10 last:pb-0">
                  <div 
                    className={`absolute left-0 w-6 h-6 rounded-sm flex items-center justify-center border-2 border-white shadow-sm z-10 transition-colors duration-500 ${
                      completed ? 'bg-emerald-600' : 'bg-white'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-sm ${completed ? 'bg-white' : 'bg-gray-200'}`} />
                  </div>
                  
                  {/* Vertical Progress Overfill */}
                  {idx < currentIdx && (
                    <div className="absolute left-[11px] top-6 h-10 w-0.5 bg-emerald-600 z-0" />
                  )}

                  <div>
                    <h3 className={`text-xs font-black uppercase tracking-widest ${completed ? 'text-gray-900' : 'text-gray-300'}`}>
                      {step.label}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                    {(history || (step.id === 'pending' && order.createdAt)) && (
                      <div className="flex items-center gap-2 mt-2">
                        <MdAccessTime className="w-3 h-3 text-gray-300" />
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                          {new Date(history?.changedAt || order.createdAt).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Shipping Address */}
        <div className="pt-6 border-t border-gray-100">
           <div className="flex items-center gap-2 mb-4">
              <MdPlace className="w-4 h-4 text-gray-400" />
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Delivery Address</h3>
           </div>
           <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
              {order.deliveryAddress || "Address details not available"}
           </p>
        </div>
      </div>
    </div>
  );
}
