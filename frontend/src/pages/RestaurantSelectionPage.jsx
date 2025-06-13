import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClusterCard from '../components/ClusterCard';
import Navbar from '../components/Navbar';

const RestaurantSelectionPage = ({ location, clusters, setCluster }) => {
  const navigate = useNavigate();

  const handleClusterSelect = (cluster) => {
    setCluster(cluster);
    localStorage.setItem('selectedCluster', JSON.stringify(cluster));
    navigate('/restaurant/all'); // Navigate to the restaurant page with all restaurants
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar location={location} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Delivery Zone in <span className="text-orange-600">{location}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose how far you're willing to order from to see the best restaurants available to you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {clusters.map(cluster => (
            <ClusterCard 
              key={cluster.id}
              cluster={cluster}
              onSelect={() => handleClusterSelect(cluster)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantSelectionPage;
