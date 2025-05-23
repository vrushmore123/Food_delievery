import React, { useState } from 'react';
import DeliveryTracker from './DeliveryTracker';
import OrderHistory from './OrderHistory';

const Sidebar = ({ orderHistory, deliveryStatus, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-40 overflow-y-auto`}>
      <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 className="text-xl font-semibold">
          {activeTab === 'history' ? 'Your Orders' : 'Delivery Status'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex border-b sticky top-14 bg-white z-10">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Order History
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex-1 py-3 ${activeTab === 'tracking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
        >
          Delivery Tracking
        </button>
      </div>
      
      <div className="p-4">
        {activeTab === 'history' ? (
          <OrderHistory orders={orderHistory} />
        ) : (
          <DeliveryTracker status={deliveryStatus} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;