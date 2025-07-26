import React, { useState, useEffect } from 'react';
import { Route, MapPin, Clock, DollarSign, Package } from 'lucide-react';
import LeafletMap from './LeafletMap';
import FreeLocationAutocomplete from './FreeLocationAutocomplete';
import { calculateDistance, checkRouteOverlap } from '../../utils/freeMapUtils';

const FreeRoutePlanner = ({ 
  onRouteUpdate, 
  initialRoute = null, 
  availablePackages = [],
  className = "" 
}) => {
  const [route, setRoute] = useState(initialRoute || {
    from: '',
    to: '',
    fromCoords: null,
    toCoords: null,
    date: '',
    time: ''
  });
  const [routeInfo, setRouteInfo] = useState(null);
  const [matchingPackages, setMatchingPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const calculateRouteInfo = async () => {
      if (!route.fromCoords || !route.toCoords) return;

      setLoading(true);
      try {
        const distance = await calculateDistance(route.fromCoords, route.toCoords);
        setRouteInfo(distance);
      } catch (error) {
        console.error('Error calculating route info:', error);
      } finally {
        setLoading(false);
      }
    };

    const findMatchingPackages = async () => {
      if (!route.fromCoords || !route.toCoords || !availablePackages.length) {
        setMatchingPackages([]);
        return;
      }

      const matches = [];
      
      for (const pkg of availablePackages) {
        try {
          const overlap = await checkRouteOverlap(
            {
              from: route.from,
              to: route.to
            },
            {
              from: pkg.pickupLocation,
              to: pkg.deliveryLocation
            }
          );

          if (overlap.overlaps) {
            matches.push({
              ...pkg,
              matchScore: overlap.confidence,
              estimatedDistance: overlap.minDistance
            });
          }
        } catch (error) {
          console.error('Error checking package overlap:', error);
        }
      }

      // Sort by match score (highest first)
      matches.sort((a, b) => b.matchScore - a.matchScore);
      setMatchingPackages(matches);
    };

    const processRoute = async () => {
      if (route.fromCoords && route.toCoords) {
        await Promise.all([
          calculateRouteInfo(),
          findMatchingPackages()
        ]);
      }
    };
    
    processRoute();
  }, [route.fromCoords, route.toCoords, route.from, route.to, availablePackages]);

  const handleLocationSelect = (field) => (location) => {
    if (location) {
      setRoute(prev => ({
        ...prev,
        [field]: location.address,
        [`${field}Coords`]: { lat: location.lat, lng: location.lng }
      }));
    } else {
      setRoute(prev => ({
        ...prev,
        [field]: '',
        [`${field}Coords`]: null
      }));
    }
  };

  const handleInputChange = (field) => (e) => {
    setRoute(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSaveRoute = () => {
    if (onRouteUpdate) {
      onRouteUpdate({
        ...route,
        routeInfo,
        matchingPackages
      });
    }
  };

  const handleRouteFound = (routeData) => {
    setRouteInfo(routeData);
  };

  const getMapMarkers = () => {
    const markers = [];
    
    // Add package markers
    matchingPackages.slice(0, 5).forEach((pkg, index) => {
      if (pkg.pickupCoords) {
        markers.push({
          position: pkg.pickupCoords,
          title: `Package ${index + 1} - Pickup`,
          infoWindow: `<div><strong>${pkg.title}</strong><br/>Pickup: ${pkg.pickupLocation}<br/>Fee: $${pkg.deliveryFee}</div>`
        });
      }
    });

    return markers;
  };

  const totalEarnings = matchingPackages.reduce((sum, pkg) => sum + pkg.deliveryFee, 0);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Route className="h-5 w-5 mr-2 text-blue-600" />
          Route Planner
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            100% FREE
          </span>
        </h3>
        <button
          onClick={() => setShowMap(!showMap)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Route Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <FreeLocationAutocomplete
              value={route.from}
              onLocationSelect={handleLocationSelect('from')}
              placeholder="Starting location..."
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <FreeLocationAutocomplete
              value={route.to}
              onLocationSelect={handleLocationSelect('to')}
              placeholder="Destination..."
              className="w-full"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Date
            </label>
            <input
              type="date"
              value={route.date}
              onChange={handleInputChange('date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Time
            </label>
            <input
              type="time"
              value={route.time}
              onChange={handleInputChange('time')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Route Information */}
        {routeInfo && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              Route Information
              <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                OpenStreetMap
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-blue-700">
                <MapPin className="h-4 w-4 mr-2" />
                Distance: {routeInfo.distance}
              </div>
              <div className="flex items-center text-blue-700">
                <Clock className="h-4 w-4 mr-2" />
                Duration: {routeInfo.duration}
              </div>
            </div>
          </div>
        )}

        {/* Free Map Display */}
        {showMap && route.fromCoords && route.toCoords && (
          <div className="mt-4">
            <div className="mb-2 text-xs text-gray-500 flex items-center">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">FREE</span>
              Powered by OpenStreetMap - No API costs!
            </div>
            <LeafletMap
              center={route.fromCoords}
              zoom={10}
              markers={getMapMarkers()}
              showDirections={true}
              origin={route.fromCoords}
              destination={route.toCoords}
              onRouteFound={handleRouteFound}
              height="300px"
              className="rounded-lg border"
            />
          </div>
        )}

        {/* Matching Packages */}
        {matchingPackages.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Package className="h-4 w-4 mr-2 text-green-600" />
                Matching Packages ({matchingPackages.length})
              </h4>
              <div className="flex items-center text-green-600 font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                Total Earnings: ${totalEarnings}
              </div>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {matchingPackages.map((pkg) => (
                <div key={pkg.id} className="bg-gray-50 rounded-lg p-3 border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{pkg.title}</h5>
                      <p className="text-sm text-gray-600">
                        {pkg.pickupLocation} → {pkg.deliveryLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${pkg.deliveryFee}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(pkg.matchScore)}% match
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Weight: {pkg.weight}kg</span>
                    <span>Due: {new Date(pkg.deliveryDeadline?.toDate?.() || pkg.deliveryDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSaveRoute}
            disabled={!route.from || !route.to || !route.date}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Save Route
          </button>
          {matchingPackages.length > 0 && (
            <button
              onClick={() => {/* Handle view all packages */}}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Packages
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Calculating route...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeRoutePlanner;
