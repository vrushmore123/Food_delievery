import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ClusterCard from '../components/ClusterCard';
import FoodCard from '../components/foodcart';
import CartModal from '../components/CartModal';
import CalendarOrder from '../components/CalendarOrder';
import Sidebar from '../components/Sidebar';
import { foodImages } from '../assets/mockFoodImages';
import { useNavigate } from 'react-router-dom';

const RestaurantPage = ({ location, setCluster, cart, setCart, orderHistory, user, deliveryStatus }) => {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCalendarOrder, setShowCalendarOrder] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [filters, setFilters] = useState({
    veg: false,
    nonVeg: false,
    vegan: false,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const clusters = [
    { id: 1, name: 'Nearby (0-2 km)', radius: '0-2 km' },
    { id: 2, name: 'Medium (2-6 km)', radius: '2-6 km' },
    { id: 3, name: 'Far (6+ km)', radius: '6+ km' },
  ];

  const [foodItems, setFoodItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);

  useEffect(() => {
    if (location) {
      const mockFoodItems = generateMockFoodItems(location, selectedCluster);
      setFoodItems(mockFoodItems);
      
      // Generate recommended items based on order history
      const recommended = generateRecommendedItems(mockFoodItems, orderHistory);
      setRecommendedItems(recommended);
    }
  }, [location, selectedCluster, orderHistory]);

  const handleClusterSelect = (cluster) => {
    setSelectedCluster(cluster);
    setCluster(cluster);
  };

  const handleAddToCart = (foodItem, quantity = 1) => {
    const existingItem = cart.find(item => item.id === foodItem.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === foodItem.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { ...foodItem, quantity }]);
    }
  };

  const handleProceedToPay = () => {
    setShowCart(false);
    setShowCalendarOrder(false);
    navigate('/payment');
  };

  const toggleFilter = (filter) => {
    setFilters({
      ...filters,
      [filter]: !filters[filter],
    });
  };

  const filteredFoodItems = foodItems.filter(item => {
    // Filter by dietary preferences
    const dietaryMatch = 
      (!filters.veg && !filters.nonVeg && !filters.vegan) ||
      (filters.veg && item.isVegetarian) ||
      (filters.nonVeg && !item.isVegetarian) ||
      (filters.vegan && item.isVegan);
    
    // Filter by search query
    const searchMatch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    
    return dietaryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        location={location} 
        cluster={selectedCluster} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
        onHistoryClick={() => setShowSidebar(true)}
        onLocationEdit={() => navigate('/')}
        onClusterEdit={() => setSelectedCluster(null)}
        onSearch={setSearchQuery}
      />
      
      <div className="container mx-auto px-4 py-8">
        {!selectedCluster ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-6">Select a cluster in {location}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {clusters.map(cluster => (
                <ClusterCard 
                  key={cluster.id}
                  cluster={cluster}
                  onSelect={() => handleClusterSelect(cluster)}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {recommendedItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {recommendedItems.map(item => (
                    <FoodCard 
                      key={item.id}
                      food={item}
                      onAddToCart={handleAddToCart}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Restaurants in {selectedCluster.name}</h2>
              <button 
                onClick={() => setShowCalendarOrder(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Order for Week/Month
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button 
                onClick={() => toggleFilter('veg')}
                className={`px-3 py-1 rounded-full text-sm ${filters.veg ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100'}`}
              >
                Vegetarian
              </button>
              <button 
                onClick={() => toggleFilter('nonVeg')}
                className={`px-3 py-1 rounded-full text-sm ${filters.nonVeg ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100'}`}
              >
                Non-Vegetarian
              </button>
              <button 
                onClick={() => toggleFilter('vegan')}
                className={`px-3 py-1 rounded-full text-sm ${filters.vegan ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-gray-100'}`}
              >
                Vegan
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {filteredFoodItems.map(food => (
                <FoodCard 
                  key={food.id}
                  food={food}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {showCart && (
        <CartModal 
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={(foodId, newQuantity) => {
            if (newQuantity <= 0) {
              setCart(cart.filter(item => item.id !== foodId));
            } else {
              setCart(cart.map(item => 
                item.id === foodId ? { ...item, quantity: newQuantity } : item
              ));
            }
          }}
          onRemoveItem={(foodId) => {
            setCart(cart.filter(item => item.id !== foodId));
          }}
          onProceedToPay={handleProceedToPay}
        />
      )}
      
      {showCalendarOrder && (
        <CalendarOrder 
          foodItems={foodItems}
          onClose={() => setShowCalendarOrder(false)}
          onAddToCart={handleAddToCart}
          cart={cart}
          onProceedToPay={handleProceedToPay}
        />
      )}
      
      <Sidebar 
        orderHistory={orderHistory}
        deliveryStatus={deliveryStatus}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
    </div>
  );
};

// Helper functions
const generateMockFoodItems = (location, cluster) => {
  const restaurants = [
    { id: 1, name: `${location} Bistro`, rating: 4.5 },
    { id: 2, name: `${location} Grill`, rating: 4.2 },
    { id: 3, name: `${location} Delight`, rating: 4.7 },
  ];
  
  const foodNames = [
    'Margherita Pizza', 'Vegan Burger', 'Chicken Tikka',
    'Pasta Alfredo', 'Salmon Salad', 'Vegetable Stir Fry',
    'Cheesecake', 'Chocolate Mousse', 'Falafel Wrap'
  ];
  
  return Array.from({ length: 12 }, (_, i) => {
    const isVeg = Math.random() > 0.5;
    const isVegan = isVeg && Math.random() > 0.7;
    const basePrice = Math.floor(Math.random() * (238 - 78 + 1)) + 78;
    const comboPrice = Math.floor(basePrice * 0.9 * 5); // 10% discount for combo of 5
    
    return {
      id: i + 1,
      name: foodNames[i % foodNames.length],
      restaurant: restaurants[i % restaurants.length].name,
      restaurantId: restaurants[i % restaurants.length].id,
      rating: restaurants[i % restaurants.length].rating,
      isVegetarian: isVeg,
      isVegan: isVegan,
      tags: [
        isVeg ? 'Vegetarian' : 'Non-Vegetarian',
        isVegan ? 'Vegan' : '',
        Math.random() > 0.7 ? 'Gluten-Free' : '',
        Math.random() > 0.7 ? 'Lactose-Free' : '',
      ].filter(Boolean),
      price: basePrice,
      comboPrice: comboPrice,
      comboDescription: `Combo for 5 people (Save ${basePrice * 5 - comboPrice} DKK)`,
      description: `Delicious ${foodNames[i % foodNames.length]} made with fresh ingredients.`,
      imageUrl: foodImages[i % foodImages.length],
      popularity: Math.floor(Math.random() * 100), // For recommendations
    };
  });
};

const generateRecommendedItems = (allItems, orderHistory) => {
  if (orderHistory.length === 0) {
    // If no order history, recommend popular items
    return [...allItems]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  }
  
  // Get most ordered restaurant IDs
  const restaurantOrderCount = {};
  orderHistory.forEach(order => {
    order.items.forEach(item => {
      restaurantOrderCount[item.restaurantId] = (restaurantOrderCount[item.restaurantId] || 0) + 1;
    });
  });
  
  const favoriteRestaurantId = Object.keys(restaurantOrderCount)
    .reduce((a, b) => restaurantOrderCount[a] > restaurantOrderCount[b] ? a : b);
  
  // Get items from favorite restaurant
  return allItems
    .filter(item => item.restaurantId.toString() === favoriteRestaurantId)
    .slice(0, 5);
};

export default RestaurantPage;