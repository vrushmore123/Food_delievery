import React, { useState, useEffect } from 'react';
import { foodImages } from '../assets/mockFoodImages';

const CalendarOrder = ({ foodItems, onClose, onAddToCart, cart, onProceedToPay }) => {
  const [duration, setDuration] = useState('week');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Generate dates based on duration
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const daysInDuration = duration === 'week' ? 7 : 30;
    
    for (let i = 0; i < daysInDuration; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Initialize quantities when duration changes
  useEffect(() => {
    const initialQuantities = {};
    generateDates().forEach(date => {
      const dateStr = date.toDateString();
      initialQuantities[dateStr] = quantities[dateStr] || 1;
    });
    setQuantities(initialQuantities);
  }, [duration]);

  // Handle drag start for food items
  const handleDragStart = (foodId) => {
    setDraggedItem(foodId);
  };

  // Handle drop on calendar dates
  const handleDrop = (date) => {
    if (draggedItem) {
      const dateStr = date.toDateString();
      setSelectedFoods(prev => ({
        ...prev,
        [dateStr]: draggedItem,
      }));
      setDraggedItem(null);
    }
  };

  // Handle drag over (required for drop)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Add random images to food items
  const foodItemsWithImages = foodItems.map((item, index) => ({
    ...item,
    imageUrl: foodImages[index % foodImages.length],
  }));

  // Add selected items to cart
  const handleAddSelectedToCart = () => {
    Object.entries(selectedFoods).forEach(([dateStr, foodId]) => {
      if (foodId) {
        const foodItem = foodItemsWithImages.find(f => f.id === foodId);
        if (foodItem) {
          onAddToCart(foodItem, quantities[dateStr] || 1);
        }
      }
    });
    onClose();
  };

  // Remove food from specific date
  const removeFoodFromDate = (date) => {
    const dateStr = date.toDateString();
    setSelectedFoods(prev => {
      const updated = { ...prev };
      delete updated[dateStr];
      return updated;
    });
  };

  // Increase quantity for specific date
  const increaseQuantity = (date) => {
    const dateStr = date.toDateString();
    setQuantities(prev => ({
      ...prev,
      [dateStr]: (prev[dateStr] || 1) + 1
    }));
  };

  // Decrease quantity for specific date
  const decreaseQuantity = (date) => {
    const dateStr = date.toDateString();
    setQuantities(prev => ({
      ...prev,
      [dateStr]: Math.max(1, (prev[dateStr] || 1) - 1)
    }));
  };

  // Calculate total items and price
  const calculateOrderSummary = () => {
    let totalItems = 0;
    let totalPrice = 0;

    Object.entries(selectedFoods).forEach(([dateStr, foodId]) => {
      if (foodId) {
        const foodItem = foodItemsWithImages.find(f => f.id === foodId);
        if (foodItem) {
          const qty = quantities[dateStr] || 1;
          totalItems += qty;
          totalPrice += foodItem.price * qty;
        }
      }
    });

    return { totalItems, totalPrice };
  };

  const { totalItems, totalPrice } = calculateOrderSummary();
  const deliveryFee = 29;
  const total = totalPrice + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800/50 dark:to-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Plan Your {duration === 'week' ? 'Weekly' : 'Monthly'} Meals
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Duration Tabs */}
        <div className="px-6 pt-6">
          <div className="flex space-x-4 mb-6">
            {['week', 'month'].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  duration === d 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-orange-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                {d === 'week' ? 'Weekly' : 'Monthly'} Plan
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 px-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Available Meals */}
            <div className="flex flex-col bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Available Meals
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
                  {foodItemsWithImages.map(food => (
                    <div 
                      key={food.id}
                      draggable
                      onDragStart={() => handleDragStart(food.id)}
                      className="group bg-white dark:bg-gray-700 rounded-xl p-3 cursor-move hover:shadow-lg transition-all duration-300 border border-orange-100/50 dark:border-gray-600"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={food.imageUrl} alt={food.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-orange-500 transition-colors">
                            {food.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{food.restaurant}</p>
                          <p className="text-orange-600 dark:text-orange-400 font-semibold mt-1">
                            {food.price} DKK
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex flex-col bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Your Meal Plan
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-7 gap-3">
                  {generateDates().map(date => (
                    <div 
                      key={date.toDateString()}
                      onDrop={() => handleDrop(date)}
                      onDragOver={handleDragOver}
                      className={`p-2 text-center rounded-md min-h-24 ${selectedFoods[date.toDateString()] ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                    >
                      <div className="text-xs font-medium">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-sm mb-1">
                        {date.getDate()}
                      </div>
                      
                      {selectedFoods[date.toDateString()] && (
                        <div className="relative">
                          <div className="bg-white p-1 rounded border border-gray-200">
                            <div className="flex items-center">
                              <img 
                                src={foodItemsWithImages.find(f => f.id === selectedFoods[date.toDateString()])?.imageUrl} 
                                alt="Food" 
                                className="w-6 h-6 object-cover rounded mr-1" 
                              />
                              <span className="text-xs truncate">
                                {foodItemsWithImages.find(f => f.id === selectedFoods[date.toDateString()])?.name}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <button 
                                onClick={() => decreaseQuantity(date)}
                                className="text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-xs">
                                {quantities[date.toDateString()] || 1}
                              </span>
                              <button 
                                onClick={() => increaseQuantity(date)}
                                className="text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFoodFromDate(date)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800/50 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300">Total Items:</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300">Total Amount:</span>
                <span className="font-semibold">{total} DKK</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleAddSelectedToCart}
                disabled={totalItems === 0}
                className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart ({totalItems})
              </button>
              <button 
                onClick={() => {
                  handleAddSelectedToCart();
                  onProceedToPay();
                }}
                disabled={totalItems === 0}
                className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Pay ({total} DKK)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarOrder;