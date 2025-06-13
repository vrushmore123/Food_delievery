import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Package, Star, ChevronRight, RotateCcw } from 'lucide-react';

const OrderHistory = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-the-way': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      case 'preparing': return '👨‍🍳';
      case 'on-the-way': return '🚴';
      default: return '📦';
    }
  };

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
        <p className="text-gray-500">Your order history will appear here</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.slice().reverse().map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
        >
          {/* Order Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getStatusIcon(order.status)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.id.toString().slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(order.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ').toUpperCase()}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <Package className="w-3 h-3 mr-1" />
                  {order.items.length} items
                </span>
                <span className="font-semibold text-gray-900">
                  {order.total} DKK
                </span>
              </div>
              
              {order.status === 'delivered' && (
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs">Rate Order</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="p-4">
            <div className="space-y-2 mb-4">
              {order.items.slice(0, 2).map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {(item.price * item.quantity).toFixed(0)} DKK
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{order.items.length - 2} more items
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {order.status === 'delivered' && (
                <button className="flex-1 py-2 px-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>Reorder</span>
                </button>
              )}
              
              {(order.status === 'preparing' || order.status === 'on-the-way') && (
                <button className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  Track Order
                </button>
              )}
              
              <button className="flex-1 py-2 px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrderHistory;