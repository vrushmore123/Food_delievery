import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FoodCard = ({ food, onAddToCart, compact = false, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);

    // Add to cart with delay for animation
    setTimeout(() => {
      onAddToCart(food, quantity);
      setIsAdding(false);
      setShowToast(true);
      setQuantity(1);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 500);
  };

  const handleCardClick = (e) => {
    // Don't trigger modal if clicking on quantity controls or add to cart button
    if (e.target.closest(".no-flip")) return;

    if (onClick) {
      onClick(food);
    }
  };

  const VegIcon = () => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="w-5 h-5 border-2 border-green-600 rounded-sm flex items-center justify-center bg-white shadow-sm"
    >
      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
    </motion.div>
  );

  const NonVegIcon = () => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="w-5 h-5 border-2 border-red-600 rounded-sm flex items-center justify-center bg-white shadow-sm"
    >
      <div className="w-2 h-2 bg-red-600 rounded-sm"></div>
    </motion.div>
  );

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <div>
              <p className="font-semibold text-sm">Added to Cart!</p>
              <p className="text-xs opacity-90">
                {food.name} × {quantity}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-[320px] mx-auto">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, rotateY: -15 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 15 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onHoverStart={() => setIsFlipped(true)}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group h-[420px] flex flex-col"
              onClick={handleCardClick}
            >
              <div className="relative overflow-hidden flex-shrink-0">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format`;
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Dietary badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  <div className="flex items-center space-x-1">
                    {food.isVegetarian ? <VegIcon /> : <NonVegIcon />}
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-lg ${
                        food.isVegetarian
                          ? "bg-green-100/95 text-green-800 border border-green-200/70"
                          : "bg-red-100/95 text-red-800 border border-red-200/70"
                      }`}
                    >
                      {food.isVegetarian ? "VEG" : "NON-VEG"}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                  <span className="text-sm font-medium text-gray-800 flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {food.rating || "4.5"}
                  </span>
                </div>

                {/* Click indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-2 rounded-full border border-white/20"
                >
                  <span className="text-white text-sm font-medium flex items-center">
                    <span className="mr-2">👆</span>
                    Click for details
                  </span>
                </motion.div>
              </div>

              <div className="p-4 flex flex-col flex-1 min-h-0">
                <div className="flex-1 min-h-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                    {food.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    <svg
                      className="w-3 h-3 mr-1 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {food.restaurant}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {food.description}
                  </p>
                </div>

                <div className="mt-auto flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-orange-600">
                        {food.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">DKK</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {food.prepTime || "15-20 min"}
                    </span>
                  </div>

                  {/* Quick add button on front */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 no-flip ${
                      isAdding
                        ? "bg-green-600 text-white"
                        : "bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isAdding ? "Adding..." : "Quick Add to Cart"}
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
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onHoverEnd={() => setIsFlipped(false)}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group h-[420px] flex flex-col"
              onClick={handleCardClick}
            >
              <div className="p-4 h-full flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1">
                    {food.name}
                  </h3>
                  <div className="flex items-center space-x-2 ml-2">
                    {food.isVegetarian ? <VegIcon /> : <NonVegIcon />}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-shrink-0 line-clamp-2">
                  {food.description}
                </p>

                <div className="mb-4 space-y-3 flex-1 min-h-0 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <h4 className="font-semibold text-green-800 text-xs mb-1">
                        ✓ DIETARY
                      </h4>
                      <div className="space-y-1">
                        {food.isVegetarian && (
                          <span className="block text-xs text-green-700">
                            Vegetarian
                          </span>
                        )}
                        {food.isGlutenFree && (
                          <span className="block text-xs text-green-700">
                            Gluten Free
                          </span>
                        )}
                        {food.isVegan && (
                          <span className="block text-xs text-green-700">
                            Vegan
                          </span>
                        )}
                        {food.isOrganic && (
                          <span className="block text-xs text-green-700">
                            Organic
                          </span>
                        )}
                        {food.isLactoseFree && (
                          <span className="block text-xs text-green-700">
                            Lactose Free
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-2 rounded-lg">
                      <h4 className="font-semibold text-blue-800 text-xs mb-1">
                        🔥 INFO
                      </h4>
                      <div className="space-y-1">
                        <span className="block text-xs text-blue-700">
                          Cal: {food.calories || "250"}
                        </span>
                        <span className="block text-xs text-blue-700">
                          Time: {food.prepTime || "15m"}
                        </span>
                        <span className="block text-xs text-blue-700">
                          Rating: ★{food.rating || "4.5"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Allergen Information */}
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 text-xs mb-1">
                      ⚠️ ALLERGENS
                    </h4>
                    <div className="space-y-1">
                      {food.allergens?.map((allergen, index) => (
                        <span key={index} className="block text-xs text-yellow-700">
                          {allergen}
                        </span>
                      )) || (
                        <span className="block text-xs text-yellow-700">
                          May contain traces of nuts
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Special offers */}
                  {food.comboPrice && (
                    <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                      <p className="text-xs font-medium text-orange-800 mb-1">
                        🎉 {food.comboDescription}
                      </p>
                      <p className="text-sm font-bold text-orange-600">
                        {food.comboPrice} DKK
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-orange-600">
                        {food.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">DKK</span>
                    </div>
                  </div>

                  {/* Click to see more button on back */}
                  <button
                    onClick={handleCardClick}
                    className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                  >
                    Click for Full Details & Order
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default FoodCard;
