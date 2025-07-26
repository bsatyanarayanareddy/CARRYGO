// Free map utilities using OpenStreetMap services
// No API keys required - completely free!

// Nominatim API base URL (OpenStreetMap's geocoding service)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Calculate distance between two points using Haversine formula
export const calculateDistance = (point1, point2) => {
  return new Promise((resolve) => {
    try {
      let lat1, lng1, lat2, lng2;

      // Handle different input formats
      if (typeof point1 === 'string') {
        // If string format "lat,lng"
        const coords1 = point1.split(',');
        lat1 = parseFloat(coords1[0]);
        lng1 = parseFloat(coords1[1]);
      } else {
        lat1 = point1.lat;
        lng1 = point1.lng;
      }

      if (typeof point2 === 'string') {
        const coords2 = point2.split(',');
        lat2 = parseFloat(coords2[0]);
        lng2 = parseFloat(coords2[1]);
      } else {
        lat2 = point2.lat;
        lng2 = point2.lng;
      }

      const distance = calculateDistanceBetweenPoints(
        { lat: lat1, lng: lng1 },
        { lat: lat2, lng: lng2 }
      );

      // Estimate duration based on average driving speed (60 km/h)
      const durationMinutes = Math.round((distance / 60) * 60);

      resolve({
        distance: `${distance.toFixed(1)} km`,
        distanceValue: distance * 1000, // in meters
        duration: `${durationMinutes} min`,
        durationValue: durationMinutes * 60 // in seconds
      });
    } catch (error) {
      console.error('Error calculating distance:', error);
      resolve({
        distance: 'Unknown',
        distanceValue: 0,
        duration: 'Unknown',
        durationValue: 0
      });
    }
  });
};

// Geocode address to coordinates using Nominatim (free)
export const geocodeAddress = async (address) => {
  try {
    const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CarryGo-App/1.0.0' // Required by Nominatim
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results = await response.json();

    if (results.length > 0) {
      const result = results[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formatted_address: result.display_name,
        place_id: result.place_id
      };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
    throw error;
  }
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CarryGo-App/1.0.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result && result.display_name) {
      return {
        lat: lat,
        lng: lng,
        formatted_address: result.display_name,
        place_id: result.place_id
      };
    } else {
      throw new Error('No address found');
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    throw error;
  }
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

    // Check cross-route distances (more sophisticated overlap detection)
    distances.push(calculateDistanceBetweenPoints(route1Origin, route2Origin));
    distances.push(calculateDistanceBetweenPoints(route1Dest, route2Dest));

    // Check if any distance is within threshold
    const minDistance = Math.min(...distances);
    const overlap = minDistance <= thresholdKm;
    
    return {
      overlaps: overlap,
      minDistance: minDistance,
      confidence: overlap ? Math.max(0, 100 - (minDistance / thresholdKm * 100)) : 0
    };
  } catch (error) {
    console.error('Error checking route overlap:', error);
    return { overlaps: false, minDistance: Infinity, confidence: 0 };
  }
};

// Calculate distance between two coordinate points using Haversine formula
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

// Get detailed route information (simplified version without paid APIs)
export const getRouteInfo = async (origin, destination) => {
  try {
    const distance = await calculateDistance(origin, destination);
    
    // For detailed routing, you could integrate with:
    // - GraphHopper (free tier: 2500 requests/day)
    // - OpenRouteService (free tier: 2000 requests/day)
    // - MapBox (free tier: 100k requests/month)
    
    return {
      ...distance,
      waypoints: [origin, destination],
      success: true
    };
  } catch (error) {
    console.error('Error getting route info:', error);
    return {
      distance: 'Unknown',
      duration: 'Unknown',
      distanceValue: 0,
      durationValue: 0,
      success: false
    };
  }
};

// Search for places (free alternative to Google Places)
export const searchPlaces = async (query, options = {}) => {
  try {
    const limit = options.limit || 5;
    const countrycodes = options.countrycodes || 'us,ca';
    const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&countrycodes=${countrycodes}&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CarryGo-App/1.0.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results = await response.json();

    return results.map(result => ({
      place_id: result.place_id,
      display_name: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      type: result.type,
      importance: result.importance,
      address: result.address
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};
