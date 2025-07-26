import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Star, Clock, TrendingUp, Users } from 'lucide-react';

const Dashboard = ({ userProfile }) => {
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Setting up your profile...</h2>
          <div className="spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  const isCustomer = userProfile.role === 'customer';
  const isTraveler = userProfile.role === 'traveler';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {userProfile.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                {isCustomer ? 'Manage your packages and track deliveries' : 'Find packages to deliver and earn money'}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">
                  {userProfile.rating || 0} Rating
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {userProfile.totalDeliveries || 0} total deliveries
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isCustomer ? 'Packages Sent' : 'Packages Delivered'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile.totalDeliveries || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary-100">
                {isCustomer ? (
                  <Clock className="h-6 w-6 text-secondary-600" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-secondary-600" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isCustomer ? 'Active Packages' : 'Earnings This Month'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isCustomer ? '0' : '₹0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isCustomer ? 'Loyalty Points' : 'Trust Score'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile.points || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Actions */}
          {isCustomer && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/post-package"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Package className="h-8 w-8 text-primary-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Post a New Package</h3>
                    <p className="text-sm text-gray-600">Send a package with a trusted traveler</p>
                  </div>
                </Link>
                
                <Link
                  to="/packages"
                  className="flex items-center p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <Clock className="h-8 w-8 text-secondary-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Track My Packages</h3>
                    <p className="text-sm text-gray-600">Monitor your active deliveries</p>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Traveler Actions */}
          {isTraveler && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/traveler"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <MapPin className="h-8 w-8 text-primary-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Find Packages</h3>
                    <p className="text-sm text-gray-600">Discover packages on your route</p>
                  </div>
                </Link>
                
                <Link
                  to="/packages"
                  className="flex items-center p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <Package className="h-8 w-8 text-secondary-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">My Deliveries</h3>
                    <p className="text-sm text-gray-600">View your active and completed deliveries</p>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">
                  {isCustomer 
                    ? 'Start by posting your first package' 
                    : 'Begin by finding packages to deliver'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for new users */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-4">
            {isCustomer ? 'Tips for Sending Packages' : 'Tips for Earning More'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isCustomer ? (
              <>
                <div className="flex items-start space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pack Securely</h3>
                    <p className="text-sm opacity-90">Use proper packaging to protect your items during transport</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Choose Trusted Travelers</h3>
                    <p className="text-sm opacity-90">Check ratings and reviews before selecting a traveler</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Build Your Rating</h3>
                    <p className="text-sm opacity-90">Complete deliveries on time to earn better ratings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Update Your Route</h3>
                    <p className="text-sm opacity-90">Keep your travel plans updated to get more package offers</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
