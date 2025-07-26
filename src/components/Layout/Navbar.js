import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Package, MapPin, Home, Bell, TestTube } from 'lucide-react';
import { logout } from '../../firebase/config';
import NotificationCenter from '../UI/NotificationCenter';
import { createTestNotification } from '../../utils/notifications';
import toast from 'react-hot-toast';

const Navbar = ({ user, userProfile }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleTestNotification = async () => {
    if (!user) return;
    
    try {
      await createTestNotification(user.uid);
      toast.success('Test notification created!');
    } catch (error) {
      toast.error('Failed to create test notification');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">CarryGo</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                {userProfile?.role === 'customer' && (
                  <Link 
                    to="/post-package" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span>Post Package</span>
                  </Link>
                )}
                
                {userProfile?.role === 'traveler' && (
                  <Link 
                    to="/traveler" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Find Packages</span>
                  </Link>
                )}
                
                <Link 
                  to="/packages" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Packages</span>
                </Link>
                
                <Link 
                  to="/phase4-features" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-secondary-600 transition-colors font-medium"
                >
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    ✨ Phase 4
                  </span>
                </Link>
                
                <Link 
                  to="/phase5-features" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    🧠 Phase 5 AI
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome, {userProfile?.name || user.displayName || 'User'}
              </span>
              <div className="flex items-center space-x-2">
                {/* Test Notification Button (for debugging) */}
                <button 
                  onClick={handleTestNotification}
                  className="p-2 text-gray-700 hover:text-green-600 transition-colors"
                  title="Create test notification"
                >
                  <TestTube className="h-4 w-4" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {/* Notification badge - you can add logic to show unread count */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      0
                    </span>
                  </button>
                  <NotificationCenter 
                    user={user}
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                </div>

                {/* Profile */}
                <Link 
                  to="/profile" 
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>
                
                {/* Logout */}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
