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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Plan Your {duration === 'week' ? 'Weekly' : 'Monthly'} Meals</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setDuration('week')}
              className={`px-4 py-2 rounded-md ${duration === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Order for Week
            </button>
            <button 
              onClick={() => setDuration('month')}
              className={`px-4 py-2 rounded-md ${duration === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Order for Month
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
            <div className="overflow-hidden flex flex-col">
              <h3 className="font-medium mb-4">Available Meals</h3>
              <div 
                className="grid grid-cols-2 gap-4 overflow-y-auto p-2 flex-1"
                onDragOver={handleDragOver}
              >
                {foodItemsWithImages.map(food => (
                  <div 
                    key={food.id}
                    draggable
                    onDragStart={() => handleDragStart(food.id)}
                    className="border rounded-md p-3 cursor-move hover:bg-gray-50 flex items-center"
                  >
                    <img src={food.imageUrl} alt={food.name} className="w-12 h-12 object-cover rounded mr-3" />
                    <div>
                      <h4 className="text-sm font-medium">{food.name}</h4>
                      <p className="text-xs text-gray-600">{food.price} DKK</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="overflow-hidden flex flex-col">
              <h3 className="font-medium mb-4">Your Meal Plan</h3>
              <div className="grid grid-cols-7 gap-2 mb-4 overflow-y-auto flex-1">
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
              
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <h4 className="font-medium text-sm mb-2">How it works:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Drag and drop meals to your desired dates</li>
                  <li>Adjust quantities using + and - buttons</li>
                  <li>Remove meals by clicking the × button</li>
                  <li>Click "Add to Cart" when you're ready</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="flex justify-between mb-1">
                  <span>Subtotal:</span>
                  <span>{totalPrice} DKK</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Delivery fee:</span>
                  <span>{deliveryFee} DKK</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{total} DKK</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleAddSelectedToCart}
                  disabled={totalItems === 0}
                  className={`px-4 py-2 rounded-md ${totalItems > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Add to Cart ({totalItems})
                </button>
                <button 
                  onClick={() => {
                    handleAddSelectedToCart();
                    onProceedToPay();
                  }}
                  disabled={totalItems === 0}
                  className={`px-4 py-2 rounded-md ${totalItems > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Proceed to Pay ({total} DKK)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarOrder;