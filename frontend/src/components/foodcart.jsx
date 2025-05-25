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
    if (e.target.closest('.no-flip')) return;
    setIsFlipped(!isFlipped);
  };

  const VegIcon = () => (
    <div className="w-6 h-6 border-2 border-green-600 rounded-sm flex items-center justify-center bg-white">
      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
    </div>
  );

  const NonVegIcon = () => (
    <div className="w-6 h-6 border-2 border-red-600 rounded-sm flex items-center justify-center bg-white">
      <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
    </div>
  );

  if (compact) {
    return (
      <div className="relative group bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border border-gray-100 dark:border-gray-700 h-[340px] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-orange-400/10 to-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative overflow-hidden flex-shrink-0">
          <img src={food.imageUrl} alt={food.name} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center space-x-2">
              {food.isVegetarian ? <VegIcon /> : <NonVegIcon />}
              <span className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${
                food.isVegetarian 
                  ? 'bg-green-100/90 text-green-800 border border-green-200/50' 
                  : 'bg-red-100/90 text-red-800 border border-red-200/50'
              }`}>
                {food.isVegetarian ? 'VEG' : 'NON-VEG'}
              </span>
            </div>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-white text-xs font-medium">⭐ 4.5</span>
            </div>
          </div>
        </div>

        <div className="p-4 relative z-10 flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0">
            <h3 className="font-bold text-lg mb-1 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent line-clamp-1">{food.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mb-2 line-clamp-1">
              <svg className="w-3 h-3 mr-1 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
              </svg>
              <span className="truncate">{food.restaurant}</span>
            </p>
          </div>
          
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline">
                <span className="font-bold text-lg text-gray-800 dark:text-white">{food.price}</span>
                <span className="text-xs ml-1 text-gray-500">DKK</span>
              </div>
              <div className="flex items-center space-x-2 no-flip">
                <div className="flex items-center border rounded-full bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-full transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="px-2 font-medium dark:text-gray-200 text-sm min-w-[16px] text-center">{quantity}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(quantity + 1);
                    }}
                    className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-full transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={handleAddToCart}
              className="no-flip w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl transition-all duration-300 transform hover:from-orange-600 hover:to-red-600 hover:shadow-lg font-medium flex items-center justify-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[320px] mx-auto">
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div 
            key="front"
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 15 }}
            transition={{ duration: 0.3 }}
            className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-300 flex flex-col"
            onClick={toggleFlip}
          >
            <div className="relative flex-shrink-0">
              <img 
                src={food.imageUrl} 
                alt={food.name} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-2">
                  {food.isVegetarian ? <VegIcon /> : <NonVegIcon />}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${
                    food.isVegetarian 
                      ? 'bg-green-100/90 text-green-800 border border-green-200/50' 
                      : 'bg-red-100/90 text-red-800 border border-red-200/50'
                  }`}>
                    {food.isVegetarian ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">Click for details</span>
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0">
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent line-clamp-1">{food.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mb-3 line-clamp-1">
                  <svg className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                  <span className="truncate">{food.restaurant}</span>
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {food.tags && food.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full truncate">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline">
                    <span className="font-bold text-xl dark:text-white">{food.price}</span>
                    <span className="text-sm ml-1 text-gray-500">DKK</span>
                  </div>
                  <div className="flex items-center space-x-2 no-flip">
                    <div className="flex items-center border rounded-full dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity(Math.max(1, quantity - 1));
                        }}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-full transition-colors"
                      >
                        −
                      </button>
                      <span className="px-2 dark:text-gray-200 min-w-[24px] text-center text-sm">{quantity}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity(quantity + 1);
                        }}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-full transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="no-flip w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl transition-all duration-300 transform hover:from-orange-600 hover:to-red-600 hover:shadow-lg font-medium text-sm"
                >
                  Add to Cart • {food.price * quantity} DKK
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="back"
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 15 }}
            transition={{ duration: 0.3 }}
            className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 flex flex-col"
            onClick={toggleFlip}
          >
            <div className="p-4 h-full flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h3 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent line-clamp-1 flex-1">{food.name}</h3>
                <div className="flex items-center space-x-2 ml-2">
                  {food.isVegetarian ? <VegIcon /> : <NonVegIcon />}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed flex-shrink-0 line-clamp-2">{food.description}</p>
              
              <div className="mb-4 space-y-3 flex-1 min-h-0 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 text-xs mb-1">✓ DIETARY</h4>
                    <div className="space-y-1">
                      {food.isVegetarian && <span className="block text-xs text-green-700 dark:text-green-300">Vegetarian</span>}
                      {food.isGlutenFree && <span className="block text-xs text-green-700 dark:text-green-300">Gluten Free</span>}
                      {food.isVegan && <span className="block text-xs text-green-700 dark:text-green-300">Vegan</span>}
                      {food.isOrganic && <span className="block text-xs text-green-700 dark:text-green-300">Organic</span>}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-xs mb-1">🔥 INFO</h4>
                    <div className="space-y-1">
                      <span className="block text-xs text-blue-700 dark:text-blue-300">Cal: {food.calories || '250'}</span>
                      <span className="block text-xs text-blue-700 dark:text-blue-300">Time: {food.prepTime || '15m'}</span>
                    </div>
                  </div>
                </div>

                {food.comboPrice && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-400">
                    <p className="text-xs font-medium text-orange-800 dark:text-orange-200 mb-1">
                      🎉 {food.comboDescription}
                    </p>
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {food.comboPrice} DKK
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline">
                    <span className="font-bold text-xl dark:text-white">{food.price}</span>
                    <span className="text-sm ml-1 text-gray-500">DKK</span>
                  </div>
                  <div className="flex items-center space-x-2 no-flip">
                    <div className="flex items-center border rounded-full dark:border-gray-600 bg-white dark:bg-gray-700">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity(Math.max(1, quantity - 1));
                        }}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-full"
                      >
                        −
                      </button>
                      <span className="px-2 dark:text-gray-200 text-sm">{quantity}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuantity(quantity + 1);
                        }}
                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-full"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="no-flip w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-lg font-medium text-sm"
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