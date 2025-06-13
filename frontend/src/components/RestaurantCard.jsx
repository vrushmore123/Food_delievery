import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';

const RestaurantCard = ({ restaurant, onSelect }) => {
  // Professional restaurant images
  const restaurantImages = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=500&h=300&fit=crop&auto=format'
  ];

  const imageUrl = restaurant.imageUrl || restaurantImages[restaurant.id % restaurantImages.length];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group border border-gray-100"
      onClick={() => onSelect(restaurant)}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = restaurantImages[0];
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-800">
              {restaurant.rating}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Open Now
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1 text-orange-500" />
              <span className="line-clamp-1">{restaurant.address}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {restaurant.specialties?.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-100"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            <span>25-35 min</span>
          </div>
          <div className="text-sm text-gray-600">
            Free delivery
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
