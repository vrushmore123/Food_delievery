import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FoodCard = ({ food, onAddToCart, compact = false }) => {
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

  const toggleFlip = (e) => {
    if (e.target.closest(".no-flip")) return;
    setIsFlipped(!isFlipped);
  };

  // Toast Notification Component
  const ToastNotification = () => (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              🎉
            </motion.div>
            <div>
              <p className="font-semibold text-sm">Added to Cart!</p>
              <p className="text-xs text-green-100">
                {food.name} × {quantity}
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-white"
            >
              ✨
            </motion.div>
          </div>

          {/* Celebration particles */}
          <div className="absolute -top-2 -right-2">
            <motion.div
              animate={{ y: [-10, -30], opacity: [1, 0] }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-yellow-300 text-sm"
            >
              ⭐
            </motion.div>
          </div>
          <div className="absolute -top-1 -left-2">
            <motion.div
              animate={{ y: [-5, -25], opacity: [1, 0] }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-pink-300 text-sm"
            >
              💫
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const VegIcon = () => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="w-6 h-6 border-2 border-green-600 rounded-sm flex items-center justify-center bg-white shadow-lg"
    >
      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
    </motion.div>
  );

  const NonVegIcon = () => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="w-6 h-6 border-2 border-red-600 rounded-sm flex items-center justify-center bg-white shadow-lg"
    >
      <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
    </motion.div>
  );

  if (compact) {
    return (
      <>
        <ToastNotification />
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative group bg-gradient-to-br from-white via-orange-50/50 to-orange-100/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-orange-100 dark:border-gray-700 h-[340px] flex flex-col backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-orange-400/5 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative overflow-hidden flex-shrink-0">
            <motion.img
              src={food.imageUrl}
              alt={food.name}
              className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 left-3 z-10"
            >
              <div className="flex items-center space-x-2">
                {food.isVegetarian ? <VegIcon /> : <NonVegIcon />}
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-lg ${
                    food.isVegetarian
                      ? "bg-green-100/95 text-green-800 border border-green-200/70"
                      : "bg-red-100/95 text-red-800 border border-red-200/70"
                  }`}
                >
                  {food.isVegetarian ? "VEG" : "NON-VEG"}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 right-3 z-10"
            >
              <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-white/10">
                <span className="text-white text-xs font-medium flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  4.5
                </span>
              </div>
            </motion.div>
          </div>

          <div className="p-4 relative z-10 flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0">
              <motion.h3
                whileHover={{ scale: 1.02 }}
                className="font-bold text-lg mb-1 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent line-clamp-1"
              >
                {food.name}
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mb-2 line-clamp-1">
                <motion.svg
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-3 h-3 mr-1 text-orange-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  ></path>
                </motion.svg>
                <span className="truncate">{food.restaurant}</span>
              </p>
            </div>

            <div className="mt-auto pt-3 border-t border-orange-100 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                  >
                    {food.price}
                  </motion.span>
                  <span className="text-xs ml-1 text-gray-500 font-medium">
                    DKK
                  </span>
                </div>
                <div className="flex items-center space-x-2 no-flip">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center border border-orange-200 rounded-full bg-white dark:bg-gray-700 dark:border-gray-600 shadow-lg"
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      className="px-2 py-1 text-orange-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600 rounded-l-full transition-colors text-sm font-bold"
                    >
                      −
                    </motion.button>
                    <span className="px-2 font-bold dark:text-gray-200 text-sm min-w-[16px] text-center text-orange-600">
                      {quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(quantity + 1);
                      }}
                      className="px-2 py-1 text-orange-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600 rounded-r-full transition-colors text-sm font-bold"
                    >
                      +
                    </motion.button>
                  </motion.div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`no-flip w-full py-2.5 rounded-xl transition-all duration-300 font-bold flex items-center justify-center space-x-2 text-sm shadow-lg ${
                  isAdding
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white hover:shadow-xl"
                }`}
              >
                {isAdding ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <motion.svg
                      whileHover={{ rotate: 15 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </motion.svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <ToastNotification />
      <div className="w-full max-w-[320px] mx-auto">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, rotateY: -15 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 15 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-gradient-to-br from-white via-pink-50/50 to-pink-100/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-pink-200 dark:border-gray-600 hover:shadow-pink-500/20 transition-all duration-500 flex flex-col backdrop-blur-sm"
              onClick={toggleFlip}
            >
              <div className="relative flex-shrink-0">
                <motion.img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute top-4 left-4">
                  <div className="flex flex-wrap gap-2">
                    {food.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <span className="text-white text-sm font-medium flex items-center">
                    <span className="mr-2">✨</span>
                    Click for details
                  </span>
                </motion.div>
              </div>

              <div className="p-4 flex flex-col flex-1 min-h-0">
                <div className="flex-1 min-h-0">
                  <motion.h3
                    whileHover={{ scale: 1.02 }}
                    className="font-bold text-lg mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent line-clamp-1"
                  >
                    {food.name}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mb-3 line-clamp-1">
                    <svg
                      className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="truncate">{food.restaurant}</span>
                  </p>
                  {/* Add cuisine tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {food.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline">
                      <span className="font-bold text-xl dark:text-white">
                        {food.price}
                      </span>
                      <span className="text-sm ml-1 text-gray-500">DKK</span>
                    </div>
                    <div className="flex items-center space-x-2 no-flip">
                      <div className="flex items-center border rounded-full dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuantity(Math.max(1, quantity - 1));
                          }}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-full"
                        >
                          −
                        </button>
                        <span className="px-2 dark:text-gray-200 min-w-[24px] text-center text-sm">
                          {quantity}
                        </span>
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
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`no-flip w-full py-3 rounded-xl transition-all duration-300 font-bold text-sm shadow-lg ${
                      isAdding
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white hover:shadow-xl"
                    }`}
                  >
                    {isAdding ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Adding...</span>
                      </div>
                    ) : (
                      `Add to Cart • ${food.price * quantity} DKK`
                    )}
                  </motion.button>
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
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-gradient-to-br from-white via-pink-50/50 to-pink-100/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-pink-200 dark:border-gray-600 hover:shadow-pink-500/20 transition-all duration-500 flex flex-col backdrop-blur-sm"
              onClick={toggleFlip}
            >
              <div className="p-4 h-full flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent line-clamp-1 flex-1">
                    {food.name}
                  </h3>
                  <div className="flex items-center space-x-2 ml-2">
                    {food.isVegetarian ? <VegIcon /> : <NonVegIcon />}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed flex-shrink-0 line-clamp-2">
                  {food.description}
                </p>

                <div className="mb-4 space-y-3 flex-1 min-h-0 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 text-xs mb-1">
                        ✓ DIETARY
                      </h4>
                      <div className="space-y-1">
                        {food.isVegetarian && (
                          <span className="block text-xs text-green-700 dark:text-green-300">
                            Vegetarian
                          </span>
                        )}
                        {food.isGlutenFree && (
                          <span className="block text-xs text-green-700 dark:text-green-300">
                            Gluten Free
                          </span>
                        )}
                        {food.isVegan && (
                          <span className="block text-xs text-green-700 dark:text-green-300">
                            Vegan
                          </span>
                        )}
                        {food.isOrganic && (
                          <span className="block text-xs text-green-700 dark:text-green-300">
                            Organic
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-xs mb-1">
                        🔥 INFO
                      </h4>
                      <div className="space-y-1">
                        <span className="block text-xs text-blue-700 dark:text-blue-300">
                          Cal: {food.calories || "250"}
                        </span>
                        <span className="block text-xs text-blue-700 dark:text-blue-300">
                          Time: {food.prepTime || "15m"}
                        </span>
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
                      <span className="font-bold text-xl dark:text-white">
                        {food.price}
                      </span>
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
                        <span className="px-2 dark:text-gray-200 text-sm">
                          {quantity}
                        </span>
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
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`no-flip w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-lg font-medium text-sm`}
                  >
                    {/* Content for Add to Cart button on the back is slightly different, ensure it's handled if isAdding is true */}
                    {isAdding ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Adding...</span>
                      </div>
                    ) : (
                      `Add to Cart • ${food.price * quantity} DKK`
                    )}
                  </motion.button>
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
