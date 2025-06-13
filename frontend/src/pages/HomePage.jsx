import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle, Settings } from 'lucide-react';
import LocationSelector from '../components/LocationSelector';

const HomePage = ({ setLocation }) => {
  // hydrate from localStorage
  const saved = localStorage.getItem('selectedCity') || '';
  const [location, setLocationState] = useState(saved);
  const [showPostalCode, setShowPostalCode] = useState(!!saved);
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  // Major Danish cities with postal codes
  const cities = ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg'];

  // Postal code mapping for major Danish cities
  const cityPostalCodes = {
    'Copenhagen': '1000',
    'Aarhus': '8000',
    'Odense': '5000',
    'Aalborg': '9000'
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setLocationState(selectedLocation);
    localStorage.setItem('selectedCity', selectedLocation);
    
    // Auto-fill postal code based on selected city
    const autoPostalCode = cityPostalCodes[selectedLocation] || '';
    setPostalCode(autoPostalCode);
    setShowPostalCode(true);
  };

  const handleAutoDetect = () => {
    // Mock auto-detection - randomly select a city for demonstration
    const randomCities = ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg'];
    const detected = randomCities[Math.floor(Math.random() * randomCities.length)];
    
    setLocation(detected);
    setLocationState(detected);
    localStorage.setItem('selectedCity', detected);
    
    // Set corresponding postal code
    const autoPostalCode = cityPostalCodes[detected];
    setPostalCode(autoPostalCode);
    setShowPostalCode(true);
  };

  const handleSubmit = () => {
    navigate('/restaurants');
  };

  const isFormComplete = location && postalCode.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 relative">
      {/* Professional Admin Access Button */}
      <button 
        onClick={() => navigate('/adminDashboard')}
        className="absolute top-6 right-6 flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-200/50 shadow-sm"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Admin Panel</span>
      </button>

      {/* Main Professional Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 w-full max-w-lg overflow-hidden">
        {/* Header Section */}
        <div className="text-center pt-8 px-8 pb-6 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FoodExpress</h1>
          <p className="text-gray-600">Professional Food Delivery Service</p>
        </div>

        {/* Form Section */}
        <div className="px-8 py-6">
          <div className="space-y-6">
            {/* Location Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Your City
              </label>
              <LocationSelector 
                cities={cities} 
                cityPostalCodes={cityPostalCodes}
                onSelect={handleLocationSelect} 
                onAutoDetect={handleAutoDetect}
              />
            </div>

            {/* Postal Code Input */}
            {showPostalCode && (
              <div className="animate-slideDown">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Postal Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Postal code auto-filled"
                    maxLength={5}
                  />
                  {postalCode && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Postal code automatically filled for {location}
                </p>
              </div>
            )}

            {/* Continue Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold text-base transition-all duration-200 ${
                  isFormComplete 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Continue to Restaurants</span>
                {isFormComplete && <ArrowRight className="ml-2 w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Professional Status Section */}
        {location && (
          <div className="border-t border-gray-200 bg-orange-50/50 px-8 py-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Selected City:</span>
                <span className="font-medium text-gray-900">{location}</span>
              </div>
              {postalCode && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Postal Code:</span>
                  <span className="font-medium text-gray-900">{postalCode}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Ready to Order</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;