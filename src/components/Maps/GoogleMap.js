import React, { useRef, useEffect, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { AlertCircle } from 'lucide-react';
import { initializeGoogleMaps, getDirections } from '../../utils/googleMaps';

const MapComponent = ({ 
  center, 
  zoom = 10, 
  markers = [], 
  showDirections = false, 
  origin, 
  destination,
  onMapLoad,
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        const google = await initializeGoogleMaps();
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center || { lat: 40.7128, lng: -74.0060 }, // Default to NYC
          zoom: zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Initialize directions renderer if needed
        if (showDirections) {
          const renderer = new google.maps.DirectionsRenderer({
            draggable: false,
            panel: null
          });
          renderer.setMap(mapInstance);
          setDirectionsRenderer(renderer);
        }

        setMap(mapInstance);
        setIsLoading(false);

        if (onMapLoad) {
          onMapLoad(mapInstance);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map');
        setIsLoading(false);
      }
    };

    if (mapRef.current) {
      initMap();
    }
  }, [center, zoom, showDirections, onMapLoad]);

  // Add markers to map
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach(markerData => {
      if (markerData._marker) {
        markerData._marker.setMap(null);
      }
    });

    // Add new markers
    markers.forEach(markerData => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: markerData.icon || null
      });

      if (markerData.infoWindow) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: markerData.infoWindow
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      markerData._marker = marker;
    });
  }, [map, markers]);

  // Show directions
  useEffect(() => {
    if (!map || !directionsRenderer || !showDirections || !origin || !destination) return;

    const showRoute = async () => {
      try {
        const result = await getDirections(origin, destination);
        directionsRenderer.setDirections(result);
      } catch (err) {
        console.error('Error getting directions:', err);
        setError('Failed to get directions');
      }
    };

    showRoute();
  }, [map, directionsRenderer, showDirections, origin, destination]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center text-gray-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

const GoogleMap = (props) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-center text-yellow-800">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="font-medium">Google Maps API Key Required</p>
          <p className="text-sm">Please add your Google Maps API key to the environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} libraries={['places', 'geometry', 'directions']}>
      <MapComponent {...props} />
    </Wrapper>
  );
};

export default GoogleMap;
