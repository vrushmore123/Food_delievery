import React from 'react';
import { Calendar, Clock, Plus, Minus, Trash2 } from 'lucide-react';

const CartDateGroup = ({ date, items, onUpdateQuantity, onRemoveItem }) => {
  // Format date display
  const formattedDate = date === 'undefined-date'
    ? 'Other Items'
    : new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Date Header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700">
        <Calendar className="w-4 h-4 text-orange-500" />
        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
          {formattedDate}
        </span>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {items.map(item => (
          <div key={item.id} className="p-3 sm:p-4">
            {/* Mobile layout (stacked) */}
            <div className="flex flex-col sm:hidden">
              {/* Item details */}
              <div className="flex items-start gap-3 mb-3">
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=Food";
                  }}
                />
                
                {/* Name and price */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {item.restaurant}
                  </p>
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {item.price} DKK
                  </p>
                </div>
              </div>
              
              {/* Controls in a separate row for mobile */}
              <div className="flex justify-between items-center">
                {/* Quantity controls */}
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.date)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-medium text-gray-800 dark:text-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.date)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Item subtotal and remove button */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.price * item.quantity} DKK
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id, item.date)}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop layout (row) */}
            <div className="hidden sm:flex items-center">
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Food";
                }}
              />
              
              {/* Name and price */}
              <div className="flex-1 min-w-0 px-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.restaurant}
                </p>
              </div>
              
              {/* Quantity controls */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full mr-4">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.date)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 font-medium text-gray-800 dark:text-gray-200">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.date)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 dark:hover:text-orange-400"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Item subtotal */}
              <div className="w-24 text-right">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {item.price * item.quantity} DKK
                </span>
              </div>
              
              {/* Remove button */}
              <button
                onClick={() => onRemoveItem(item.id, item.date)}
                className="ml-4 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full"
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
