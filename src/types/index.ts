// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  label: string; // Home, Work, etc.
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault: boolean;
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  totalRatings: number;
  cuisines: string[];
  deliveryTime: string;
  costForTwo: number;
  isOpen: boolean;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  createdAt: Date;
}

// Menu types
export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  isRequired: boolean;
  maxSelection: number; // 0 means unlimited
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

// Cart types
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations?: SelectedCustomization[];
  specialInstructions?: string;
}

export interface SelectedCustomization {
  customizationId: string;
  customizationName: string;
  options: CustomizationOption[];
}

export interface Cart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
}

// Order types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  deliveryAddress: Address;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
}
