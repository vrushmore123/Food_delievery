import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ClusterCard from '../components/ClusterCard';
import FoodCard from '../components/foodcart';
import CartModal from '../components/CartModal';
import CalendarOrder from '../components/CalendarOrder';
import Sidebar from '../components/Sidebar';
import { foodImages } from '../assets/mockFoodImages';
import { useNavigate } from 'react-router-dom';

const RestaurantPage = ({ location, cluster: initialCluster, setCluster, cart, setCart, orderHistory, user, deliveryStatus }) => {
  // initialize from localStorage or prop
  const [selectedCluster, setSelectedCluster] = useState(() => {
    const saved = localStorage.getItem('selectedCluster');
    return saved ? JSON.parse(saved) : initialCluster;
  });
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

  // persist whenever user picks a cluster
  const handleClusterSelect = (cluster) => {
    setSelectedCluster(cluster);
    setCluster(cluster);
    localStorage.setItem('selectedCluster', JSON.stringify(cluster));
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 relative z-10"
      >
        {!selectedCluster ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Select Your Delivery Zone in {location}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {clusters.map(cluster => (
                <ClusterCard 
                  key={cluster.id}
                  cluster={cluster}
                  onSelect={() => handleClusterSelect(cluster)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Search and Filters Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-2 flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search dishes or restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-orange-100 dark:border-gray-600 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  {['veg', 'nonVeg', 'vegan'].map(filter => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFilter(filter)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        filters[filter]
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-white/50 dark:bg-gray-700/50 hover:bg-orange-50 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      {filter === 'veg' && '🌱 '}
                      {filter === 'nonVeg' && '🍖 '}
                      {filter === 'vegan' && '🥬 '}
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Section */}
            {recommendedItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Recommended For You
                  </h2>
                  <div className="h-0.5 flex-grow bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

            {/* Main Menu Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Available Menu
                  </h2>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full"></div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCalendarOrder(true)}
                  className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  🗓️ Plan Weekly Order
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFoodItems.map(food => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FoodCard 
                      food={food}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
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
const randomImageUrls = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop'
];

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
      isGlutenFree: Math.random() > 0.7,
      isOrganic: Math.random() > 0.8,
      calories: Math.floor(Math.random() * (500 - 150) + 150),
      prepTime: `${Math.floor(Math.random() * (30 - 10) + 10)} min`,
      tags: [
        isVeg ? 'Vegetarian' : 'Non-Vegetarian',
        isVegan ? 'Vegan' : '',
        Math.random() > 0.7 ? 'Gluten-Free' : '',
        Math.random() > 0.7 ? 'Lactose-Free' : '',
      ].filter(Boolean),
      price: basePrice,
      comboPrice: comboPrice,
      comboDescription: `Combo for 5 people (Save ${basePrice * 5 - comboPrice} DKK)`,
      description: `Delicious ${foodNames[i % foodNames.length]} made with fresh ingredients and authentic spices.`,
      // assign a random internet image URL for every item
      imageUrl: randomImageUrls[i % randomImageUrls.length],
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