// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwIMSWgNWW7F-xJiRuNZfrFPaxxMxMVIk",
  authDomain: "carryon-8a653.firebaseapp.com",
  projectId: "carryon-8a653",
  storageBucket: "carryon-8a653.firebasestorage.app",
  messagingSenderId: "650961331605",
  appId: "1:650961331605:web:4dae0753a4a200b3d0029c",
  measurementId: "G-9ZK0W55D5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

// Firestore functions
export const createUserProfile = async (uid, userData) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, userData);
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log('User profile found:', userSnap.data());
      return userSnap.data();
    } else {
      console.log('No user profile found for UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const createPackage = async (packageData) => {
  try {
    const packagesRef = collection(db, 'packages');
    const packageRef = await addDoc(packagesRef, packageData);
    
    // Create notification for the customer
    const { createNotification, notificationTypes } = await import('../utils/notifications');
    await createNotification(
      packageData.customerId,
      'Package Posted Successfully!',
      `Your package "${packageData.title}" has been posted and is now visible to travelers`,
      notificationTypes.PACKAGE_POSTED,
      { packageId: packageRef.id }
    );
    
    console.log('Package created with ID:', packageRef.id);
    return packageRef;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const getPackages = async (filters = {}) => {
  try {
    let q = collection(db, 'packages');
    
    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.customerId) {
      q = query(q, where('customerId', '==', filters.customerId));
    }
    
    if (filters.fromLocation) {
      q = query(q, where('fromLocation', '==', filters.fromLocation));
    }
    
    if (filters.toLocation) {
      q = query(q, where('toLocation', '==', filters.toLocation));
    }
    
    const querySnapshot = await getDocs(q);
    const packages = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    console.log('Packages fetched:', packages.length);
    return packages;
  } catch (error) {
    console.error('Error getting packages:', error);
    throw error;
  }
};

export const updatePackageStatus = async (packageId, status) => {
  const packageRef = doc(db, 'packages', packageId);
  await updateDoc(packageRef, { status });
};

// Real-time listeners
export const subscribeToPackages = (callback, filters = {}) => {
  try {
    let q = collection(db, 'packages');
    
    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.customerId) {
      q = query(q, where('customerId', '==', filters.customerId));
    }
    
    return onSnapshot(q, (snapshot) => {
      const packages = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      console.log('Real-time packages update:', packages.length);
      callback(packages);
    }, (error) => {
      console.error('Error in packages subscription:', error);
    });
  } catch (error) {
    console.error('Error setting up packages subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Create delivery when traveler accepts package
export const createDelivery = async (packageId, travelerId, travelerData) => {
  try {
    // Get the package details first
    const packageRef = doc(db, 'packages', packageId);
    const packageSnap = await getDoc(packageRef);
    
    if (!packageSnap.exists()) {
      throw new Error('Package not found');
    }
    
    const packageData = packageSnap.data();
    
    const deliveryData = {
      packageId,
      customerId: packageData.customerId,
      travelerId,
      travelerName: travelerData.name,
      travelerPhone: travelerData.phone,
      packageTitle: packageData.title,
      fromLocation: packageData.fromLocation,
      toLocation: packageData.toLocation,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const deliveriesRef = collection(db, 'deliveries');
    const deliveryRef = await addDoc(deliveriesRef, deliveryData);
    
    // Update package status
    await updatePackageStatus(packageId, 'accepted');
    
    // Create notification for customer
    const { createNotification, notificationTypes } = await import('../utils/notifications');
    await createNotification(
      packageData.customerId,
      'Package Accepted!',
      `Your package "${packageData.title}" has been accepted by ${travelerData.name}`,
      notificationTypes.PACKAGE_ACCEPTED,
      { packageId, deliveryId: deliveryRef.id }
    );
    
    return deliveryRef;
  } catch (error) {
    console.error('Error creating delivery:', error);
    throw error;
  }
};

// Get deliveries for a user
export const getDeliveries = async (userId, role) => {
  try {
    let q = collection(db, 'deliveries');
    
    if (role === 'traveler') {
      q = query(q, where('travelerId', '==', userId));
    } else {
      q = query(q, where('customerId', '==', userId));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error('Error getting deliveries:', error);
    throw error;
  }
};

// Update delivery status
export const updateDeliveryStatus = async (deliveryId, status, location = null) => {
  try {
    const deliveryRef = doc(db, 'deliveries', deliveryId);
    const updateData = { 
      status, 
      updatedAt: new Date().toISOString() 
    };
    
    if (location) {
      updateData.currentLocation = location;
    }
    
    if (status === 'delivered') {
      updateData.deliveredAt = new Date().toISOString();
    }
    
    await updateDoc(deliveryRef, updateData);
  } catch (error) {
    console.error('Error updating delivery status:', error);
    throw error;
  }
};

export default app;
