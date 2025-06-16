import React from 'react';
import CartDateGroup from './CartDateGroup';
import { 
  ShoppingCart, 
  X, 
  Package, 
  Truck, 
  CreditCard, 
  ArrowRight,
  ShoppingBag,
  Clock,
  MapPin
} from 'lucide-react';

const CartModal = ({ cart, onClose, onUpdateQuantity, onRemoveItem, onProceedToPay }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 29;
  const total = subtotal + deliveryFee;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // group items by their date string
  const grouped = cart.reduce((acc, item) => {
    const d = item.date || 'undefined-date';
    (acc[d] = acc[d] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-slideUp border border-gray-200 dark:border-gray-700">
        {/* Enhanced Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-pink-400/10 animate-pulse" />
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Your Cart
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  {totalItems} items
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Close cart"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
        
        {/* Cart Content - Fixed height with proper scrolling */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Your cart is empty</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500">Add some delicious items to get started!</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(grouped).map(([date, items]) => (
                  <CartDateGroup
                    key={date}
                    date={date}
                    items={items}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Footer - Always visible */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 max-h-[40vh] overflow-y-auto">
            {/* Order Summary */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Order Summary
              </h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                    Subtotal
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{subtotal} DKK</span>
                </div>
                
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                    Delivery fee
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{deliveryFee} DKK</span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3">
                  <div className="flex justify-between items-center text-base sm:text-lg">
                    <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      Total
                    </span>
                    <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {total} DKK
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-1 sm:mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Estimated Delivery</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  30-45 minutes after order confirmation
                </p>
              </div>
            </div>
            
            {/* Action Buttons - Always visible at bottom */}
            <div className="p-4 sm:p-6 pt-0 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button 
                  onClick={onClose}
                  className="group px-4 py-2 sm:px-6 sm:py-3 border-2 border-orange-500 text-orange-600 dark:text-orange-400 dark:border-orange-400 font-semibold rounded-lg sm:rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
                  Continue Shopping
                </button>
                
                <button 
                  onClick={onProceedToPay}
                  className="group relative overflow-hidden px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                  <span className="relative z-10">Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;