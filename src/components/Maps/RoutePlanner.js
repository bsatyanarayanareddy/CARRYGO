import React, { useState, useEffect } from 'react';
import { Route, MapPin, Clock, DollarSign, Package } from 'lucide-react';
import GoogleMap from './GoogleMap';
import LocationAutocomplete from './LocationAutocomplete';
import { calculateDistance, checkRouteOverlap } from '../../utils/googleMaps';

const RoutePlanner = ({ 
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
        const distance = await calculateDistance(
          `${route.fromCoords.lat},${route.fromCoords.lng}`,
          `${route.toCoords.lat},${route.toCoords.lng}`
        );
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

    if (route.fromCoords && route.toCoords) {
      calculateRouteInfo();
      findMatchingPackages();
    }
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

  const getMapMarkers = () => {
    const markers = [];
    
    if (route.fromCoords) {
      markers.push({
        position: route.fromCoords,
        title: 'Starting Point',
        infoWindow: `<div><strong>From:</strong><br/>${route.from}</div>`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">A</text>
            </svg>
          `),
          scaledSize: window.google && window.google.maps ? new window.google.maps.Size(32, 32) : { width: 32, height: 32 }
        }
      });
    }
    
    if (route.toCoords) {
      markers.push({
        position: route.toCoords,
        title: 'Destination',
        infoWindow: `<div><strong>To:</strong><br/>${route.to}</div>`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">B</text>
            </svg>
          `),
          scaledSize: window.google && window.google.maps ? new window.google.maps.Size(32, 32) : { width: 32, height: 32 }
        }
      });
    }

    return markers;
  };

  const totalEarnings = matchingPackages.reduce((sum, pkg) => sum + pkg.deliveryFee, 0);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Route className="h-5 w-5 mr-2 text-blue-600" />
          Route Planner
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
            <LocationAutocomplete
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
            <LocationAutocomplete
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
            <h4 className="font-medium text-blue-900 mb-2">Route Information</h4>
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

        {/* Map Display */}
        {showMap && route.fromCoords && route.toCoords && (
          <div className="mt-4">
            <GoogleMap
              center={route.fromCoords}
              zoom={10}
              markers={getMapMarkers()}
              showDirections={true}
              origin={route.fromCoords}
              destination={route.toCoords}
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
                Total Earnings: ₹{totalEarnings}
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
                        ₹{pkg.deliveryFee}
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

export default RoutePlanner;
