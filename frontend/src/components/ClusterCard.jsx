import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';

const ClusterCard = ({ cluster, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all duration-200"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {cluster.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Restaurants within {cluster.radius}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="mt-4 py-3 text-center bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors">
        Select Zone
      </div>
    </div>
  );
};

export default ClusterCard;