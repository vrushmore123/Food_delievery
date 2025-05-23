import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationSelector from '../components/LocationSelector';
const HomePage = ({ setLocation }) => {
  const [postalCode, setPostalCode] = useState('');
  const [showPostalCode, setShowPostalCode] = useState(false);
  const navigate = useNavigate();

  const cities = ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'];

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowPostalCode(true);
  };

  const handleAutoDetect = () => {
    // Mock auto-detection
    setLocation('Copenhagen');
    setPostalCode('1050');
    setShowPostalCode(true);
  };

  const handleSubmit = () => {
    navigate('/restaurants');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to FoodExpress</h1>
        
        <LocationSelector 
          cities={cities} 
          onSelect={handleLocationSelect} 
          onAutoDetect={handleAutoDetect}
        />
        
        {showPostalCode && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter postal code"
            />
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!location}
          className={`mt-6 w-full py-2 px-4 rounded-md text-white ${location ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;