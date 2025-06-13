import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  Trash2, 
  Plus, 
  Minus,
  MapPin,
  CreditCard,
  Repeat,
  X,
  ShoppingBag
} from 'lucide-react';

import { 
  formatDateHeader,
  isToday,
  isTomorrow,
  getDateLabel,
  calculateDateGroupSubtotal,
  calculateDateGroupItemCount,
  calculateCartTotal,
  calculateTotalItemCount,
  getDeliveryTimeSlots
} from '../utils/cartUtils';

const DateGroupedCart = ({ 
  cart, 
  onUpdateQuantity,
  onRemoveItem,
  onRemoveDateGroup,
  onChangeDeliveryTime,
  onProceedToCheckout,
  onToggleRecurring,
  onSetRecurringFrequency,
  onClose
}) => {
  const [expandedDates, setExpandedDates] = useState({});

  // Toggle date group expansion
  const toggleDateGroup = (dateKey) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  // Calculate totals
  const totalPrice = calculateCartTotal(cart);
  const itemCount = calculateTotalItemCount(cart);
  const deliveryFee = 29; // Could be variable based on location, etc.
  const grandTotal = totalPrice + deliveryFee;

  // Sort date groups chronologically
  const sortedDateKeys = Object.keys(cart.dateGroups).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (sortedDateKeys.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
          {/* Empty Cart Header */}
          <div className="p-6 border-b border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Your Cart
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Empty Cart Content */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-500 text-center max-w-sm mb-8">
              Add some delicious items from our menu to get started with your order.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              Browse Restaurant Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp border border-gray-200 dark:border-gray-700">
        {/* Enhanced Header */}
        <div className="flex-shrink-0 p-6 border-b border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-pink-400/10 animate-pulse" />
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Your Schedule
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{sortedDateKeys.length} days planned</span>
                  <span className="text-gray-400">•</span>
                  <span>{itemCount} items</span>
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Recurring Order Toggle */}
        <div className="px-6 py-3 border-b border-orange-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring-toggle"
                  checked={cart.isRecurring}
                  onChange={() => onToggleRecurring(!cart.isRecurring)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="recurring-toggle" className="ml-2 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <Repeat className="w-4 h-4 text-blue-500" />
                  Make this a recurring order
                </label>
              </div>
            </div>
            
            {cart.isRecurring && (
              <div className="flex items-center gap-2">
                <label htmlFor="recurring-frequency" className="text-sm text-gray-600 dark:text-gray-400">
                  Repeat:
                </label>
                <select
                  id="recurring-frequency"
                  value={cart.recurringFrequency || 'weekly'}
                  onChange={(e) => onSetRecurringFrequency(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-1.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Cart Content - Fixed height with proper scrolling */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
            {sortedDateKeys.map((dateKey) => {
              const dateGroup = cart.dateGroups[dateKey];
              const isExpanded = expandedDates[dateKey] !== false; // Default to expanded
              const dateLabel = getDateLabel(dateKey);
              const formattedDate = formatDateHeader(dateKey);
              const subtotal = calculateDateGroupSubtotal(dateGroup);
              const itemCount = calculateDateGroupItemCount(dateGroup);
              
              return (
                <div 
                  key={dateKey} 
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Date Header */}
                  <div 
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                      isToday(dateKey) ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' :
                      isTomorrow(dateKey) ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' :
                      'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50'
                    }`}
                    onClick={() => toggleDateGroup(dateKey)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          isToday(dateKey) ? 'bg-green-500' :
                          isTomorrow(dateKey) ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            {dateLabel}
                            {isToday(dateKey) && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                                Today
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formattedDate} • {itemCount} items • {subtotal.toFixed(0)} DKK
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveDateGroup(dateKey);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 hover:scale-110"
                          aria-label="Remove date group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {isExpanded ? 
                          <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        }
                      </div>
                    </div>
                  </div>
                  
                  {/* Date Content - Collapsible */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 space-y-4">
                          {/* Delivery Time Selector */}
                          <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            <div className="flex-1">
                              <label htmlFor={`delivery-time-${dateKey}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Delivery Time
                              </label>
                              <select
                                id={`delivery-time-${dateKey}`}
                                value={dateGroup.deliveryTime}
                                onChange={(e) => onChangeDeliveryTime(dateKey, e.target.value)}
                                className="block w-full border-gray-200 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 p-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                {getDeliveryTimeSlots(dateKey).map((slot) => (
                                  <option key={slot} value={slot}>{slot}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          {/* Items List */}
                          <div className="space-y-3">
                            {dateGroup.items.map((item) => (
                              <div
                                key={item.id}
                                className="group flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                              >
                                {/* Item Image */}
                                <div className="w-16 h-16 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.src = `https://source.unsplash.com/featured/?food`;
                                    }}
                                  />
                                </div>
                                
                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                                    {item.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {item.restaurant}
                                  </p>
                                  
                                  {/* Special Instructions */}
                                  {item.specialInstructions && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 truncate">
                                      Note: {item.specialInstructions}
                                    </p>
                                  )}
                                  
                                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-1">
                                    {item.price.toFixed(0)} DKK × {item.quantity} = {(item.price * item.quantity).toFixed(0)} DKK
                                  </p>
                                </div>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full overflow-hidden shadow-sm">
                                    <button
                                      onClick={() => onUpdateQuantity(dateKey, item.id, item.quantity - 1)}
                                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    
                                    <span className="px-3 py-1 font-semibold text-gray-800 dark:text-gray-200 min-w-[2rem] text-center">
                                      {item.quantity}
                                    </span>
                                    
                                    <button
                                      onClick={() => onUpdateQuantity(dateKey, item.id, item.quantity + 1)}
                                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {/* Remove Button */}
                                  <button
                                    onClick={() => onRemoveItem(dateKey, item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 hover:scale-110"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              Delivery {dateGroup.deliveryTime}
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              Subtotal: {subtotal.toFixed(0)} DKK
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer with Order Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Order Summary</h3>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-800 dark:text-gray-200">{totalPrice.toFixed(0)} DKK</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                <span className="text-gray-800 dark:text-gray-200">{deliveryFee.toFixed(0)} DKK</span>
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-semibold">
                <span className="text-gray-800 dark:text-gray-200">Total</span>
                <span className="text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {grandTotal.toFixed(0)} DKK
                </span>
              </div>
              
              {cart.isRecurring && (
                <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <Repeat className="w-4 h-4 mr-1" />
                  This will be a {cart.recurringFrequency || 'weekly'} recurring order
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onProceedToCheckout(grandTotal)}
                className="w-full py-3 px-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Payment • {grandTotal.toFixed(0)} DKK</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-3 px-5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateGroupedCart;
