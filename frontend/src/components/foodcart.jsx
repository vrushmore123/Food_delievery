import React, { useState } from 'react';

const FoodCard = ({ food, onAddToCart, compact = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(food, quantity);
    setQuantity(1);
  };

  if (compact) {
    return (
      <div className="border rounded-md p-3 hover:shadow-md transition-shadow">
        <img src={food.imageUrl} alt={food.name} className="w-full h-32 object-cover rounded mb-2" />
        <h3 className="font-medium text-sm">{food.name}</h3>
        <p className="text-xs text-gray-600 mb-1">{food.restaurant}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold">{food.price} DKK</span>
          <button 
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${compact ? 'h-48' : 'h-64'} rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:shadow-lg`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`absolute inset-0 transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
        <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-semibold">{food.name}</h3>
          <p className="text-gray-300 text-sm">{food.restaurant}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-white font-bold">{food.price} DKK</span>
            <span className={`px-2 py-1 text-xs rounded-full ${food.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {food.isVegetarian ? 'Veg' : 'Non-Veg'}
            </span>
          </div>
        </div>
      </div>
      
      <div className={`absolute inset-0 bg-white p-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="font-semibold mb-2">{food.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{food.description}</p>
        
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-500 mb-1">DIETARY</h4>
          <div className="flex flex-wrap gap-1">
            {food.tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {food.comboPrice && (
          <div className="mb-3 p-2 bg-yellow-50 rounded border border-yellow-100">
            <p className="text-xs font-semibold text-yellow-800">{food.comboDescription}</p>
            <p className="text-sm font-bold">{food.comboPrice} DKK</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border rounded-md">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="px-2 py-1 text-gray-600"
            >
              -
            </button>
            <span className="px-2">{quantity}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              className="px-2 py-1 text-gray-600"
            >
              +
            </button>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;