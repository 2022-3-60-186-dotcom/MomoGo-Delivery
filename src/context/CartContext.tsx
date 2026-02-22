import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem } from '@/types/menu';
import { apiRequest } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setItems([]);
        return;
      }

      try {
        setLoading(true);
        const cart = await apiRequest('/api/cart');
        // Map cart items from API format to CartItem format
        const cartItems: CartItem[] = cart.items.map((item: any) => ({
          ...item.menuItemId,
          id: item.menuItemId._id,
          quantity: item.quantity,
        }));
        setItems(cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const addItem = async (item: MenuItem) => {
    if (!user) {
      // For non-authenticated users, just update local state
      setItems((prev) => {
        const existingItem = prev.find((i) => (i._id || i.id) === (item._id || item.id));
        if (existingItem) {
          return prev.map((i) =>
            (i._id || i.id) === (item._id || item.id) ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      return;
    }

    try {
      const cart = await apiRequest('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ menuItemId: item._id || item.id, quantity: 1 }),
      });
      
      const cartItems: CartItem[] = cart.items.map((item: any) => ({
        ...item.menuItemId,
        id: item.menuItemId._id,
        quantity: item.quantity,
      }));
      setItems(cartItems);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user) {
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      return;
    }

    try {
      const cart = await apiRequest(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      
      const cartItems: CartItem[] = cart.items.map((item: any) => ({
        ...item.menuItemId,
        id: item.menuItemId._id,
        quantity: item.quantity,
      }));
      setItems(cartItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    if (!user) {
      setItems((prev) =>
        prev.map((i) => ((i._id || i.id) === itemId ? { ...i, quantity } : i))
      );
      return;
    }

    try {
      const cart = await apiRequest(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      
      const cartItems: CartItem[] = cart.items.map((item: any) => ({
        ...item.menuItemId,
        id: item.menuItemId._id,
        quantity: item.quantity,
      }));
      setItems(cartItems);
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      await apiRequest('/api/cart', {
        method: 'DELETE',
      });
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

