import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Search, Check, AlertCircle, Navigation } from 'lucide-react';

const LocationSelector = ({ cities, cityPostalCodes, onSelect, onAutoDetect }) => {
  // Initialize states with localStorage values if available
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('selectedCity') || '');
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('selectedCity') || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities);
  const [error, setError] = useState('');

  useEffect(() => {
    const filtered = cities.filter(city =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setError('');
    try {
      await onAutoDetect();
    } catch (err) {
      setError('Unable to detect location. Please select manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchTerm(city);
    localStorage.setItem('selectedCity', city);
    setIsOpen(false);
    onSelect(city);
    setError('');
  };

  return (
    <div className="space-y-4 w-full">
      {/* Professional Auto-detect Button */}
      <button
        onClick={handleAutoDetect}
        disabled={isDetecting}
        className="w-full flex items-center justify-center px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 font-medium hover:bg-orange-100 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Automatically detect your current location"
      >
        {isDetecting ? (
          <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Navigation className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
        )}
        <span>{isDetecting ? 'Detecting...' : 'Auto-detect my location'}</span>
      </button>

      {/* Professional Divider */}
      <div className="relative flex items-center">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-3 text-sm text-gray-500 bg-white">or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Professional City Selection */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg text-left hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        >
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
            <div className="text-left">
              {selectedCity ? (
                <div>
                  <div className="font-medium text-gray-900">{selectedCity}</div>
                  <div className="text-sm text-gray-500">Postal Code: {cityPostalCodes[selectedCity]}</div>
                </div>
              ) : (
                <span className="text-gray-500">Select your city</span>
              )}
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Professional Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg group"
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3 group-hover:text-orange-500 transition-colors" />
                  <div>
                    <div className="font-medium text-gray-900">{city}</div>
                    <div className="text-sm text-gray-500">Postal Code: {cityPostalCodes[city]}</div>
                  </div>
                </div>
                {selectedCity === city && (
                  <Check className="w-4 h-4 text-orange-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LocationSelector;