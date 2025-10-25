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

export interface Category {
  id?: string;
  restaurantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Add a new category
 */
export const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, {
      ...category,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
};

/**
 * Get all categories for a restaurant
 */
export const getCategoriesByRestaurant = async (restaurantId: string): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('restaurantId', '==', restaurantId));
    const querySnapshot = await getDocs(q);

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Category[];

    // Sort by display order
    return categories.sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

/**
 * Update a category
 */
export const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId: string) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};
