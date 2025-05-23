import React from 'react';
import { motion } from 'framer-motion';
import FoodCard from './foodcart';

const RecommendationCarousel = ({ items, onAddToCart }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <motion.div 
        className="flex space-x-6 py-4 px-2"
        drag="x"
        dragConstraints={{ right: 0, left: -(items.length * 320) }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex-none w-[300px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FoodCard 
              food={item}
              onAddToCart={onAddToCart}
              compact
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Gradient Shadows */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
    </div>
  );
};

export default RecommendationCarousel;