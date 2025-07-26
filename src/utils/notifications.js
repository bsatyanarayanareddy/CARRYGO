import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const createNotification = async (userId, title, message, type = 'info', data = {}) => {
  try {
    const notificationData = {
      userId,
      title,
      message,
      type,
      data,
      read: false,
      createdAt: serverTimestamp() // Use serverTimestamp for proper ordering
    };

    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, notificationData);
    
    console.log('Notification created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Test function to create a sample notification
export const createTestNotification = async (userId) => {
  try {
    return await createNotification(
      userId,
      'Test Notification 🎉',
      'This is a test notification to verify the system is working correctly!',
      'info',
      { test: true }
    );
  } catch (error) {
    console.error('Error creating test notification:', error);
    throw error;
  }
};

export const notificationTypes = {
  PACKAGE_ACCEPTED: 'package_accepted',
  PACKAGE_DELIVERED: 'package_delivered', 
  PACKAGE_CANCELLED: 'package_cancelled',
  PACKAGE_POSTED: 'package_posted',
  PAYMENT_RECEIVED: 'payment_received'
};
