import React from 'react';

const CartDateGroup = ({ date, items, onUpdateQuantity, onRemoveItem }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">{new Date(date).toLocaleDateString()}</h3>
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id + '-' + date} className="flex border-b pb-4">
          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
          <div className="ml-4 flex-1">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.restaurant}</p>
            <p className="text-sm font-semibold">{item.price} DKK</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1, date)}
              className="px-2 py-1 text-gray-600 border rounded-l"
            >−</button>
            <span className="px-3 py-1 border-t border-b">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1, date)}
              className="px-2 py-1 text-gray-600 border rounded-r"
            >＋</button>
            <button
              onClick={() => onRemoveItem(item.id, date)}
              className="ml-4 text-red-600"
            >×</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CartDateGroup;
