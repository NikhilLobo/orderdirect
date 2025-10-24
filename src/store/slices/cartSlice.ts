import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartItem } from '../../types';

interface CartState extends Cart {
  // Additional UI state can be added here
}

const initialState: CartState = {
  restaurantId: '',
  restaurantName: '',
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  taxes: 0,
  total: 0,
};

const calculateTotals = (state: CartState) => {
  const subtotal = state.items.reduce((total, item) => {
    const itemPrice = item.menuItem.price;
    const customizationPrice =
      item.selectedCustomizations?.reduce(
        (sum, custom) =>
          sum + custom.options.reduce((optSum, opt) => optSum + opt.price, 0),
        0
      ) || 0;
    return total + (itemPrice + customizationPrice) * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? 40 : 0; // ₹40 delivery fee
  const taxes = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + taxes;

  state.subtotal = parseFloat(subtotal.toFixed(2));
  state.deliveryFee = deliveryFee;
  state.taxes = parseFloat(taxes.toFixed(2));
  state.total = parseFloat(total.toFixed(2));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.menuItem.id === action.payload.menuItem.id
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      calculateTotals(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.menuItem.id !== action.payload
      );
      calculateTotals(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ menuItemId: string; quantity: number }>
    ) => {
      const { menuItemId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.menuItem.id !== menuItemId
        );
      } else {
        const itemIndex = state.items.findIndex(
          (item) => item.menuItem.id === menuItemId
        );
        if (itemIndex > -1) {
          state.items[itemIndex].quantity = quantity;
        }
      }

      calculateTotals(state);
    },
    setRestaurant: (
      state,
      action: PayloadAction<{ restaurantId: string; restaurantName: string }>
    ) => {
      state.restaurantId = action.payload.restaurantId;
      state.restaurantName = action.payload.restaurantName;
    },
    clearCart: (state) => {
      state.restaurantId = '';
      state.restaurantName = '';
      state.items = [];
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.taxes = 0;
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, setRestaurant, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
