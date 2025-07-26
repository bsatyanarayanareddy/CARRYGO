import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Loader } from 'lucide-react';
import { searchPlaces, reverseGeocode } from '../../utils/freeMapUtils';

const FreeLocationAutocomplete = ({ 
  onLocationSelect, 
  placeholder = "Enter location...", 
  value = "",
  className = "",
  disabled = false,
  showCurrentLocation = true
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchPlaces(query, {
        limit: 5,
        countrycodes: 'us,ca'
      });

      const formattedResults = results.map(result => ({
        display_name: result.display_name,
        lat: result.lat,
        lng: result.lng,
        place_id: result.place_id,
        type: result.type,
        importance: result.importance
      }));

      setSuggestions(formattedResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Geocoding error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchLocation(newValue);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    setInputValue(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);

    if (onLocationSelect) {
      onLocationSelect({
        address: suggestion.display_name,
        lat: suggestion.lat,
        lng: suggestion.lng,
        place_id: suggestion.place_id,
        formatted_address: suggestion.display_name
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode using our free utility
          const result = await reverseGeocode(latitude, longitude);
          
          if (result) {
            const address = result.formatted_address;
            setInputValue(address);
            
            if (onLocationSelect) {
              onLocationSelect({
                address,
                lat: latitude,
                lng: longitude,
                place_id: result.place_id,
                formatted_address: result.formatted_address,
                isCurrentLocation: true
              });
            }
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          // Still provide coordinates even if reverse geocoding fails
          const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setInputValue(coords);
          
          if (onLocationSelect) {
            onLocationSelect({
              address: coords,
              lat: latitude,
              lng: longitude,
              isCurrentLocation: true
            });
          }
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        setIsLoading(false);
        alert('Unable to retrieve your current location.');
      }
    );
  };

  const clearInput = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onLocationSelect) {
      onLocationSelect(null);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          {isLoading && (
            <Loader className="h-4 w-4 text-blue-500 animate-spin" />
          )}
          
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={clearInput}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {showCurrentLocation && !isLoading && (
            <button
              type="button"
              onClick={getCurrentLocation}
              className="p-1 text-blue-500 hover:text-blue-600 transition-colors text-xs font-medium"
              title="Use current location"
              disabled={disabled}
            >
              GPS
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => {
            // Split address into main and secondary parts
            const addressParts = suggestion.display_name.split(',');
            const mainText = addressParts.slice(0, 2).join(',');
            const secondaryText = addressParts.slice(2).join(',');

            return (
              <button
                key={suggestion.place_id || index}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {mainText}
                    </div>
                    {secondaryText && (
                      <div className="text-sm text-gray-500 truncate">
                        {secondaryText}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && inputValue.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No locations found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default FreeLocationAutocomplete;
