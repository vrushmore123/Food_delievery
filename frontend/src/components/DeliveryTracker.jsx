import React from 'react';

const DeliveryTracker = ({ status }) => {
  if (!status || status.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No active deliveries. Place an order to track!
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="relative">
        <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
        
        {status.map((step, index) => (
          <div key={step.id} className="relative pb-8 pl-10">
            <div className={`absolute -left-1 top-0 w-6 h-6 rounded-full flex items-center justify-center ${step.active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {step.icon}
            </div>
            <div className={`${step.active ? 'font-medium' : 'text-gray-500'}`}>
              <h3 className="text-lg">{step.title}</h3>
              <p className="text-sm">{step.description}</p>
              {step.time && (
                <p className="text-xs text-gray-400 mt-1">{step.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-md">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600">🚴</span>
          </div>
          <div>
            <h4 className="font-medium">Your delivery partner</h4>
            <p className="text-sm text-gray-600">Thomas is delivering your order</p>
          </div>
        </div>
        <button className="mt-3 w-full py-2 bg-white border border-blue-600 text-blue-600 rounded-md text-sm font-medium">
          Contact Delivery Partner
        </button>
      </div>
    </div>
  );
};

export default DeliveryTracker;