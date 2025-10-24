import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface MenuItem {
  id?: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Add a new menu item to a restaurant
 */
export const addMenuItem = async (menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const menuItemsRef = collection(db, 'menuItems');
    const docRef = await addDoc(menuItemsRef, {
      ...menuItem,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...menuItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw new Error('Failed to add menu item');
  }
};

/**
 * Get all menu items for a specific restaurant
 */
export const getMenuItemsByRestaurant = async (restaurantId: string): Promise<MenuItem[]> => {
  try {
    const menuItemsRef = collection(db, 'menuItems');
    const q = query(menuItemsRef, where('restaurantId', '==', restaurantId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as MenuItem[];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Failed to fetch menu items');
  }
};

/**
 * Get available menu items for a restaurant (customer view)
 */
export const getAvailableMenuItems = async (restaurantId: string): Promise<MenuItem[]> => {
  try {
    const menuItemsRef = collection(db, 'menuItems');
    const q = query(
      menuItemsRef,
      where('restaurantId', '==', restaurantId),
      where('available', '==', true)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as MenuItem[];
  } catch (error) {
    console.error('Error fetching available menu items:', error);
    throw new Error('Failed to fetch menu items');
  }
};

/**
 * Update an existing menu item
 */
export const updateMenuItem = async (menuItemId: string, updates: Partial<MenuItem>) => {
  try {
    const menuItemRef = doc(db, 'menuItems', menuItemId);
    await updateDoc(menuItemRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw new Error('Failed to update menu item');
  }
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (menuItemId: string) => {
  try {
    const menuItemRef = doc(db, 'menuItems', menuItemId);
    await deleteDoc(menuItemRef);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw new Error('Failed to delete menu item');
  }
};

/**
 * Toggle menu item availability
 */
export const toggleMenuItemAvailability = async (menuItemId: string, available: boolean) => {
  try {
    await updateMenuItem(menuItemId, { available });
  } catch (error) {
    console.error('Error toggling menu item availability:', error);
    throw new Error('Failed to toggle availability');
  }
};
