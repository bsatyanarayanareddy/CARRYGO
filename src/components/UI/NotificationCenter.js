import React, { useState, useEffect } from 'react';
import { Bell, Package, Check, X } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';

const NotificationCenter = ({ user, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isOpen) {
      setNotifications([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Loading timeout - using sample notifications');
      // Show sample notifications if Firebase takes too long
      setNotifications([
        {
          id: 'sample-1',
          type: 'package_accepted',
          title: 'Package Accepted',
          message: 'Your package to New York has been accepted by a traveler!',
          createdAt: new Date().toISOString(),
          read: false
        },
        {
          id: 'sample-2',
          type: 'package_delivered',
          title: 'Welcome to CarryGo!',
          message: 'Thanks for joining our peer-to-peer delivery platform.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          read: true
        }
      ]);
    }, 5000); // 5 second timeout

    try {
      const notificationsRef = collection(db, 'notifications');
      // Simplified query without orderBy to avoid index issues
      const q = query(
        notificationsRef, 
        where('userId', '==', user.uid),
        limit(20) // Limit to prevent large queries
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          clearTimeout(timeout);
          const notifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
          })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort in memory
          
          setNotifications(notifs);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Notification listener error:', err);
          clearTimeout(timeout);
          setLoading(false);
          setError('Could not load notifications');
          // Show sample notifications on error
          setNotifications([
            {
              id: 'sample-1',
              type: 'package_accepted',
              title: 'Package Accepted',
              message: 'Your package to New York has been accepted by a traveler!',
              createdAt: new Date(),
              read: false
            }
          ]);
        }
      );

      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up notifications:', err);
      clearTimeout(timeout);
      setLoading(false);
      setError('Firebase connection error');
      setNotifications([]);
    }
  }, [user, isOpen]);

  const markAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'package_accepted': return <Check className="h-5 w-5 text-green-500" />;
      case 'package_delivered': return <Package className="h-5 w-5 text-blue-500" />;
      case 'package_cancelled': return <X className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <Bell className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-gray-600 text-sm mb-2">Using demo notifications</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-2">You'll see package updates here</p>
          </div>
        ) : null}
        
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {notification.createdAt instanceof Date 
                    ? notification.createdAt.toLocaleString()
                    : new Date(notification.createdAt).toLocaleString()
                  }
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
