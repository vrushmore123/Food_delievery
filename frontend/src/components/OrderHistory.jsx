import React from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="divide-y">
      {orders.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No order history yet. Place your first order!
        </div>
      ) : (
        orders.slice().reverse().map(order => (
          <div key={order.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Order #{order.id.toString().slice(-6)}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm">
                Total: <span className="font-medium">{order.total} DKK</span>
              </div>
              <Link 
                to="#"
                className="text-sm text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
            
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <button className="mt-2 w-full text-sm border rounded-md py-1 hover:bg-gray-100">
                Track Order
              </button>
            )}
            
            {order.status === 'delivered' && (
              <button className="mt-2 w-full text-sm border rounded-md py-1 hover:bg-gray-100">
                Reorder
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;