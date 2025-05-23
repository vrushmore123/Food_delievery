import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FoodCard = ({ food, onAddToCart, compact = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(food, quantity);
    setQuantity(1);
  };

  const toggleFlip = (e) => {
    // Don't flip if clicking on quantity controls or add button
    if (e.target.closest('.no-flip')) return;
    setIsFlipped(!isFlipped);
  };

  if (compact) {
    return (
      <div className="relative group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/5 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          <img src={food.imageUrl} alt={food.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
              food.isVegetarian 
                ? 'bg-green-100/90 text-green-800' 
                : 'bg-red-100/90 text-red-800'
            }`}>
              {food.isVegetarian ? '🌱 Veg' : '🍖 Non-Veg'}
            </span>
          </div>
        </div>

        <div className="p-4 relative z-10">
          <h3 className="font-semibold text-lg mb-1 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{food.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{food.restaurant}</p>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-lg">{food.price} DKK</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-md dark:border-gray-600">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    −
                  </button>
                  <span className="px-3 dark:text-gray-200">{quantity}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(quantity + 1);
                    }}
                    className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={handleAddToCart}
              className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg transition-all duration-300 transform hover:from-orange-600 hover:to-red-600 hover:scale-[1.02] hover:shadow-lg font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[300px] mx-auto">
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div 
            key="front"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer bg-white dark:bg-gray-800"
            onClick={toggleFlip}
          >
            <img 
              src={food.imageUrl} 
              alt={food.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-[calc(100%-192px)]">
              <div>
                <h3 className="font-semibold text-lg dark:text-white">{food.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{food.restaurant}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    food.isVegetarian 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                    {food.isVegetarian ? '🌱 Veg' : '🍖 Non-Veg'}
                  </span>
                  {food.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg dark:text-white">{food.price} DKK</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded-md dark:border-gray-600">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity(Math.max(1, quantity - 1));
                        }}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        −
                      </button>
                      <span className="px-3 dark:text-gray-200">{quantity}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity(quantity + 1);
                        }}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Add to Cart • {food.price * quantity} DKK
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-lg cursor-pointer bg-white dark:bg-gray-800"
            onClick={toggleFlip}
          >
            <div className="p-4 h-full flex flex-col">
              <h3 className="font-semibold text-xl mb-2 dark:text-white">{food.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{food.description}</p>
              
              {food.comboPrice && (
                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    🎉 {food.comboDescription}
                  </p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {food.comboPrice} DKK
                  </p>
                </div>
              )}

              <div className="mt-auto">
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Add to Cart • {food.price * quantity} DKK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodCard;