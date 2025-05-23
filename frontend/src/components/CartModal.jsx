import React from 'react';

const CartModal = ({ cart, onClose, onUpdateQuantity, onRemoveItem, onProceedToPay }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 29;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Your Cart
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex border-b pb-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.restaurant}</p>
                    <p className="text-sm font-semibold">{item.price} DKK</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-gray-600 border rounded-l"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-t border-b">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 border rounded-r"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-4 text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{subtotal} DKK</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery fee</span>
              <span>{deliveryFee} DKK</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
              <span>Total</span>
              <span>{total} DKK</span>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-orange-500 text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors duration-300"
              >
                Continue Shopping
              </button>
              <button 
                onClick={onProceedToPay}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;