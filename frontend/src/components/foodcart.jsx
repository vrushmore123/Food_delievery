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
      <div className="border-2 border-gradient-to-r from-orange-300 to-pink-300 rounded-xl p-4 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50">
        <img src={food.imageUrl} alt={food.name} className="w-full h-36 object-cover rounded-lg mb-3 shadow-md" />
        <h3 className="font-semibold text-base text-gray-800">{food.name}</h3>
        <p className="text-sm text-orange-600 mb-2 font-medium">{food.restaurant}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-orange-700">{food.price} DKK</span>
          <button 
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg text-sm hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        className={`relative h-80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-105
          ${isFlipped 
            ? 'shadow-2xl shadow-orange-500/30 border-4 border-gradient-to-r from-orange-400 via-pink-400 to-purple-400' 
            : 'shadow-xl shadow-orange-300/20 border-3 border-gradient-to-r from-orange-300 to-amber-300'
          }
          hover:shadow-2xl hover:shadow-orange-400/40 
          bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50
          before:absolute before:inset-0 before:rounded-2xl before:p-1 
          before:bg-gradient-to-r before:from-orange-400 before:via-pink-400 before:to-purple-400 
          before:-z-10 before:blur-sm before:opacity-70 hover:before:opacity-100
          before:transition-opacity before:duration-300`}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        style={{
          background: isFlipped 
            ? 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)'
            : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
          boxShadow: isFlipped 
            ? '0 25px 50px -12px rgba(251, 146, 60, 0.4), 0 0 30px rgba(251, 146, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 20px 25px -5px rgba(251, 146, 60, 0.2), 0 10px 10px -5px rgba(251, 146, 60, 0.1), 0 0 20px rgba(251, 146, 60, 0.1)'
        }}
      >
        {/* Front Side */}
        <div className={`absolute inset-0 transition-all duration-700 transform-gpu ${
          isFlipped ? 'opacity-0 rotate-y-180 scale-95' : 'opacity-100 rotate-y-0 scale-100'
        }`}>
          <div className="relative h-full">
            <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{food.name}</h3>
              <p className="text-orange-200 text-sm font-medium mb-3 drop-shadow">{food.restaurant}</p>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-xl drop-shadow-lg bg-orange-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  {food.price} DKK
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border-2 ${
                  food.isVegetarian 
                    ? 'bg-green-100/90 text-green-800 border-green-300' 
                    : 'bg-red-100/90 text-red-800 border-red-300'
                }`}>
                  {food.isVegetarian ? '🌱 Veg' : '🍖 Non-Veg'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Side */}
        <div className={`absolute inset-0 p-6 transition-all duration-700 transform-gpu flex flex-col ${
          isFlipped ? 'opacity-100 rotate-y-0 scale-100' : 'opacity-0 rotate-y-180 scale-95'
        }`}>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-3 text-gray-800 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {food.name}
            </h3>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed bg-white/50 p-3 rounded-lg backdrop-blur-sm">
              {food.description}
            </p>
            
            <div className="mb-4">
              <h4 className="text-xs font-bold text-orange-700 mb-2 uppercase tracking-wider">Dietary Info</h4>
              <div className="flex flex-wrap gap-2">
                {food.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs bg-gradient-to-r from-orange-200 to-amber-200 text-orange-800 font-medium rounded-full border border-orange-300 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {food.comboPrice && (
              <div className="mb-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-300 shadow-inner">
                <p className="text-xs font-bold text-yellow-800 mb-1">🎉 {food.comboDescription}</p>
                <p className="text-lg font-bold text-orange-700">{food.comboPrice} DKK</p>
              </div>
            )}
          </div>
          
          {/* Add to Cart Section - Always Visible */}
          <div className="mt-auto pt-4 border-t-2 border-orange-200 bg-white/30 backdrop-blur-sm rounded-xl p-4 -m-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-white rounded-xl shadow-lg border-2 border-orange-200 overflow-hidden">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="px-4 py-2 text-orange-600 hover:bg-orange-100 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="px-4 py-2 font-bold text-gray-800 bg-orange-50 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(quantity + 1);
                  }}
                  className="px-4 py-2 text-orange-600 hover:bg-orange-100 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl text-sm font-bold 
                  hover:from-orange-600 hover:to-red-600 transform hover:scale-110 transition-all duration-200 
                  shadow-lg hover:shadow-xl active:scale-95 border-2 border-orange-300"
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component to show 4 cards in a row
const FoodCardDemo = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (food, quantity) => {
    setCart(prev => [...prev, { ...food, quantity }]);
    console.log(`Added ${quantity}x ${food.name} to cart`);
  };

  const sampleFoods = [
    {
      id: 1,
      name: "Spicy Margherita Pizza",
      restaurant: "Tony's Italian",
      price: 120,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      description: "A classic margherita with a spicy twist, featuring fresh mozzarella, basil, and our signature spicy tomato sauce.",
      isVegetarian: true,
      tags: ["Vegetarian", "Spicy", "Italian"],
      comboPrice: 180,
      comboDescription: "Pizza + Garlic Bread + Coke"
    },
    {
      id: 2,
      name: "Gourmet Burger",
      restaurant: "Burger Palace",
      price: 95,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      description: "Juicy beef patty with aged cheddar, crispy bacon, fresh lettuce, and our special house sauce.",
      isVegetarian: false,
      tags: ["Beef", "Cheese", "Bacon"],
      comboPrice: 135,
      comboDescription: "Burger + Fries + Drink"
    },
    {
      id: 3,
      name: "Chicken Tikka Masala",
      restaurant: "Spice Garden",
      price: 110,
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      description: "Tender chicken pieces in a rich, creamy tomato-based curry sauce with aromatic Indian spices.",
      isVegetarian: false,
      tags: ["Indian", "Spicy", "Creamy", "Chicken"]
    },
    {
      id: 4,
      name: "Avocado Toast Deluxe",
      restaurant: "Green Café",
      price: 75,
      imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
      description: "Artisanal sourdough topped with smashed avocado, cherry tomatoes, feta cheese, and a drizzle of olive oil.",
      isVegetarian: true,
      tags: ["Healthy", "Vegetarian", "Fresh", "Organic"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          ✨ Delicious Food Collection ✨
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sampleFoods.map(food => (
            <FoodCard 
              key={food.id} 
              food={food} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {cart.length > 0 && (
          <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-200 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-orange-700">🛒 Cart Items: {cart.length}</h2>
            <div className="space-y-2">
              {cart.map((item, index) => (
                <p key={index} className="text-gray-700">
                  {item.quantity}x {item.name} - {item.price * item.quantity} DKK
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCardDemo;