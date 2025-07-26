import React, { useState } from 'react';
import { MapPin, Route, Package, DollarSign, Clock, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPackages, createDelivery } from '../../firebase/config';
import toast from 'react-hot-toast';

const TravelerDashboard = ({ user, userProfile }) => {
  const [route, setRoute] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in to access the traveler dashboard and start earning money by delivering packages.
            </p>
            <div className="space-y-4">
              <Link
                to="/login"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Login to Continue
              </Link>
              <div>
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleRouteSearch = async (e) => {
    e.preventDefault();
    if (!route.from || !route.to) {
      toast.error('Please enter both from and to locations');
      return;
    }

    setLoading(true);
    setSearchActive(true);

    try {
      // Get all available packages
      const packages = await getPackages({ status: 'posted' });
      
      if (packages.length === 0) {
        // Try without status filter if no packages found with 'posted' status
        const allPackages = await getPackages();
        const availablePackages = allPackages.filter(pkg => 
          !pkg.status || pkg.status === 'posted' || pkg.status === 'pending' || pkg.status === 'active'
        );
        setFilteredPackages(availablePackages);
        
        if (availablePackages.length === 0) {
          toast.info('No packages available at the moment. Check back later!');
        } else {
          toast.success(`Found ${availablePackages.length} available packages!`);
        }
        return;
      }
      
      // Filter packages that match the route (more flexible matching)
      const matchingPackages = packages.filter(pkg => {
        const fromMatch = 
          pkg.pickupLocation?.toLowerCase().includes(route.from.toLowerCase()) ||
          pkg.fromLocation?.toLowerCase().includes(route.from.toLowerCase()) ||
          route.from.toLowerCase().includes(pkg.pickupLocation?.toLowerCase() || '') ||
          route.from.toLowerCase().includes(pkg.fromLocation?.toLowerCase() || '');
          
        const toMatch = 
          pkg.dropoffLocation?.toLowerCase().includes(route.to.toLowerCase()) ||
          pkg.toLocation?.toLowerCase().includes(route.to.toLowerCase()) ||
          route.to.toLowerCase().includes(pkg.dropoffLocation?.toLowerCase() || '') ||
          route.to.toLowerCase().includes(pkg.toLocation?.toLowerCase() || '');
          
        return fromMatch && toMatch;
      });

      setFilteredPackages(matchingPackages.length > 0 ? matchingPackages : packages);
      
      if (matchingPackages.length === 0) {
        toast.info(`No exact matches for your route. Showing all ${packages.length} available packages.`);
      } else {
        toast.success(`Found ${matchingPackages.length} packages matching your route!`);
      }
    } catch (error) {
      console.error('Error searching packages:', error);
      toast.error('Error searching for packages. Please try again.');
      setSearchActive(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPackage = async (packageData) => {
    try {
      await createDelivery(packageData.id, user.uid, userProfile);
      toast.success('Package accepted! You can now coordinate with the customer.');
      
      // Remove the accepted package from the list
      setFilteredPackages(prev => prev.filter(pkg => pkg.id !== packageData.id));
    } catch (error) {
      console.error('Error accepting package:', error);
      toast.error('Failed to accept package. Please try again.');
    }
  };

  const handleRouteChange = (field, value) => {
    setRoute(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Route className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Find Packages</h1>
              <p className="text-gray-600">Discover packages on your travel route and start earning</p>
            </div>
          </div>
        </div>

        {/* Route Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleRouteSearch} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Travel Route</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={route.from}
                    onChange={(e) => handleRouteChange('from', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Mumbai"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={route.to}
                    onChange={(e) => handleRouteChange('to', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Delhi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={route.date}
                    onChange={(e) => handleRouteChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Find Packages
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {searchActive && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Available Packages ({filteredPackages.length})
              </h2>
              {filteredPackages.length > 0 && (
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  Earn up to ₹{Math.max(...filteredPackages.map(pkg => parseInt(pkg.reward)))} per delivery
                </span>
              )}
            </div>

            {filteredPackages.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No packages found</h3>
                <p className="text-gray-600">
                  Try different locations or check back later for new packages.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Package Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{pkg.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        ₹{pkg.reward}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{pkg.fromLocation}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-800">{pkg.toLocation}</span>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{pkg.weight}kg • {pkg.size}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {pkg.deliveryDate ? new Date(pkg.deliveryDate).toLocaleDateString() : 'Flexible'}
                        </span>
                      </div>
                    </div>

                    {/* Package Options */}
                    {(pkg.fragile || pkg.urgent || pkg.cashOnDelivery) && (
                      <div className="flex flex-wrap gap-2 mb-4">
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

                    {/* Customer Info */}
                    <div className="text-sm text-gray-600 mb-4">
                      Posted by {pkg.customerName || 'Anonymous'} • {new Date(pkg.createdAt).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                      <button
                        onClick={() => handleAcceptPackage(pkg)}
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Accept Package
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Getting Started Guide */}
        {!searchActive && (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-sm p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">How to Start Earning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">1. Enter Your Route</h3>
                <p className="text-sm opacity-90">Tell us where you're traveling from and to</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">2. Choose Packages</h3>
                <p className="text-sm opacity-90">Select packages that match your route and preferences</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">3. Earn Money</h3>
                <p className="text-sm opacity-90">Get paid for successful deliveries and build your rating</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelerDashboard;
