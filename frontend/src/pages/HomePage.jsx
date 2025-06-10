import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, MapPin, CheckCircle } from 'lucide-react';
import LocationSelector from '../components/LocationSelector';

const HomePage = ({ setLocation }) => {
  // hydrate from localStorage
  const saved = localStorage.getItem('selectedCity') || '';
  const [location, setLocationState] = useState(saved);
  const [showPostalCode, setShowPostalCode] = useState(!!saved);
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  const cities = ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'];

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setLocationState(selectedLocation);
    localStorage.setItem('selectedCity', selectedLocation);
    setShowPostalCode(true);
  };

  const handleAutoDetect = () => {
    // Mock auto-detection
    const detected = 'Copenhagen';
    setLocation(detected);
    setLocationState(detected);
    localStorage.setItem('selectedCity', detected);
    setPostalCode('1050');
    setShowPostalCode(true);
  };

  const handleSubmit = () => {
    navigate('/restaurants');
  };

  const isFormComplete = location && postalCode.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20 dark:border-gray-700/20">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              FoodExpress
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Delicious food delivered to your doorstep
          </p>
        </div>
        
        {/* Horizontal layout for wider screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <LocationSelector 
              cities={cities} 
              onSelect={handleLocationSelect} 
              onAutoDetect={handleAutoDetect}
            />
          </div>
          
          <div className="space-y-4">
            {showPostalCode && (
              <div className="animate-slideDown">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Postal Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-600 rounded-xl p-3 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Enter your postal code..."
                  />
                  {postalCode && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            )}
            
            {/* Premium Next Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete}
              className={`group relative overflow-hidden w-full px-6 py-3 rounded-xl font-bold transition-all duration-500 transform ${
                isFormComplete 
                  ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 cursor-pointer' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {/* Animated background effects - only when enabled */}
              {isFormComplete && (
                <>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute top-2 left-6 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-6 right-8 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-4 left-12 w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-6 right-6 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
                  </div>
                  
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                  
                  {/* Pulse effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                </>
              )}
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isFormComplete && (
                  <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                )}
                
                <span className={`transition-all duration-300 text-sm ${
                  isFormComplete 
                    ? 'bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-white group-hover:to-blue-200' 
                    : ''
                }`}>
                  {isFormComplete ? 'Continue to Restaurants' : 'Complete the form'}
                </span>
                
                {isFormComplete && (
                  <div className="relative">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                    <Zap className="w-2 h-2 absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* Success ripple effect */}
              {isFormComplete && (
                <div className="absolute inset-0 rounded-2xl bg-green-400/20 scale-0 group-active:scale-100 transition-transform duration-200 opacity-0 group-active:opacity-100" />
              )}
            </button>
            
            {/* Progress indicator */}
            {showPostalCode && (
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    postalCode ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
                <span>Step 1 of 3</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;