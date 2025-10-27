import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MenuItem } from '../services/menuService';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; restaurantId: string; restaurantName: string } }
  | { type: 'REMOVE_ITEM'; payload: { menuItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'UPDATE_INSTRUCTIONS'; payload: { menuItemId: string; instructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CART_STORAGE_KEY = 'orderdirect_cart';

const initialState: CartState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, restaurantId, restaurantName } = action.payload;

      // If adding from a different restaurant, clear cart
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          restaurantId,
          restaurantName,
          items: [{ menuItem, quantity: 1 }],
        };
      }

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingItemIndex >= 0) {
        // Increment quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };

        return {
          ...state,
          items: updatedItems,
        };
      }

      // Add new item
      return {
        restaurantId,
        restaurantName,
        items: [...state.items, { menuItem, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        (item) => item.menuItem.id !== action.payload.menuItemId
      );

      return {
        ...state,
        items: updatedItems,
        // Clear restaurant if no items left
        restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
        restaurantName: updatedItems.length === 0 ? null : state.restaurantName,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { menuItemId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { menuItemId } });
      }

      const updatedItems = state.items.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'UPDATE_INSTRUCTIONS': {
      const { menuItemId, instructions } = action.payload;

      const updatedItems = state.items.map((item) =>
        item.menuItem.id === menuItemId
          ? { ...item, specialInstructions: instructions }
          : item
      );

      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
};

interface CartContextValue {
  cart: CartState;
  addItem: (menuItem: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateInstructions: (menuItemId: string, instructions: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTaxes: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = (menuItem: MenuItem, restaurantId: string, restaurantName: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, restaurantId, restaurantName } });
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { menuItemId } });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } });
  };

  const updateInstructions = (menuItemId: string, instructions: string) => {
    dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { menuItemId, instructions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  };

  const getTaxes = () => {
    // 5% tax
    return getSubtotal() * 0.05;
  };

  const getDeliveryFee = () => {
    // Fixed delivery fee of $5
    return cart.items.length > 0 ? 5 : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getTaxes() + getDeliveryFee();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
        getItemCount,
        getSubtotal,
        getTaxes,
        getDeliveryFee,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
