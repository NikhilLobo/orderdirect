import { describe, it, expect } from 'vitest';
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setRestaurant,
} from '../cartSlice';
import type { CartItem, MenuItem } from '../../../types';

describe('cartSlice', () => {
  const initialState = {
    restaurantId: '',
    restaurantName: '',
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    taxes: 0,
    total: 0,
  };

  const mockMenuItem: MenuItem = {
    id: '1',
    restaurantId: 'restaurant1',
    name: 'Test Pizza',
    description: 'Delicious test pizza',
    price: 299,
    category: 'Pizza',
    isVeg: true,
    isAvailable: true,
  };

  const mockCartItem: CartItem = {
    menuItem: mockMenuItem,
    quantity: 2,
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addItem', () => {
    const actual = cartReducer(initialState, addItem(mockCartItem));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].menuItem.id).toBe('1');
    expect(actual.items[0].quantity).toBe(2);
    expect(actual.subtotal).toBe(598); // 299 * 2
  });

  it('should handle addItem for existing item', () => {
    const stateWithItem = cartReducer(initialState, addItem(mockCartItem));
    const actual = cartReducer(stateWithItem, addItem({ ...mockCartItem, quantity: 1 }));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].quantity).toBe(3); // 2 + 1
  });

  it('should handle removeItem', () => {
    const stateWithItem = cartReducer(initialState, addItem(mockCartItem));
    const actual = cartReducer(stateWithItem, removeItem('1'));
    expect(actual.items).toHaveLength(0);
    expect(actual.subtotal).toBe(0);
  });

  it('should handle updateQuantity', () => {
    const stateWithItem = cartReducer(initialState, addItem(mockCartItem));
    const actual = cartReducer(
      stateWithItem,
      updateQuantity({ menuItemId: '1', quantity: 5 })
    );
    expect(actual.items[0].quantity).toBe(5);
    expect(actual.subtotal).toBe(1495); // 299 * 5
  });

  it('should handle updateQuantity with zero (removes item)', () => {
    const stateWithItem = cartReducer(initialState, addItem(mockCartItem));
    const actual = cartReducer(
      stateWithItem,
      updateQuantity({ menuItemId: '1', quantity: 0 })
    );
    expect(actual.items).toHaveLength(0);
  });

  it('should handle setRestaurant', () => {
    const actual = cartReducer(
      initialState,
      setRestaurant({ restaurantId: 'restaurant1', restaurantName: 'Test Restaurant' })
    );
    expect(actual.restaurantId).toBe('restaurant1');
    expect(actual.restaurantName).toBe('Test Restaurant');
  });

  it('should handle clearCart', () => {
    const stateWithItem = cartReducer(initialState, addItem(mockCartItem));
    const actual = cartReducer(stateWithItem, clearCart());
    expect(actual).toEqual(initialState);
  });

  it('should calculate delivery fee and taxes correctly', () => {
    const actual = cartReducer(initialState, addItem(mockCartItem));
    expect(actual.deliveryFee).toBe(40);
    expect(actual.taxes).toBe(29.9); // 5% of 598
    expect(actual.total).toBe(667.9); // 598 + 40 + 29.9
  });

  it('should not charge delivery fee for empty cart', () => {
    const stateWithItem = cartReducer(initialState, addItem(mockCartItem));
    const actual = cartReducer(stateWithItem, clearCart());
    expect(actual.deliveryFee).toBe(0);
  });
});
