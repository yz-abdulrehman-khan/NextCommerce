'use client';

import type { Product } from '@/types/app';
import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from 'react';

const LOCAL_STORAGE_CART_KEY = 'eCommerceAppCart';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getTotalItems: () => number;
  isCartLoaded: boolean; // To indicate if cart has been loaded from storage
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false); // New state

  // Effect to load cart from Local Storage on initial mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        // Basic validation: check if it's an array
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.warn('Invalid cart data found in local storage. Initializing with empty cart.');
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from local storage:', error);
      // Initialize with empty cart in case of error (e.g. JSON parsing error)
      setCartItems([]);
    }
    setIsCartLoaded(true); // Mark cart as loaded
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save cart to Local Storage whenever cartItems change
  useEffect(() => {
    // Only save to localStorage if the cart has been loaded to prevent overwriting
    // the stored cart with an empty initial state before hydration.
    if (isCartLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to local storage:', error);
      }
    }
  }, [cartItems, isCartLoaded]); // Run whenever cartItems or isCartLoaded changes

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        setCartItems(prevItems => prevItems.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
      }
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price.amount * item.quantity, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSubtotal,
    getTotalItems,
    isCartLoaded,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
