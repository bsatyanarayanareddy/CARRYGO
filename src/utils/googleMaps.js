import { Loader } from '@googlemaps/js-api-loader';

// Google Maps configuration
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key';

export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry', 'directions']
});

// Initialize Google Maps
export const initializeGoogleMaps = async () => {
  try {
    await googleMapsLoader.load();
    return window.google;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    throw error;
  }
};

// Calculate distance between two points
export const calculateDistance = (origin, destination) => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps not loaded');
    return null;
  }

  const service = new window.google.maps.DistanceMatrixService();
  
  return new Promise((resolve, reject) => {
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      if (status === 'OK') {
        const result = response.rows[0].elements[0];
        if (result.status === 'OK') {
          resolve({
            distance: result.distance.text,
            distanceValue: result.distance.value,
            duration: result.duration.text,
            durationValue: result.duration.value
          });
        } else {
          reject(new Error(`Distance calculation failed: ${result.status}`));
        }
      } else {
        reject(new Error(`Distance Matrix API error: ${status}`));
      }
    });
  });
};

// Get directions between two points
export const getDirections = (origin, destination) => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps not loaded');
    return Promise.reject('Google Maps not loaded');
  }

  const directionsService = new window.google.maps.DirectionsService();
  
  return new Promise((resolve, reject) => {
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK') {
        resolve(result);
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
};

// Geocode address to coordinates
export const geocodeAddress = (address) => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps not loaded');
    return Promise.reject('Google Maps not loaded');
  }

  const geocoder = new window.google.maps.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address,
          place_id: results[0].place_id
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

// Check if two routes overlap (simplified algorithm)
export const checkRouteOverlap = async (route1, route2, thresholdKm = 50) => {
  try {
    // Get coordinates for all points
    const route1Origin = await geocodeAddress(route1.from);
    const route1Dest = await geocodeAddress(route1.to);
    const route2Origin = await geocodeAddress(route2.from);
    const route2Dest = await geocodeAddress(route2.to);

    // Calculate distances between route points
    const distances = [];
    
    // Distance from route1 origin to route2 points
    distances.push(calculateDistanceBetweenPoints(route1Origin, route2Origin));
    distances.push(calculateDistanceBetweenPoints(route1Origin, route2Dest));
    
    // Distance from route1 destination to route2 points
    distances.push(calculateDistanceBetweenPoints(route1Dest, route2Origin));
    distances.push(calculateDistanceBetweenPoints(route1Dest, route2Dest));

    // Check if any distance is within threshold
    const minDistance = Math.min(...distances);
    return {
      overlaps: minDistance <= thresholdKm,
      minDistance: minDistance,
      confidence: Math.max(0, 100 - (minDistance / thresholdKm * 100))
    };
  } catch (error) {
    console.error('Error checking route overlap:', error);
    return { overlaps: false, minDistance: Infinity, confidence: 0 };
  }
};

// Calculate distance between two coordinate points (Haversine formula)
const calculateDistanceBetweenPoints = (point1, point2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  
  return d;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};
