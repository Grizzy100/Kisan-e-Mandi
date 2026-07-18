import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';

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


  //main job is to sync React and local browser for the cart items being updated, removed, added
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      
      if (existing) {
        if (existing.cartQuantity >= product.quantity) {
          toast.error(`Only ${product.quantity} ${product.unit} available in stock!`, { toastId: `max-${product.id}` });
          return prevItems;
        }

        toast.info(`Increased quantity of ${product.name}`, { toastId: `inc-${product.id}` });
        
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      } else {
        if (product.quantity < product.minOrderQuantity) {
          toast.error(`Not enough stock to meet minimum order of ${product.minOrderQuantity}!`);
          return prevItems;
        }
        toast.success(`${product.name} added to basket`, { toastId: `add-${product.id}` });
        return [...prevItems, { ...product, cartQuantity: product.minOrderQuantity }];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === productId) {
        if (newQuantity < 1) return item; // Ignore 0 or negatives, user must delete

        const minQ = item.minOrderQuantity || 1;
        
        if (newQuantity < minQ) {
          toast.warning(`Minimum order is ${minQ} ${item.unit}`, { toastId: `min-${item.id}` });
          return { ...item, cartQuantity: minQ };
        }
        
        if (newQuantity > item.quantity) {
          toast.error(`Only ${item.quantity} ${item.unit} available in stock!`, { toastId: `max-${item.id}` });
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
