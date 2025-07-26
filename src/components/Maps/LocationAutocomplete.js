import React, { useState, useEffect, useRef } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { MapPin, X } from 'lucide-react';

const LocationAutocomplete = ({ 
  onLocationSelect, 
  placeholder = "Enter location...", 
  value = "",
  className = "",
  disabled = false,
  showCurrentLocation = true
}) => {
  const [manualInput, setManualInput] = useState(value);
  const inputRef = useRef(null);

  const {
    ready,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: ['us', 'ca'] }, // Restrict to US and Canada
    },
    debounce: 300,
  });

  useEffect(() => {
    if (value !== manualInput) {
      setManualInput(value);
      setValue(value, false);
    }
  }, [value, setValue, manualInput]);

  const handleSelect = async (description) => {
    setValue(description, false);
    setManualInput(description);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      
      if (onLocationSelect) {
        onLocationSelect({
          address: description,
          lat,
          lng,
          place_id: results[0].place_id,
          formatted_address: results[0].formatted_address
        });
      }
    } catch (error) {
      console.error('Error getting geocode:', error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setManualInput(inputValue);
    setValue(inputValue);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          const results = await getGeocode({ 
            location: { lat: latitude, lng: longitude } 
          });
          
          if (results.length > 0) {
            const address = results[0].formatted_address;
            setManualInput(address);
            setValue(address, false);
            
            if (onLocationSelect) {
              onLocationSelect({
                address,
                lat: latitude,
                lng: longitude,
                place_id: results[0].place_id,
                formatted_address: results[0].formatted_address,
                isCurrentLocation: true
              });
            }
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          // Still provide coordinates even if reverse geocoding fails
          if (onLocationSelect) {
            onLocationSelect({
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              lat: latitude,
              lng: longitude,
              isCurrentLocation: true
            });
          }
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to retrieve your current location.');
      }
    );
  };

  const clearInput = () => {
    setManualInput('');
    setValue('');
    clearSuggestions();
    if (onLocationSelect) {
      onLocationSelect(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={manualInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={!ready || disabled}
          className="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          {manualInput && (
            <button
              type="button"
              onClick={clearInput}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {showCurrentLocation && (
            <button
              type="button"
              onClick={getCurrentLocation}
              className="p-1 text-blue-500 hover:text-blue-600 transition-colors text-xs font-medium"
              title="Use current location"
              disabled={!ready || disabled}
            >
              GPS
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {status === 'OK' && data.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
              description,
            } = suggestion;

            return (
              <button
                key={place_id}
                type="button"
                onClick={() => handleSelect(description)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {main_text}
                    </div>
                    {secondary_text && (
                      <div className="text-sm text-gray-500 truncate">
                        {secondary_text}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
