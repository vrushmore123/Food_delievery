import React, { useState } from 'react';
import { MapPin, Locate, ChevronDown } from 'lucide-react';

const LocationSelector = ({ cities, onSelect, onAutoDetect }) => {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <div className="space-y-6">
      <div className="relative">
        <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          Select your location
        </label>
        
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              onSelect(e.target.value);
            }}
            className="w-full bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-xl p-4 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 appearance-none cursor-pointer hover:bg-white hover:border-orange-300 shadow-lg"
          >
            <option value="" className="bg-white text-gray-800">Choose a city</option>
            {cities.map(city => (
              <option key={city} value={city} className="bg-white text-gray-800">{city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onAutoDetect}
          className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/25 hover:shadow-xl flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Locate className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Detect my location automatically</span>
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;