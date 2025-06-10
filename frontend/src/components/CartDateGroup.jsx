import React from 'react';
import { Calendar, Minus, Plus, Trash2, Star, Clock, MapPin } from 'lucide-react';

const CartDateGroup = ({ date, items, onUpdateQuantity, onRemoveItem }) => {
  const isToday = new Date(date).toDateString() === new Date().toDateString();
  const isTomorrow = new Date(date).toDateString() === new Date(Date.now() + 86400000).toDateString();
  
  const getDateLabel = () => {
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalItemsForDate = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPriceForDate = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Date Header */}
      <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
        isToday ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' :
        isTomorrow ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' :
        'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isToday ? 'bg-green-500' :
              isTomorrow ? 'bg-blue-500' : 'bg-gray-500'
            }`}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                {getDateLabel()}
                {isToday && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                    Today
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {totalItemsForDate} items • {totalPriceForDate} DKK
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Delivery</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              30-45 min
            </p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 space-y-4">
        {items.map(item => (
          <div key={item.id + '-' + date} className="group flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            {/* Item Image */}
            <div className="w-16 h-16 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                onError={(e) => {
                  e.target.src = `${process.env.REACT_APP_IMAGE_BASE_URL}/?food&sig=fallback`;
                }}
              />
            </div>
            
            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                {item.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                {item.restaurant}
              </p>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-1">
                {item.price} DKK each
              </p>
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full overflow-hidden shadow-sm">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1, date)}
                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="px-3 py-1 font-semibold text-gray-800 dark:text-gray-200 min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1, date)}
                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* Remove Button */}
              <button 
                onClick={() => onRemoveItem(item.id, date)}
                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartDateGroup;
