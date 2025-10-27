// Customer authentication and profile types

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  savedAddresses: SavedAddress[];
  savedPaymentMethods: SavedPaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedAddress {
  id: string;
  label: string; // "Home", "Work", "Other"
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'upi';
  label: string; // "Visa ending in 1234", "UPI: example@upi"
  isDefault: boolean;
  // For future Stripe integration
  stripePaymentMethodId?: string;
}

export interface CustomerAuthState {
  customer: CustomerProfile | null;
  isLoading: boolean;
  error: string | null;
}
