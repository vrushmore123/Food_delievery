import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import DateDetailModal from './DateDetailModal';
import ProfessionalMealIndicator from './ProfessionalMealIndicator';
import ProfessionalFoodCard from './ProfessionalFoodCard';
import ColorLegend from './ColorLegend';
import FoodItemModal from './FoodItemModal';

const CalendarOrder = ({ foodItems, onClose, onAddToCart, onProceedToPay }) => {
  const [duration, setDuration] = useState('week');
  const [selectedDateModal, setSelectedDateModal] = useState(null);
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [dropAnimations, setDropAnimations] = useState({});

  const dates = useMemo(() => {
    const days = duration === 'week' ? 7 : 30;
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, [duration]);

  const items = useMemo(() =>
    foodItems.map((f, i) => ({
      ...f,
      isAvailable: f.isAvailable !== false, // Default to available
      imageUrl: f.imageUrl || `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80`
    }))
  , [foodItems]);

  const [selectedPlan, setSelectedPlan] = useState({});

  const handleDragStart = (e, food) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', food.id);
    setDraggedItem(food);
    
    // Create custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'drag-preview';
    dragImage.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 200px;
        border: 2px solid #f97316;
      ">
        <img src="${food.imageUrl}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" />
        <div>
          <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${food.name}</div>
          <div style="color: #f97316; font-weight: 500; font-size: 12px;">${food.price} DKK</div>
        </div>
      </div>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 100, 30);
    
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDrop = (e, dateStr) => {
    e.preventDefault();
    let foodToAdd = draggedItem;
    if (!foodToAdd) {
      const id = e.dataTransfer.getData('text/plain');
      foodToAdd = items.find(f => f.id.toString() === id);
    }
    if (!foodToAdd) return;

    // Trigger drop animation
    setDropAnimations(prev => ({ ...prev, [dateStr]: Date.now() }));
    
    setSelectedPlan(prev => {
      const list = prev[dateStr] ? [...prev[dateStr]] : [];
      const idx = list.findIndex(i => i.food.id === foodToAdd.id);
      if (idx >= 0) list[idx].qty += 1;
      else list.push({ food: foodToAdd, qty: 1 });
      return { ...prev, [dateStr]: list };
    });
    
    setDraggedItem(null);
    
    // Clear animation after delay
    setTimeout(() => {
      setDropAnimations(prev => {
        const newState = { ...prev };
        delete newState[dateStr];
        return newState;
      });
    }, 600);
  };

  const updateQty = (dateStr, foodId, newQty) => {
    if (newQty <= 0) {
      removeItem(dateStr, foodId);
      return;
    }
    
    setSelectedPlan(prev => {
      const list = [...(prev[dateStr] || [])];
      const index = list.findIndex(item => item.food.id === foodId);
      if (index >= 0) {
        list[index].qty = newQty;
      }
      return { ...prev, [dateStr]: list };
    });
  };

  const removeItem = (dateStr, foodId) => {
    setSelectedPlan(prev => {
      const list = [...(prev[dateStr] || [])];
      const filteredList = list.filter(item => item.food.id !== foodId);
      const next = { ...prev };
      if (filteredList.length) next[dateStr] = filteredList;
      else delete next[dateStr];
      return next;
    });
  };

  const openDateModal = (dateStr) => {
    const plans = selectedPlan[dateStr] || [];
    if (plans.length > 0) {
      setSelectedDateModal({
        date: dateStr,
        meals: plans,
        deliveryTime: "12:00 PM - 1:00 PM" // Default time
      });
    }
  };

  const handleModalUpdateQuantity = (foodId, newQty) => {
    if (!selectedDateModal) return;
    updateQty(selectedDateModal.date, foodId, newQty);
    
    // Update modal data
    setSelectedDateModal(prev => ({
      ...prev,
      meals: prev.meals.map(meal => 
        meal.food.id === foodId ? { ...meal, qty: newQty } : meal
      ).filter(meal => meal.qty > 0)
    }));
  };

  const handleModalRemoveMeal = (foodId) => {
    if (!selectedDateModal) return;
    removeItem(selectedDateModal.date, foodId);
    
    // Update modal data
    const updatedMeals = selectedDateModal.meals.filter(meal => meal.food.id !== foodId);
    if (updatedMeals.length === 0) {
      setSelectedDateModal(null);
    } else {
      setSelectedDateModal(prev => ({
        ...prev,
        meals: updatedMeals
      }));
    }
  };

  // Handle add to cart from food modal - FIXED
  const handleAddToCartFromModal = (food, quantity, selectedDate) => {
    if (selectedDate) {
      // Add to calendar plan
      const dateStr = selectedDate;
      setSelectedPlan(prev => {
        const list = prev[dateStr] ? [...prev[dateStr]] : [];
        const idx = list.findIndex(i => i.food.id === food.id);
        if (idx >= 0) {
          list[idx].qty += quantity;
        } else {
          list.push({ food, qty: quantity });
        }
        return { ...prev, [dateStr]: list };
      });
    } else {
      // Add to regular cart
      onAddToCart(food, quantity);
    }
    setSelectedFoodModal(null);
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  // Get date classes
  const getDateClasses = (date, plans) => {
    const key = date.toDateString();
    const baseClasses = 'date-cell';
    const classes = [baseClasses];
    
    if (plans.length > 0) classes.push('has-meals');
    if (isToday(date)) classes.push('is-today');
    if (isWeekend(date)) classes.push('is-weekend');
    if (hoveredDate === key) classes.push('drag-over');
    if (dropAnimations[key]) classes.push('drop-animation');
    
    return classes.join(' ');
  };

  // Handle food item click
  const handleFoodItemClick = (food) => {
    setSelectedFoodModal(food);
  };

  // Calculate totals
  const { totalItems, totalPrice } = Object.values(selectedPlan)
    .flat()
    .reduce((acc, { food, qty }) => {
      acc.totalItems += qty;
      acc.totalPrice += food.price * qty;
      return acc;
    }, { totalItems: 0, totalPrice: 0 });

  const deliveryFee = 29;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 calendar-container">
        <div className="bg-zinc-50 rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden border border-gray-200">
          {/* Professional Header */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-xl shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Plan Your {duration === 'week' ? 'Weekly' : 'Monthly'} Meals
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Drag meals to calendar dates or click for details
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Duration Tabs */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {['week', 'month'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      duration === d 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {d === 'week' ? 'Weekly' : 'Monthly'} Plan
                  </button>
                ))}
              </div>
              
              {/* Color Legend */}
              <ColorLegend showTooltip={true} />
            </div>
          </div>

          {/* Body - Enhanced Layout */}
          <div className="flex flex-col xl:flex-row flex-1 overflow-hidden p-6 gap-6">
            {/* Available Meals - Larger Cards */}
            <div className="w-full xl:w-2/5 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Available Meals</h3>
                <p className="text-sm text-gray-600 mt-1">Click items for details or drag to calendar</p>
              </div>
              <div className="p-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(95vh - 280px)' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map(f => (
                    <ProfessionalFoodCard
                      key={f.id}
                      food={f}
                      onDragStart={handleDragStart}
                      onDragEnd={() => setDraggedItem(null)}
                      onClick={handleFoodItemClick}
                      compact={false}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Calendar Grid - Bigger Cards */}
            <div className="w-full xl:flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {duration === 'week' ? '7 days' : '30 days'} • {totalItems} items planned
                </p>
              </div>
              
              <div className="relative" style={{ height: 'calc(95vh - 280px)' }}>
                {/* Week View */}
                {duration === 'week' && (
                  <div className="p-4 h-full overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-fit">
                      {dates.map(d => {
                        const key = d.toDateString();
                        const plans = selectedPlan[key] || [];
                        const totalMealsForDate = plans.reduce((sum, plan) => sum + plan.qty, 0);
                        
                        return (
                          <motion.div
                            key={key}
                            className={getDateClasses(d, plans)}
                            style={{ minHeight: '180px' }} // Bigger cards
                            onDragOver={e => { 
                              e.preventDefault(); 
                              e.dataTransfer.dropEffect = 'move'; 
                              setHoveredDate(key);
                            }}
                            onDragLeave={() => setHoveredDate(null)}
                            onDrop={e => {
                              handleDrop(e, key);
                              setHoveredDate(null);
                            }}
                            onClick={() => openDateModal(key)}
                            animate={dropAnimations[key] ? { 
                              scale: [1, 1.02, 1],
                              borderColor: ['rgb(229, 231, 235)', 'rgb(245, 158, 11)', 'rgb(229, 231, 235)']
                            } : {}}
                            tabIndex={0}
                            role="button"
                            aria-label={`Calendar date ${d.toLocaleDateString()}`}
                          >
                            {/* Date Header */}
                            <div className="date-header">
                              <div>
                                <div className="date-day">
                                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className="date-number">
                                  {d.getDate()}
                                </div>
                              </div>

                              {/* Status Indicators */}
                              <div className="flex flex-col items-end gap-1">
                                {totalMealsForDate > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    {totalMealsForDate}
                                  </span>
                                )}
                                {isToday(d) && (
                                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                                    Today
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Meal Indicators */}
                            <div className="meal-indicators-container">
                              {plans.length > 0 ? (
                                <ProfessionalMealIndicator meals={plans} maxVisible={4} />
                              ) : (
                                <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${hoveredDate === key ? 'opacity-100' : ''}`}>
                                  <Plus className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Hover Preview */}
                            {hoveredDate === key && draggedItem && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-center justify-center"
                              >
                                <div className="text-center">
                                  <Plus className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                                  <span className="text-xs font-medium text-amber-700">Drop to add</span>
                                </div>
                              </motion.div>
                            )}

                            {/* Click hint */}
                            {plans.length > 0 && (
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                  Click to view
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Month View - Fixed Scrolling */}
                {duration === 'month' && (
                  <div className="h-full flex flex-col">
                    {/* Calendar Grid Header */}
                    <div className="grid grid-cols-7 gap-2 p-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2">{day}</div>
                      ))}
                    </div>
                    
                    {/* Scrollable Calendar Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="p-4">
                        <div className="grid grid-cols-7 gap-3 auto-rows-fr">
                          {dates.map(d => {
                            const key = d.toDateString();
                            const plans = selectedPlan[key] || [];
                            const totalMealsForDate = plans.reduce((sum, plan) => sum + plan.qty, 0);
                            
                            return (
                              <motion.div
                                key={key}
                                className={getDateClasses(d, plans)}
                                style={{ minHeight: '120px', aspectRatio: '1' }} // Square cards
                                onDragOver={e => { 
                                  e.preventDefault(); 
                                  e.dataTransfer.dropEffect = 'move'; 
                                  setHoveredDate(key);
                                }}
                                onDragLeave={() => setHoveredDate(null)}
                                onDrop={e => {
                                  handleDrop(e, key);
                                  setHoveredDate(null);
                                }}
                                onClick={() => openDateModal(key)}
                                animate={dropAnimations[key] ? { 
                                  scale: [1, 1.02, 1],
                                  borderColor: ['rgb(229, 231, 235)', 'rgb(245, 158, 11)', 'rgb(229, 231, 235)']
                                } : {}}
                                tabIndex={0}
                                role="button"
                                aria-label={`Calendar date ${d.toLocaleDateString()}`}
                              >
                                {/* Date Header */}
                                <div className="date-header">
                                  <div>
                                    <div className="date-day text-xs">
                                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className="date-number text-lg">
                                      {d.getDate()}
                                    </div>
                                  </div>

                                  {/* Status Indicators */}
                                  <div className="flex flex-col items-end gap-1">
                                    {totalMealsForDate > 0 && (
                                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                        {totalMealsForDate}
                                      </span>
                                    )}
                                    {isToday(d) && (
                                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                                        Today
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Meal Indicators */}
                                <div className="meal-indicators-container">
                                  {plans.length > 0 ? (
                                    <ProfessionalMealIndicator meals={plans} maxVisible={3} />
                                  ) : (
                                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${hoveredDate === key ? 'opacity-100' : ''}`}>
                                      <Plus className="w-5 h-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Hover Preview */}
                                {hoveredDate === key && draggedItem && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-center justify-center"
                                  >
                                    <div className="text-center">
                                      <Plus className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                                      <span className="text-xs font-medium text-amber-700">Drop to add</span>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Click hint */}
                                {plans.length > 0 && (
                                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                                      Click
                                    </span>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Footer */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>Items: <span className="font-semibold text-gray-900">{totalItems}</span></span>
                  <span>Subtotal: <span className="font-semibold text-gray-900">{totalPrice.toFixed(0)} DKK</span></span>
                  <span>Delivery: <span className="font-semibold text-gray-900">{deliveryFee} DKK</span></span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  Total: <span className="text-emerald-600">{grandTotal.toFixed(0)} DKK</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    Object.entries(selectedPlan).forEach(([date, list]) =>
                      list.forEach(({ food, qty }) =>
                        onAddToCart(food, qty, date)
                      )
                    );
                    onClose();
                  }}
                  disabled={totalItems === 0}
                  className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition-all duration-200 font-medium disabled:cursor-not-allowed"
                >
                  Add to Cart ({totalItems})
                </button>
                <button
                  onClick={() => {
                    Object.entries(selectedPlan).forEach(([date, list]) =>
                      list.forEach(({ food, qty }) =>
                        onAddToCart(food, qty, date)
                      )
                    );
                    onProceedToPay();
                  }}
                  disabled={totalItems === 0}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DateDetailModal
        isOpen={!!selectedDateModal}
        onClose={() => setSelectedDateModal(null)}
        date={selectedDateModal?.date}
        meals={selectedDateModal?.meals || []}
        deliveryTime={selectedDateModal?.deliveryTime}
        onUpdateQuantity={handleModalUpdateQuantity}
        onRemoveMeal={handleModalRemoveMeal}
        onAddToCart={(food, qty, date) => onAddToCart(food, qty, date)}
        onChangeDeliveryTime={(newTime) => {
          setSelectedDateModal(prev => ({
            ...prev,
            deliveryTime: newTime
          }));
        }}
      />

      <FoodItemModal
        item={selectedFoodModal}
        isOpen={!!selectedFoodModal}
        onClose={() => setSelectedFoodModal(null)}
        onAddToCart={handleAddToCartFromModal}
        showDatePicker={true}
        availableDates={dates}
      />
    </>
  );
};

export default CalendarOrder;