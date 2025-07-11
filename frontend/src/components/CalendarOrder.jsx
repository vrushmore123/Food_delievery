import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
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
  const [mobileView, setMobileView] = useState('calendar'); // 'calendar' or 'meals'
  const [expandedDate, setExpandedDate] = useState(null);

  // Detect mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      isAvailable: f.isAvailable !== false,
      imageUrl: f.imageUrl || `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format&q=80`
    }))
  , [foodItems]);

  const [selectedPlan, setSelectedPlan] = useState({});

  const handleDragStart = (e, food) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', food.id);
    setDraggedItem(food);
  };

  const handleDrop = (e, dateStr) => {
    e.preventDefault();
    let foodToAdd = draggedItem;
    if (!foodToAdd) {
      const id = e.dataTransfer.getData('text/plain');
      foodToAdd = items.find(f => f.id.toString() === id);
    }
    if (!foodToAdd) return;

    setDropAnimations(prev => ({ ...prev, [dateStr]: Date.now() }));
    setSelectedPlan(prev => {
      const list = prev[dateStr] ? [...prev[dateStr]] : [];
      const idx = list.findIndex(i => i.food.id === foodToAdd.id);
      if (idx >= 0) list[idx].qty += 1;
      else list.push({ food: foodToAdd, qty: 1 });
      return { ...prev, [dateStr]: list };
    });
    setDraggedItem(null);
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
        deliveryTime: "12:00 PM - 1:00 PM"
      });
    }
  };

  const toggleDateExpansion = (dateStr) => {
    setExpandedDate(expandedDate === dateStr ? null : dateStr);
  };

  const handleModalUpdateQuantity = (foodId, newQty) => {
    if (!selectedDateModal) return;
    updateQty(selectedDateModal.date, foodId, newQty);
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

  const handleAddToCartFromModal = (food, quantity, selectedDate) => {
    if (selectedDate) {
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
      onAddToCart(food, quantity);
    }
    setSelectedFoodModal(null);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

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

  const handleFoodItemClick = (food) => {
    setSelectedFoodModal(food);
  };

  const { totalItems, totalPrice } = Object.values(selectedPlan)
    .flat()
    .reduce((acc, { food, qty }) => {
      acc.totalItems += qty;
      acc.totalPrice += food.price * qty;
      return acc;
    }, { totalItems: 0, totalPrice: 0 });

  const deliveryFee = 29;
  const grandTotal = totalPrice + deliveryFee;

  // Mobile view toggle
  const toggleMobileView = (view) => {
    setMobileView(view);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2">
        <div className="bg-zinc-50 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-7xl h-full sm:h-[98vh] flex flex-col overflow-hidden border border-gray-200">
          {/* Compact Header */}
          <div className="p-2 sm:p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-orange-600 rounded-md shadow-sm flex-shrink-0">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-lg font-semibold text-gray-900 leading-tight">
                    {duration === 'week' ? 'Weekly' : 'Monthly'} Meal Plan
                  </h2>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 flex-shrink-0"
                aria-label="Close"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Compact Duration Tabs */}
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white border-b border-gray-200 sticky top-12 sm:top-14 z-10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex space-x-1 flex-1">
                {['week', 'month'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-initial ${
                      duration === d 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {d === 'week' ? 'Week' : 'Month'}
                  </button>
                ))}
              </div>
              
              {/* Compact Color Legend */}
              {!isMobile && (
                <div className="hidden lg:flex items-center gap-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Special</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Limited</span>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Mobile view toggle */}
            {isMobile && (
              <div className="flex mt-1.5 rounded-md bg-gray-100 p-0.5">
                <button
                  onClick={() => toggleMobileView('calendar')}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                    mobileView === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => toggleMobileView('meals')}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                    mobileView === 'meals' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Meals
                </button>
              </div>
            )}
          </div>

          {/* Main Content - Maximum Space */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden p-1 sm:p-2 gap-1 sm:gap-2">
            {/* Available Meals Panel - Using full height */}
            <div className={`w-full lg:w-2/5 bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm flex flex-col ${
              isMobile ? (mobileView === 'meals' ? 'block' : 'hidden') : 'block'
            }`}>
              <div className="p-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Available Meals</h3>
              </div>
              <div className="p-1 sm:p-2 overflow-y-auto custom-scrollbar flex-grow" style={{ height: '100%' }}>
                <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-2">
                  {items.map(f => (
                    <ProfessionalFoodCard
                      key={f.id}
                      food={f}
                      onDragStart={handleDragStart}
                      onDragEnd={() => setDraggedItem(null)}
                      onClick={handleFoodItemClick}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Panel - Using full remaining space */}
            <div className={`w-full lg:flex-1 bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm flex flex-col ${
              isMobile ? (mobileView === 'calendar' ? 'block' : 'hidden') : 'block'
            }`}>
              <div className="p-2 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Calendar</h3>
                  <span className="text-xs text-gray-600">{totalItems} items</span>
                </div>
              </div>
              
              <div className="flex-grow overflow-hidden">
                {/* Week View - Using full available space */}
                {duration === 'week' && (
                  <div className="p-1 sm:p-2 h-full overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-2 h-full auto-rows-fr">
                      {dates.map(d => {
                        const key = d.toDateString();
                        const plans = selectedPlan[key] || [];
                        const totalMealsForDate = plans.reduce((sum, plan) => sum + plan.qty, 0);
                        const isExpanded = expandedDate === key;
                        
                        return (
                          <motion.div
                            key={key}
                            className={`${getDateClasses(d, plans)} ${isExpanded ? 'expanded' : ''} relative bg-white border border-gray-200 rounded-md p-2 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full`}
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
                            onClick={() => {
                              // Fixed: Add proper click handler to open modal for non-mobile view
                              // and handle expansion for mobile view
                              if (isMobile) {
                                !isExpanded && toggleDateExpansion(key);
                              } else if (plans.length > 0) {
                                openDateModal(key);
                              }
                            }}
                            animate={dropAnimations[key] ? { 
                              scale: [1, 1.02, 1],
                              borderColor: ['rgb(229, 231, 235)', 'rgb(245, 158, 11)', 'rgb(229, 231, 235)']
                            } : {}}
                            tabIndex={0}
                            role="button"
                            aria-label={`Calendar date ${d.toLocaleDateString()}`}
                          >
                            {/* Date Header */}
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-gray-900">
                                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-lg font-semibold text-gray-900">
                                  {d.getDate()}
                                </span>
                                {isToday(d) && (
                                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                                    Today
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                {totalMealsForDate > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                    {totalMealsForDate}
                                  </span>
                                )}
                                {plans.length > 0 && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDateExpansion(key);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Meal Indicators - Filling Available Space */}
                            <div className="flex-grow flex flex-col">
                              {plans.length > 0 ? (
                                <div className="flex-grow">
                                  <ProfessionalMealIndicator 
                                    meals={plans} 
                                    maxVisible={isExpanded ? undefined : 3} 
                                    expanded={isExpanded}
                                    onRemove={(foodId) => removeItem(key, foodId)}
                                    onUpdateQty={(foodId, newQty) => updateQty(key, foodId, newQty)}
                                  />
                                </div>
                              ) : (
                                <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${hoveredDate === key ? 'opacity-100' : ''} flex-grow flex items-center justify-center`}>
                                  <div className="text-center">
                                    <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <span className="text-sm text-gray-400">Drop meals here</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Hover Preview */}
                            {hoveredDate === key && draggedItem && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-amber-50 border-2 border-amber-400 rounded-md flex items-center justify-center"
                              >
                                <div className="text-center">
                                  <Plus className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                  <span className="text-sm font-medium text-amber-700">Drop to add</span>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Month View - Using full available space */}
                {duration === 'month' && (
                  <div className="h-full flex flex-col">
                    {/* Calendar Grid Header */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 p-1 sm:p-2 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-700">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <div key={day} className="py-1">
                          <span className="sm:hidden">{day}</span>
                          <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Scrollable Calendar Body - Using all available space */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                      <div className="p-1 sm:p-2 h-full">
                        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 h-full auto-rows-fr">
                          {dates.map(d => {
                            const key = d.toDateString();
                            const plans = selectedPlan[key] || [];
                            const totalMealsForDate = plans.reduce((sum, plan) => sum + plan.qty, 0);
                            const isExpanded = expandedDate === key;
                            
                            return (
                              <motion.div
                                key={key}
                                className={`${getDateClasses(d, plans)} ${isExpanded ? 'expanded' : ''} relative bg-white border border-gray-200 rounded p-1 hover:shadow-sm transition-all cursor-pointer group flex flex-col h-full`}
                                style={{ minHeight: isExpanded ? '160px' : '80px' }}
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
                                onClick={() => {
                                  // Fixed: Add proper click handler to open modal for non-mobile view
                                  // and handle expansion for mobile view
                                  if (isMobile) {
                                    !isExpanded && toggleDateExpansion(key);
                                  } else if (plans.length > 0) {
                                    openDateModal(key);
                                  }
                                }}
                                animate={dropAnimations[key] ? { 
                                  scale: [1, 1.02, 1],
                                  borderColor: ['rgb(229, 231, 235)', 'rgb(245, 158, 11)', 'rgb(229, 231, 235)']
                                } : {}}
                                tabIndex={0}
                                role="button"
                                aria-label={`Calendar date ${d.toLocaleDateString()}`}
                              >
                                {/* Date Header */}
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium text-gray-900">{d.getDate()}</span>
                                  <div className="flex items-center gap-1">
                                    {totalMealsForDate > 0 && (
                                      <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-medium">
                                        {totalMealsForDate}
                                      </span>
                                    )}
                                    {plans.length > 0 && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleDateExpansion(key);
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="w-3 h-3" />
                                        ) : (
                                          <ChevronDown className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Meal Indicators - Using all remaining space */}
                                <div className="flex-grow flex flex-col">
                                  {plans.length > 0 ? (
                                    <div className="flex-grow">
                                      <ProfessionalMealIndicator 
                                        meals={plans} 
                                        maxVisible={isExpanded ? undefined : 2} 
                                        expanded={isExpanded}
                                        compact={!isExpanded}
                                        onRemove={(foodId) => removeItem(key, foodId)}
                                        onUpdateQty={(foodId, newQty) => updateQty(key, foodId, newQty)}
                                      />
                                    </div>
                                  ) : (
                                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${hoveredDate === key ? 'opacity-100' : ''} flex-grow flex items-center justify-center`}>
                                      <Plus className="w-3 h-3 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Today indicator */}
                                {isToday(d) && (
                                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
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

          {/* Compact Footer */}
          <div className="p-2 sm:p-3 border-t border-gray-200 bg-white sticky bottom-0 z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <div className="w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 text-xs text-gray-600">
                  <span>{totalItems} items</span>
                  <span>{totalPrice.toFixed(0)} DKK</span>
                  <span>+{deliveryFee} delivery</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900">
                  Total: <span className="text-emerald-600">{grandTotal.toFixed(0)} DKK</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
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
                  className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition-all duration-200 font-medium disabled:cursor-not-allowed text-xs sm:text-sm"
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
                  className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm disabled:cursor-not-allowed text-xs sm:text-sm"
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