import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeliveryTracker from './DeliveryTracker';
import OrderHistory from './OrderHistory';

const Sidebar = ({ orderHistory, deliveryStatus, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header with gradient background */}
            <div className="sticky top-0 z-10 bg-white">
              <div className="h-16 bg-gradient-to-r from-orange-50 to-red-50 flex items-center justify-between px-4 border-b border-orange-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {activeTab === 'history' ? 'Your Orders' : 'Delivery Status'}
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b bg-white">
                {['history', 'tracking'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 transition-all duration-300 relative ${
                      activeTab === tab 
                        ? 'text-orange-600 font-semibold' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab === 'history' ? 'Order History' : 'Delivery Tracking'}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                {activeTab === 'history' ? (
                  <OrderHistory orders={orderHistory} />
                ) : (
                  <DeliveryTracker status={deliveryStatus} />
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;