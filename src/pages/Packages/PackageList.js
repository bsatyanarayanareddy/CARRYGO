import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Calendar, User, DollarSign, Filter, Search, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getPackages, subscribeToPackages } from '../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';

const PackageList = ({ userProfile }) => {
  const [user] = useAuthState(auth);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        let packagesData;
        
        if (userProfile?.role === 'customer') {
          // For customers, show only their packages
          packagesData = await getPackages({ customerId: user.uid });
        } else {
          // For travelers, show available packages
          packagesData = await getPackages({ status: 'pending' });
        }
        
        setPackages(packagesData || []);
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && userProfile) {
      loadPackages();
      
      // Set up real-time listener
      const unsubscribe = subscribeToPackages((packagesData) => {
        if (userProfile?.role === 'customer') {
          // Filter to show only customer's packages
          const customerPackages = packagesData.filter(pkg => pkg.customerId === user.uid);
          setPackages(customerPackages);
        } else {
          // Show available packages for travelers
          const availablePackages = packagesData.filter(pkg => pkg.status === 'pending');
          setPackages(availablePackages);
        }
      });

      return () => unsubscribe();
    }
  }, [user, userProfile]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'in-transit': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'in-transit': return <Package className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredPackages = packages.filter(pkg => {
    if (filter !== 'all' && pkg.status !== filter) return false;
    if (searchTerm && !pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !pkg.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !pkg.toLocation.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading packages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {userProfile?.role === 'customer' ? 'My Packages' : 'Available Packages'}
              </h1>
              <p className="text-gray-600 mt-1">
                {userProfile?.role === 'customer' 
                  ? 'Track and manage your sent packages' 
                  : 'Find packages to deliver on your route'
                }
              </p>
            </div>
            {userProfile?.role === 'customer' && (
              <Link
                to="/post-package"
                className="mt-4 md:mt-0 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <Package className="h-5 w-5 mr-2" />
                Post New Package
              </Link>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packages by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                {userProfile?.role === 'customer' && <option value="cancelled">Cancelled</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Package List */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No packages found</h3>
            <p className="text-gray-600 mb-6">
              {userProfile?.role === 'customer' 
                ? "You haven't posted any packages yet." 
                : "No packages available for your current filters."
              }
            </p>
            {userProfile?.role === 'customer' && (
              <Link
                to="/post-package"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <Package className="h-5 w-5 mr-2" />
                Post Your First Package
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Package Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{pkg.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(pkg.status)}`}>
                      {getStatusIcon(pkg.status)}
                      <span className="capitalize">{pkg.status}</span>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="p-6 space-y-4">
                  {/* Route */}
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{pkg.fromLocation}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-800">{pkg.toLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{pkg.weight}kg • {pkg.size}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">₹{pkg.reward}</span>
                    </div>
                  </div>

                  {/* Customer Info (for travelers) */}
                  {userProfile?.role === 'traveler' && (
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">By {pkg.customerName || 'Anonymous'}</span>
                    </div>
                  )}

                  {/* Delivery Date */}
                  {pkg.deliveryDate && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Preferred by {new Date(pkg.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Package Options */}
                  {(pkg.fragile || pkg.urgent || pkg.cashOnDelivery) && (
                    <div className="flex flex-wrap gap-2">
                      {pkg.fragile && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Fragile</span>
                      )}
                      {pkg.urgent && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Urgent</span>
                      )}
                      {pkg.cashOnDelivery && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">COD</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Posted {new Date(pkg.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      {userProfile?.role === 'traveler' && pkg.status === 'pending' && (
                        <button className="px-4 py-1.5 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors">
                          Accept Package
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageList;
