import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  restaurantId: string;
  status: 'open' | 'closed';
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new order
 */
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

/**
 * Get all orders for a restaurant (one-time fetch)
 */
export const getOrdersByRestaurant = async (restaurantId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    // Simplified query without orderBy to avoid requiring composite index
    // We'll sort on the client side instead
    const q = query(
      ordersRef,
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Order[];

    // Sort by createdAt descending on the client side
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

/**
 * Subscribe to real-time orders updates for a restaurant
 * Returns an unsubscribe function to clean up the listener
 */
export const subscribeToOrders = (
  restaurantId: string,
  onUpdate: (orders: Order[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('restaurantId', '==', restaurantId)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Order[];

        // Sort by createdAt descending on the client side
        const sortedOrders = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Call the callback with updated orders
        onUpdate(sortedOrders);
      },
      (error) => {
        console.error('Error in orders subscription:', error);
        if (onError) {
          onError(new Error('Failed to subscribe to orders'));
        }
      }
    );

    // Return unsubscribe function for cleanup
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up orders subscription:', error);
    if (onError) {
      onError(new Error('Failed to set up orders subscription'));
    }
    return () => {}; // Return empty function if setup fails
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: 'open' | 'closed') => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

/**
 * Mark order as complete (close it)
 */
export const completeOrder = async (orderId: string) => {
  return updateOrderStatus(orderId, 'closed');
};
