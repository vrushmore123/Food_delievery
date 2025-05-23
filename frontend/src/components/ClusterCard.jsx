import React, { useState } from 'react';
import { ChevronRight, MapPin, Star } from 'lucide-react';

const ClusterCard = ({ cluster, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-orange-200/50 cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-white hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/20"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-400/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
              {cluster.name}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Restaurants within {cluster.radius} radius
            </p>
          </div>
          <div className="text-orange-500 group-hover:text-orange-600 transition-colors">
            <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="mt-4 py-3 text-center bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-xl font-semibold hover:from-orange-500 hover:to-orange-400 hover:text-white transition-all duration-300 group-hover:shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            Select Cluster
            <Star className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClusterCard;