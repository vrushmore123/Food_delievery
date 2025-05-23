import React from 'react';
import FoodCard from './foodcart';

const RecommendationCarousel = ({ items, onAddToCart }) => {
  return (
    <div className="relative">
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4">
          {items.map(item => (
            <div key={item.id} className="flex-none w-64">
              <FoodCard 
                food={item}
                onAddToCart={onAddToCart}
                compact
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCarousel;