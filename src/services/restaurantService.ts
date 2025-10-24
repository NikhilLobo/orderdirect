import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface RestaurantSignupData {
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  subdomain: string;
  password: string;
}

/**
 * Check if subdomain is available
 */
export const checkSubdomainAvailability = async (subdomain: string): Promise<boolean> => {
  try {
    // Reserved subdomains
    const reserved = ['admin', 'dashboard', 'www', 'api', 'app', 'mail', 'support'];
    if (reserved.includes(subdomain.toLowerCase())) {
      return false;
    }

    // Check if subdomain already exists in Firestore
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(restaurantsRef, where('subdomain', '==', subdomain.toLowerCase()));
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty; // Available if no documents found
  } catch (error) {
    console.error('Error checking subdomain:', error);
    throw new Error('Failed to check subdomain availability');
  }
};

/**
 * Sign up a new restaurant
 */
export const signupRestaurant = async (data: RestaurantSignupData) => {
  try {
    // 1. Check subdomain availability first
    const isAvailable = await checkSubdomainAvailability(data.subdomain);
    if (!isAvailable) {
      throw new Error('Subdomain is not available');
    }

    // 2. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = userCredential.user;

    // 3. Create restaurant document
    const restaurantRef = doc(db, 'restaurants', user.uid);
    await setDoc(restaurantRef, {
      name: data.restaurantName,
      subdomain: data.subdomain.toLowerCase(),
      ownerName: data.ownerName,
      ownerEmail: data.email,
      phone: data.phone,
      stripeAccountId: null,
      subscriptionStatus: 'trial', // Start with trial
      subscriptionPlan: 'standard', // £49/month plan
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 4. Create user profile document
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: data.email,
      name: data.ownerName,
      restaurantId: user.uid,
      role: 'owner',
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      userId: user.uid,
      subdomain: data.subdomain.toLowerCase(),
    };
  } catch (error: any) {
    console.error('Error signing up restaurant:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already registered');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else {
      throw new Error(error.message || 'Failed to sign up. Please try again.');
    }
  }
};

/**
 * Get restaurant data by subdomain
 */
export const getRestaurantBySubdomain = async (subdomain: string) => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(restaurantsRef, where('subdomain', '==', subdomain.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const restaurantDoc = querySnapshot.docs[0];
    return {
      id: restaurantDoc.id,
      ...restaurantDoc.data(),
    };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw new Error('Failed to fetch restaurant data');
  }
};
