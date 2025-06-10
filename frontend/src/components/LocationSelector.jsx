import React, { useState, useEffect } from 'react';
import { MapPin, Locate, ChevronDown, Search, Check, AlertCircle, Loader2, Navigation, Sparkles, Zap } from 'lucide-react';

const LocationSelector = ({ cities, onSelect, onAutoDetect }) => {
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
    localStorage.setItem('selectedCity', city); // Persist selected city
    setIsOpen(false);
    onSelect(city);
    setError('');
  };

  return (
    <div className="space-y-4 w-full">
      {/* Compact Header Section */}
      <div className="text-left space-y-2">
        <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          Choose Location
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          Select your city to see available restaurants
        </p>
      </div>

      {/* Location Selection */}
      <div className="space-y-3">
        <div className="relative">
          <label 
            htmlFor="location-search"
            className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-orange-500" />
            Find your city
          </label>
          
          {/* Custom Search/Select Input */}
          <div className="relative">
            <div 
              className={`w-full bg-white dark:bg-gray-800 border-2 rounded-xl p-3 text-gray-800 dark:text-gray-200 focus-within:ring-2 focus-within:ring-orange-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ${
                isOpen ? 'border-orange-500 ring-2 ring-orange-500' : 
                error ? 'border-red-400' : 'border-orange-200 dark:border-gray-600 hover:border-orange-300'
              }`}
              onClick={() => setIsOpen(true)}
            >
              <div className="flex items-center justify-between">
                <input
                  id="location-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  placeholder="Search or select your city..."
                  className="flex-1 bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  role="combobox"
                />
                <div className="flex items-center gap-2">
                  {selectedCity && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  <ChevronDown 
                    className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>
            </div>

            {/* Dropdown List */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredCities.length > 0 ? (
                  <div className="p-2">
                    {filteredCities.map((city, index) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                          selectedCity === city 
                            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                        role="option"
                        aria-selected={selectedCity === city}
                      >
                        <span className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                          {city}
                        </span>
                        {selectedCity === city && (
                          <Check className="w-4 h-4 text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No cities found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Compact Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
              or
            </span>
          </div>
        </div>

        {/* Compact Auto-detect Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAutoDetect}
            disabled={isDetecting}
            className="group relative overflow-hidden px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 disabled:cursor-not-allowed disabled:transform-none text-sm"
            aria-label="Automatically detect your current location"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="absolute top-6 right-8 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-4 left-12 w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-6 right-4 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
            </div>
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            
            {/* Icon container with special effects */}
            <div className="relative flex items-center justify-center">
              {isDetecting ? (
                <div className="relative">
                  <Loader2 className="w-4 h-4 relative z-10 animate-spin" />
                  <div className="absolute inset-0 w-4 h-4 border-2 border-white/30 rounded-full animate-ping" />
                </div>
              ) : (
                <div className="relative">
                  <Navigation className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                </div>
              )}
            </div>
            
            {/* Text with gradient */}
            <span className="relative z-10 text-sm font-semibold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-white group-hover:to-blue-200 transition-all duration-500">
              {isDetecting ? (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                  Detecting location...
                </span>
              ) : (
                'Use my current location'
              )}
            </span>
            
            {/* Hover ripple effect */}
            <div className="absolute inset-0 rounded-2xl bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LocationSelector;