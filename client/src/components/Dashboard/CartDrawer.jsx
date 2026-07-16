import React, { useState } from 'react';
import { MdClose, MdShoppingBasket, MdDeleteOutline, MdCheckCircle, MdAdd, MdRemove } from 'react-icons/md';
import { useCart } from '../../context/CartContext';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

export const CartDrawer = () => {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create an order for each item in the cart
      const orderPromises = cartItems.map(item => 
        axiosInstance.post('/orders', {
          itemId: item.id,
          sellerId: item.sellerId,
          quantity: item.cartQuantity,
          deliveryAddress: address,
          notes: ''
        })
      );
      
      await Promise.all(orderPromises);
      
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
      const msg = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClose = () => {
    setOrderPlaced(false);
    setAddress('');
    closeCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col font-inter animate-slide-in-right border-l border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-sm text-emerald-600">
              <MdShoppingBasket className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Your Basket</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {orderPlaced ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <MdCheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Order Placed!</h3>
              <p className="text-sm text-gray-500 font-medium">
                Your orders have been successfully sent to the farmers. They will confirm shortly.
              </p>
              <button 
                onClick={handleClose}
                className="mt-6 px-6 py-3 bg-gray-900 text-white text-sm font-bold tracking-widest uppercase rounded-sm hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 text-gray-400">
              <MdShoppingBasket className="w-16 h-16 opacity-20" />
              <p className="text-sm font-medium">Your basket is empty</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-sm shadow-sm">
                    <img 
                      src={item.image || "https://placehold.co/100"} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-sm border border-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.unit}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <MdDeleteOutline className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-sm px-1 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                            disabled={item.cartQuantity <= (item.minOrderQuantity || 1)}
                            className={`p-1 rounded-sm transition-colors ${
                              item.cartQuantity <= (item.minOrderQuantity || 1)
                                ? "text-gray-300 cursor-not-allowed" 
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                            }`}
                          >
                            <MdRemove className="w-3.5 h-3.5" />
                          </button>
                          
                          <input 
                            type="number" 
                            min="1"
                            max={item.quantity}
                            value={item.cartQuantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) {
                                updateQuantity(item.id, val);
                              }
                            }}
                            className="w-12 text-xs font-black text-gray-900 text-center bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0 hide-number-spinners"
                            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                          />

                          <button 
                            onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                            className="p-1 rounded-sm text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                          >
                            <MdAdd className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-black text-emerald-600 text-sm">
                          ₹{(item.price * item.cartQuantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Delivery Address
                </label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full delivery address..."
                  className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-24"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {!orderPlaced && cartItems.length > 0 && (
          <div className="p-6 bg-gray-50/80 border-t border-gray-100 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between font-black text-gray-900">
              <span className="text-sm tracking-tight uppercase">Total Amount</span>
              <span className="text-2xl text-emerald-600 tracking-tighter">₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full py-4 text-white text-xs font-black tracking-widest uppercase rounded-sm transition-all shadow-sm flex items-center justify-center gap-2
                ${isCheckingOut 
                  ? 'bg-emerald-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/25 hover:shadow-lg'
                }`}
            >
              {isCheckingOut ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Place Order Now'
              )}
            </button>
          </div>
        )}

      </div>
    </>
  );
};
