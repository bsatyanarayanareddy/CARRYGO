import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { AlertCircle } from 'lucide-react';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        color: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${label}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Routing component
const RoutingControl = ({ start, end, onRouteFound }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create new routing control
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: () => null, // Don't create default markers
      lineOptions: {
        styles: [{ color: '#3B82F6', weight: 5, opacity: 0.8 }]
      },
      show: false, // Hide the instruction panel
    }).on('routesfound', function(e) {
      const routes = e.routes;
      if (routes.length > 0 && onRouteFound) {
        const route = routes[0];
        onRouteFound({
          distance: (route.summary.totalDistance / 1000).toFixed(1) + ' km',
          duration: Math.round(route.summary.totalTime / 60) + ' min',
          distanceValue: route.summary.totalDistance,
          durationValue: route.summary.totalTime
        });
      }
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end, onRouteFound]);

  return null;
};

const LeafletMap = ({
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 10,
  markers = [],
  showDirections = false,
  origin,
  destination,
  onRouteFound,
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef(null);

  // Prepare markers with custom icons
  const processedMarkers = markers.map((marker, index) => ({
    ...marker,
    icon: marker.icon || createCustomIcon('#3B82F6', (index + 1).toString())
  }));

  // Add origin and destination markers if routing is enabled
  if (showDirections && origin && destination) {
    processedMarkers.unshift(
      {
        position: origin,
        title: 'Start',
        infoWindow: 'Starting Point',
        icon: createCustomIcon('#10B981', 'A')
      },
      {
        position: destination,
        title: 'End',
        infoWindow: 'Destination',
        icon: createCustomIcon('#EF4444', 'B')
      }
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`} style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        {/* Free OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Markers */}
        {processedMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.position.lat, marker.position.lng]}
            icon={marker.icon}
          >
            {marker.infoWindow && (
              <Popup>
                <div>
                  <strong>{marker.title}</strong>
                  <br />
                  {marker.infoWindow}
                </div>
              </Popup>
            )}
          </Marker>
        ))}

        {/* Routing */}
        {showDirections && origin && destination && (
          <RoutingControl
            start={origin}
            end={destination}
            onRouteFound={onRouteFound}
          />
        )}
      </MapContainer>
    </div>
  );
};

// Error boundary wrapper
const SafeLeafletMap = (props) => {
  try {
    return <LeafletMap {...props} />;
  } catch (error) {
    console.error('Map error:', error);
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${props.className || ''}`} 
           style={{ height: props.height || '400px' }}>
        <div className="text-center text-gray-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Map temporarily unavailable</p>
        </div>
      </div>
    );
  }
};

export default SafeLeafletMap;
