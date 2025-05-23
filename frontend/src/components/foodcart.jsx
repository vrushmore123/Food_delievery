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
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        <img 
          src={food.imageUrl} 
          alt={food.name} 
          className="w-full h-40 object-cover"
        />
        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-1">{food.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{food.restaurant}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">{food.price} DKK</span>
            <div className="flex items-center space-x-2">
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
      </div>
    );
  }

  return (
    <div 
      className="relative h-96 w-full rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Front of Card */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
        <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-semibold text-xl">{food.name}</h3>
          <p className="text-gray-200 text-sm">{food.restaurant}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-white font-bold text-lg">{food.price} DKK</span>
            <span className={`px-3 py-1 text-xs rounded-full ${food.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {food.isVegetarian ? 'Veg' : 'Non-Veg'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Back of Card */}
      <div className={`absolute inset-0 bg-white p-6 transition-opacity duration-300 overflow-y-auto ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="font-semibold text-xl mb-3">{food.name}</h3>
        <p className="text-gray-600 mb-4">{food.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">DIETARY INFORMATION</h4>
          <div className="flex flex-wrap gap-2">
            {food.tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-xs bg-gray-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {food.comboPrice && (
          <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-100">
            <p className="text-sm font-semibold text-yellow-800">{food.comboDescription}</p>
            <p className="font-bold">{food.comboPrice} DKK</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center border rounded-md">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;