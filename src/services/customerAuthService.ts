import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type {
  CustomerProfile,
  SavedAddress,
  SavedPaymentMethod,
} from "../types/customer";

/**
 * Sign up a new customer
 */
export const signUpCustomer = async (
  email: string,
  password: string,
  name: string,
  phone: string
): Promise<CustomerProfile> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create customer profile in Firestore
    const customerProfile: Omit<CustomerProfile, "id"> = {
      email: user.email!,
      name,
      phone,
      savedAddresses: [],
      savedPaymentMethods: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "customers", user.uid), {
      ...customerProfile,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: user.uid,
      ...customerProfile,
    };
  } catch (error: any) {
    console.error("Error signing up customer:", error);

    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use. Please login instead.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }

    throw new Error("Failed to create account. Please try again.");
  }
};

/**
 * Sign in an existing customer
 */
export const signInCustomer = async (
  email: string,
  password: string
): Promise<CustomerProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Fetch customer profile
    const customerDoc = await getDoc(doc(db, "customers", user.uid));

    if (!customerDoc.exists()) {
      throw new Error("Customer profile not found");
    }

    const data = customerDoc.data();
    return {
      id: user.uid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      savedAddresses: data.savedAddresses || [],
      savedPaymentMethods: data.savedPaymentMethods || [],
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error: any) {
    console.error("Error signing in customer:", error);

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      throw new Error("Invalid email or password.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }

    throw new Error("Failed to sign in. Please try again.");
  }
};

/**
 * Sign out current customer
 */
export const signOutCustomer = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out");
  }
};

/**
 * Get current customer profile
 */
export const getCurrentCustomer = async (
  user: FirebaseUser
): Promise<CustomerProfile | null> => {
  try {
    const customerDoc = await getDoc(doc(db, "customers", user.uid));

    if (!customerDoc.exists()) {
      return null;
    }

    const data = customerDoc.data();
    return {
      id: user.uid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      savedAddresses: data.savedAddresses || [],
      savedPaymentMethods: data.savedPaymentMethods || [],
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return null;
  }
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (
  callback: (customer: CustomerProfile | null) => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const customer = await getCurrentCustomer(user);
      callback(customer);
    } else {
      callback(null);
    }
  });
};

/**
 * Update customer profile
 */
export const updateCustomerProfile = async (
  customerId: string,
  updates: Partial<Pick<CustomerProfile, "name" | "phone">>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "customers", customerId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    throw new Error("Failed to update profile");
  }
};

/**
 * Add a saved address
 */
export const addSavedAddress = async (
  customerId: string,
  address: Omit<SavedAddress, "id">
): Promise<void> => {
  try {
    const customerRef = doc(db, "customers", customerId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      throw new Error("Customer not found");
    }

    const currentAddresses: SavedAddress[] =
      customerDoc.data().savedAddresses || [];

    // If this is the first address or marked as default, make it default
    const isDefault = address.isDefault || currentAddresses.length === 0;

    // If setting as default, unset other defaults
    const updatedAddresses = isDefault
      ? currentAddresses.map((addr) => ({ ...addr, isDefault: false }))
      : currentAddresses;

    const newAddress: SavedAddress = {
      ...address,
      id: `addr_${Date.now()}`,
      isDefault,
    };

    await updateDoc(customerRef, {
      savedAddresses: [...updatedAddresses, newAddress],
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding saved address:", error);
    throw new Error("Failed to add address");
  }
};

/**
 * Update a saved address
 */
export const updateSavedAddress = async (
  customerId: string,
  addressId: string,
  updates: Partial<Omit<SavedAddress, "id">>
): Promise<void> => {
  try {
    const customerRef = doc(db, "customers", customerId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      throw new Error("Customer not found");
    }

    const currentAddresses: SavedAddress[] =
      customerDoc.data().savedAddresses || [];

    const updatedAddresses = currentAddresses.map((addr) => {
      if (addr.id === addressId) {
        return { ...addr, ...updates };
      }
      // If setting this address as default, unset others
      if (updates.isDefault && addr.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    await updateDoc(customerRef, {
      savedAddresses: updatedAddresses,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating saved address:", error);
    throw new Error("Failed to update address");
  }
};

/**
 * Delete a saved address
 */
export const deleteSavedAddress = async (
  customerId: string,
  addressId: string
): Promise<void> => {
  try {
    const customerRef = doc(db, "customers", customerId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      throw new Error("Customer not found");
    }

    const currentAddresses: SavedAddress[] =
      customerDoc.data().savedAddresses || [];
    const updatedAddresses = currentAddresses.filter(
      (addr) => addr.id !== addressId
    );

    await updateDoc(customerRef, {
      savedAddresses: updatedAddresses,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting saved address:", error);
    throw new Error("Failed to delete address");
  }
};

/**
 * Add a saved payment method
 */
export const addSavedPaymentMethod = async (
  customerId: string,
  paymentMethod: Omit<SavedPaymentMethod, "id">
): Promise<void> => {
  try {
    const customerRef = doc(db, "customers", customerId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      throw new Error("Customer not found");
    }

    const currentMethods: SavedPaymentMethod[] =
      customerDoc.data().savedPaymentMethods || [];

    // If this is the first payment method or marked as default, make it default
    const isDefault = paymentMethod.isDefault || currentMethods.length === 0;

    // If setting as default, unset other defaults
    const updatedMethods = isDefault
      ? currentMethods.map((method) => ({ ...method, isDefault: false }))
      : currentMethods;

    const newPaymentMethod: SavedPaymentMethod = {
      ...paymentMethod,
      id: `pm_${Date.now()}`,
      isDefault,
    };

    await updateDoc(customerRef, {
      savedPaymentMethods: [...updatedMethods, newPaymentMethod],
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding payment method:", error);
    throw new Error("Failed to add payment method");
  }
};

/**
 * Delete a saved payment method
 */
export const deleteSavedPaymentMethod = async (
  customerId: string,
  paymentMethodId: string
): Promise<void> => {
  try {
    const customerRef = doc(db, "customers", customerId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      throw new Error("Customer not found");
    }

    const currentMethods: SavedPaymentMethod[] =
      customerDoc.data().savedPaymentMethods || [];
    const updatedMethods = currentMethods.filter(
      (method) => method.id !== paymentMethodId
    );

    await updateDoc(customerRef, {
      savedPaymentMethods: updatedMethods,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw new Error("Failed to delete payment method");
  }
};
