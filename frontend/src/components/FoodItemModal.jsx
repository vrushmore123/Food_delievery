import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Plus, Minus, ShoppingCart, Heart } from 'lucide-react';

const FoodItemModal = ({ item, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    setTimeout(() => {
      onAddToCart(item, quantity);
      setIsAdding(false);
      onClose();
      setQuantity(1);
    }, 500);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header with Image */}
            <div className="relative">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&auto=format`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full hover:bg-white transition-colors shadow-lg z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Favorite button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg z-10"
              >
                <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>

              {/* Bottom overlay with key info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">
                        {item.rating || "4.5"}
                      </span>
                    </div>
                    
                    {item.isVegetarian ? (
                      <div className="w-6 h-6 border-2 border-green-500 rounded-sm flex items-center justify-center bg-white">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-red-500 rounded-sm flex items-center justify-center bg-white">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {item.price} <span className="text-lg text-gray-200">DKK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {/* Title and Restaurant */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h2>
                <div className="flex items-center text-gray-600 mb-3">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{item.restaurant}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{item.prepTime || "15-20 min"} • {item.calories || "320"} cal</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {item.description || "A delicious and carefully prepared dish made with fresh, high-quality ingredients. Perfect for any time of the day when you want something special and satisfying."}
                </p>
              </div>

              {/* Key Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Ingredients */}
                {item.ingredients && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dietary Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Info</h3>
                  <div className="space-y-2">
                    {item.isVegetarian && (
                      <div className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                        Vegetarian
                      </div>
                    )}
                    {item.isVegan && (
                      <div className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                        Vegan
                      </div>
                    )}
                    {item.isGlutenFree && (
                      <div className="flex items-center text-blue-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        Gluten Free
                      </div>
                    )}
                    {item.isLactoseFree && (
                      <div className="flex items-center text-purple-700">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                        Lactose Free
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Nutritional Information */}
              {item.nutritionalInfo && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Facts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(item.nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-500 capitalize font-medium">{key}</div>
                        <div className="text-lg font-bold text-gray-900 mt-1">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with quantity and add to cart */}
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between gap-6">
                {/* Quantity selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border-2 border-orange-200 rounded-xl bg-white">
                    <button
                      onClick={decreaseQuantity}
                      className="p-3 hover:bg-orange-50 text-orange-600 transition-colors rounded-l-xl"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-3 font-bold text-xl text-gray-900 min-w-[80px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="p-3 hover:bg-orange-50 text-orange-600 transition-colors rounded-r-xl"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
                    isAdding
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding to Cart...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      <span>Add {quantity} to Cart • {(item.price * quantity).toFixed(0)} DKK</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FoodItemModal;
