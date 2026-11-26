import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { trackAddToCart } from '../utils/analytics';

const notify = (type, msg, opts) =>
  import('react-toastify').then(({ toast }) => toast[type](msg, opts));

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  //Lazy initialization
  //const [cartItems, setCartItems] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];     //if first time for the user, empty [] is initialized, else previous cart is loaded.
    } 
    catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;


  //main job is to sync React and local browser for the cart items being updated, removed, added
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    const currentItems = cartItemsRef.current;
    const existing = currentItems.find(item => item.id === product.id);

    if (existing) {
      if (existing.cartQuantity >= product.quantity) {
        notify('error', `Only ${product.quantity} ${product.unit} available in stock!`, { toastId: `max-${product.id}` });
        return;
      }

      const nextItems = currentItems.map(item =>
        item.id === product.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
      cartItemsRef.current = nextItems;
      setCartItems(nextItems);
      notify('info', `Increased quantity of ${product.name}`, { toastId: `inc-${product.id}` });
      trackAddToCart(product, 1);
    } else {
      const minQty = product.minOrderQuantity || 1;
      if (product.quantity < minQty) {
        notify('error', `Not enough stock to meet minimum order of ${product.minOrderQuantity}!`);
        return;
      }

      const nextItems = [...currentItems, { ...product, cartQuantity: minQty }];
      cartItemsRef.current = nextItems;
      setCartItems(nextItems);
      notify('success', `${product.name} added to basket`, { toastId: `add-${product.id}` });
      trackAddToCart(product, minQty);
    }
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === productId) {
        if (newQuantity < 1) return item; // Ignore 0 or negatives, user must delete

        const minQ = item.minOrderQuantity || 1;
        
        if (newQuantity < minQ) {
          notify('warning', `Minimum order is ${minQ} ${item.unit}`, { toastId: `min-${item.id}` });
          return { ...item, cartQuantity: minQ };
        }
        
        if (newQuantity > item.quantity) {
          notify('error', `Only ${item.quantity} ${item.unit} available in stock!`, { toastId: `max-${item.id}` });
          return { ...item, cartQuantity: item.quantity };
        }
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    }));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.cartQuantity, 0);
  }, [cartItems]);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);



  //We use useCallback to cache the individual functions, 
  // and useMemo to cache the overall wrapper object 
  // so that a new object memory reference doesn't trigger re-renders in our components."
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    itemCount,
    isCartOpen,
    toggleCart,
    openCart,
    closeCart
  }), [
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    itemCount,
    isCartOpen,
    toggleCart,
    openCart,
    closeCart
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
