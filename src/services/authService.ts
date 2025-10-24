import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  email: string;
  name: string;
  restaurantId: string;
  role: 'owner' | 'staff';
  createdAt: any;
}

/**
 * Login with email and password
 */
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userProfile = userDoc.data() as UserProfile;

    // Get restaurant data
    const restaurantDoc = await getDoc(doc(db, 'restaurants', userProfile.restaurantId));

    if (!restaurantDoc.exists()) {
      throw new Error('Restaurant not found');
    }

    return {
      user,
      userProfile,
      restaurant: {
        id: restaurantDoc.id,
        ...restaurantDoc.data(),
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later.');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled');
    } else {
      throw new Error(error.message || 'Failed to login. Please try again.');
    }
  }
};

/**
 * Logout current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};
