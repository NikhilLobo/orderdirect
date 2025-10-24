import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

// Load cart state from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return undefined;
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return undefined;
  }
};

// Save cart state to localStorage
const saveCartToStorage = (state: RootState) => {
  try {
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem('cart', serializedCart);
  } catch (err) {
    // Ignore write errors
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState: {
    cart: loadCartFromStorage(),
  },
});

// Subscribe to store changes to save cart to localStorage
store.subscribe(() => {
  saveCartToStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks for use throughout the app
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
