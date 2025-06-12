'use client'; // Context needs to be a client component

import type { Product } from '@/types/app';
import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';

// Define the shape of a cart item
export interface CartItem extends Product {
  quantity: number;
}

// Define the shape of the context value
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getTotalItems: () => number;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// CartProvider component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
      } else {
        // If item doesn't exist, add it to the cart
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
        // If new quantity is 0 or less, remove the item
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
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
