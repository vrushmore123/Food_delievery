import React, { useState, useMemo } from 'react';
import { foodImages } from '../assets/mockFoodImages';

const CalendarOrder = ({ foodItems, onClose, onAddToCart, onProceedToPay }) => {
  const [duration, setDuration] = useState('week');
  const dates = useMemo(() => {
    const days = duration === 'week' ? 7 : 30;
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, [duration]);

  // helper to resolve local vs remote URLs
  const resolveImage = (url) =>
    url.startsWith('http')
      ? url
      : `${process.env.PUBLIC_URL}/${url}`;

  // build rotating Unsplash URLs from env
  const randomImgs = Array.from({ length: 5 }, (_, i) =>
    `${process.env.REACT_APP_IMAGE_BASE_URL}/?food&sig=${i}`
  );

  // build items with proper imageUrl
  const items = useMemo(() =>
    foodItems.map((f, i) => ({
      ...f,
      imageUrl: f.imageUrl
        ? resolveImage(f.imageUrl)
        : foodImages[f.id]
          ? resolveImage(foodImages[f.id])
          : randomImgs[i % randomImgs.length]
    }))
  , [foodItems]);

  // store list of {food, qty} per date
  const [selectedPlan, setSelectedPlan] = useState({}); // { dateStr: [{food,qty}, ...] }
  const [dragged, setDragged] = useState(null);

  const handleDragStart = (e, food) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', food.id);
    setDragged(food);
  };

  const handleDrop = (e, dateStr) => {
    e.preventDefault();
    let foodToAdd = dragged;
    if (!foodToAdd) {
      // fallback: read from dataTransfer
      const id = e.dataTransfer.getData('text/plain');
      foodToAdd = items.find(f => f.id.toString() === id);
    }
    if (!foodToAdd) return;
    setSelectedPlan(prev => {
      const list = prev[dateStr] ? [...prev[dateStr]] : [];
      const idx = list.findIndex(i => i.food.id === foodToAdd.id);
      if (idx >= 0) list[idx].qty += 1;
      else list.push({ food: foodToAdd, qty: 1 });
      return { ...prev, [dateStr]: list };
    });
    setDragged(null);
  };
  const updateQty = (dateStr, index, delta) => {
    setSelectedPlan(prev => {
      const list = [...(prev[dateStr]||[])];
      list[index].qty = Math.max(1, list[index].qty + delta);
      return { ...prev, [dateStr]: list };
    });
  };
  const removeItem = (dateStr, index) => {
    setSelectedPlan(prev => {
      const list = [...(prev[dateStr]||[])];
      list.splice(index,1);
      const next = { ...prev };
      if (list.length) next[dateStr] = list;
      else delete next[dateStr];
      return next;
    });
  };

  // total across all dates and items
  const { totalItems, totalPrice } = Object.values(selectedPlan)
    .flat()
    .reduce((acc, { food, qty }) => {
      acc.totalItems += qty;
      acc.totalPrice += food.price * qty;
      return acc;
    }, { totalItems: 0, totalPrice: 0 });

  const deliveryFee = 29;
  const grandTotal = totalPrice + deliveryFee;

  // add helper to add all items of one date
  const handleAddForDate = (dateStr) => {
    const plans = selectedPlan[dateStr] || [];
    plans.forEach(({ food, qty }) =>
      onAddToCart(food, qty, dateStr)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800/50 dark:to-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Plan Your {duration === 'week' ? 'Weekly' : 'Monthly'} Meals
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
        </div>

        {/* Duration Tabs */}
        <div className="px-6 pt-6">
          <div className="flex space-x-4 mb-6">
            {['week', 'month'].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  duration === d 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-orange-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                {d === 'week' ? 'Weekly' : 'Monthly'} Plan
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden px-6">
          {/* Available Meals */}
          <div className="w-full lg:w-1/2 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
              {items.map(f => (
                <div
                  key={f.id}
                  draggable
                  onDragStart={e => handleDragStart(e, f)}
                  onDragEnd={() => setDragged(null)}
                  className="group bg-white dark:bg-gray-700 rounded-xl p-3 cursor-move hover:shadow-lg transition-all duration-300 border border-orange-100/50 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <img src={f.imageUrl} alt={f.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-orange-500 transition-colors">
                        {f.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{f.restaurant}</p>
                      <p className="text-orange-600 dark:text-orange-400 font-semibold mt-1">
                        {f.price} DKK
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="w-full lg:flex-1 mt-6 lg:mt-0 lg:ml-6 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 px-1">
                {dates.map(d => {
                  const key = d.toDateString();
                  const plans = selectedPlan[key] || [];
                  return (
                    <div
                      key={key}
                      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                      onDrop={e => handleDrop(e, key)}
                      className={`p-2 rounded min-h-[100px] flex flex-col justify-start ${plans.length ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">
                          {d.toLocaleDateString('en-US',{ weekday: 'short', day: 'numeric' })}
                        </span>
                        {plans.length > 0 && (
                          <span className="text-[10px] bg-orange-200 text-orange-800 px-1 rounded">
                            {plans.length} item{plans.length>1?'s':''}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1 overflow-y-auto">
                        {plans.map((plan, idx) => (
                          <div key={idx} className="bg-white p-1 rounded flex items-center space-x-1">
                            <img src={plan.food.imageUrl} alt="" className="w-5 h-5 rounded flex-shrink-0" />
                            <span className="text-xs flex-1">{plan.food.name}</span>
                            <button onClick={() => updateQty(key, idx, -1)} className="w-4 h-4 text-sm">−</button>
                            <span className="px-1 text-xs">{plan.qty}</span>
                            <button onClick={() => updateQty(key, idx, 1)} className="w-4 h-4 text-sm">＋</button>
                            <button onClick={() => removeItem(key, idx)} className="ml-1 text-red-500 text-xs">×</button>
                          </div>
                        ))}
                      </div>
                      {plans.length > 0 && (
                        <button
                          onClick={() => handleAddForDate(key)}
                          className="mt-2 text-xs text-blue-500 underline lg:hidden"
                        >
                          Add to Cart for {d.toLocaleDateString()}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Summary & Actions */}
        <div className="p-6 border-t border-orange-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800/50">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Items:</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold">{grandTotal} DKK</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  Object.entries(selectedPlan).forEach(([date, list]) =>
                    list.forEach(({ food, qty }) =>
                      onAddToCart(food, qty, date)
                    )
                  );
                  onClose();
                }}
                disabled={totalItems === 0}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white disabled:opacity-50"
              >
                Add to Cart ({totalItems})
              </button>
              <button
                onClick={() => {
                  Object.entries(selectedPlan).forEach(([date, list]) =>
                    list.forEach(({ food, qty }) =>
                      onAddToCart(food, qty, date)
                    )
                  );
                  onProceedToPay();
                }}
                disabled={totalItems === 0}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white disabled:opacity-50"
              >
                Pay {grandTotal} DKK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarOrder;