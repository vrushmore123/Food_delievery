import React from 'react';
import { motion } from 'framer-motion';
import FoodCard from './foodcart';

const RecommendationCarousel = ({ items, onAddToCart }) => {
  // Random food images from the internet
  const foodImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1613564834361-9436948817d1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1580013759032-c96505d22813?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop'
  ];

  // Enhance items with images if they don't have them
  const enhancedItems = items.map((item, index) => ({
    ...item,
    imageUrl: item.imageUrl || foodImages[index % foodImages.length],
    // Ensure all dietary properties are present
    isGlutenFree: item.isGlutenFree ?? Math.random() > 0.7,
    isOrganic: item.isOrganic ?? Math.random() > 0.8,
    calories: item.calories ?? Math.floor(Math.random() * (500 - 150) + 150),
    prepTime: item.prepTime ?? `${Math.floor(Math.random() * (30 - 10) + 10)} min`,
  }));

  const dragConstraints = {
    right: 0,
    left: Math.min(0, -(enhancedItems.length * 280 - window.innerWidth + 100))
  };

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div 
        className="flex space-x-6 py-4 px-2 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {enhancedItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex-none w-[260px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <FoodCard 
              food={item}
              onAddToCart={onAddToCart}
              compact
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Enhanced Gradient Shadows */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-orange-50 dark:from-gray-900 via-orange-50/80 dark:via-gray-900/80 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-orange-50 dark:from-gray-900 via-orange-50/80 dark:via-gray-900/80 to-transparent pointer-events-none z-10" />
      
      {/* Navigation Hint */}
      <div className="absolute bottom-2 right-4 z-10">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-xs font-medium">← Drag to explore →</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCarousel;