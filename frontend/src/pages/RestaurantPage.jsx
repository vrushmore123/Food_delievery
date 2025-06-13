import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import ClusterCard from '../components/ClusterCard';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/foodcart';
import FoodItemModal from '../components/FoodItemModal';
import CartModal from '../components/CartModal';
import CalendarOrder from '../components/CalendarOrder';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const RestaurantPage = ({ location, cluster: initialCluster, setCluster, cart, setCart, orderHistory, user, deliveryStatus }) => {
  const [selectedCluster, setSelectedCluster] = useState(() => {
    const saved = localStorage.getItem('selectedCluster');
    return saved ? JSON.parse(saved) : initialCluster;
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCalendarOrder, setShowCalendarOrder] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  // Expanded filters
  const [filters, setFilters] = useState({
    // Dietary preferences
    glutenFree: false,
    lactoseFree: false,
    vegan: false,
    vegetarian: false,
    organic: false,
    keto: false,
    lowCarb: false,
    // Food types
    snacks: false,
    appetizers: false,
    mainCourse: false,
    desserts: false,
    beverages: false,
    salads: false,
    soups: false,
    // Protein types
    chicken: false,
    beef: false,
    pork: false,
    seafood: false,
    lamb: false,
    // Cuisine types
    italian: false,
    asian: false,
    american: false,
    mexican: false,
    indian: false,
    mediterranean: false,
    french: false,
    thai: false,
    chinese: false,
    japanese: false,
    middle_eastern: false,
    // Price ranges
    budget: false,
    midRange: false,
    premium: false,
    // Special features
    spicy: false,
    mild: false,
    popular: false,
    newItem: false,
    chefSpecial: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const clusters = [
    { id: 1, name: 'Nearby (0-2 km)', radius: '0-2 km' },
    { id: 2, name: 'Medium (2-6 km)', radius: '2-6 km' },
    { id: 3, name: 'Far (6+ km)', radius: '6+ km' },
  ];

  // Enhanced restaurants data with 7-8 restaurants
  const restaurants = [
    {
      id: 1,
      name: 'Bella Italia Ristorante',
      rating: 4.8,
      address: '123 Nyhavn Street, Copenhagen City Center',
      specialties: ['Italian', 'Pizza', 'Pasta', 'Wine'],
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop&auto=format'
    },
    {
      id: 2,
      name: 'Copenhagen Grill House',
      rating: 4.6,
      address: '456 Strøget Avenue, Downtown Copenhagen',
      specialties: ['Steakhouse', 'Grilled', 'Burgers', 'BBQ'],
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop&auto=format'
    },
    {
      id: 3,
      name: 'Nordic Fusion Kitchen',
      rating: 4.9,
      address: '789 Vesterbro Boulevard, Trendy District',
      specialties: ['Nordic', 'Fusion', 'Seafood', 'Modern'],
      imageUrl: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=500&h=300&fit=crop&auto=format'
    },
    {
      id: 4,
      name: 'Tokyo Ramen & Sushi',
      rating: 4.7,
      address: '321 Østerbro Street, Cultural Quarter',
      specialties: ['Japanese', 'Sushi', 'Ramen', 'Asian'],
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop&auto=format'
    },
    {
      id: 5,
      name: 'Mediterranean Delight',
      rating: 4.5,
      address: '654 Amager Boulevard, Seaside Area',
      specialties: ['Mediterranean', 'Greek', 'Healthy', 'Salads'],
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=300&fit=crop&auto=format'
    },
    {
      id: 6,
      name: 'French Bistro Le Petit',
      rating: 4.4,
      address: '987 Frederiksberg Street, Historic Quarter',
      specialties: ['French', 'Bistro', 'Wine', 'Pastries'],
      imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=300&fit=crop&auto=format'
    },
    {
      id: 7,
      name: 'Organic Garden Café',
      rating: 4.6,
      address: '147 Nørrebro Park, Green District',
      specialties: ['Organic', 'Vegetarian', 'Healthy', 'Local'],
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&h=300&fit=crop&auto=format'
    },
    {
      id: 8,
      name: 'Street Food Central',
      rating: 4.3,
      address: '258 Kødbyen Market, Food Hall District',
      specialties: ['Street Food', 'International', 'Quick Bites', 'Diverse'],
      imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=500&h=300&fit=crop&auto=format'
    }
  ];

  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    if (selectedRestaurant) {
      const mockFoodItems = generateMockFoodItems(selectedRestaurant);
      setFoodItems(mockFoodItems);
    }
  }, [selectedRestaurant]);

  // persist whenever user picks a cluster
  const handleClusterSelect = (cluster) => {
    setSelectedCluster(cluster);
    setCluster(cluster);
    localStorage.setItem('selectedCluster', JSON.stringify(cluster));
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleAddToCart = (foodItem, quantity = 1, date = null) => {
    const cartItem = {
      ...foodItem,
      quantity,
      date: date || new Date().toDateString(),
      id: `${foodItem.id}_${date || 'today'}_${Date.now()}`
    };

    setCart(prevCart => [...prevCart, cartItem]);
  };

  const handleUpdateQuantity = (itemId, newQuantity, date) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => !(item.id === itemId && item.date === date)));
    } else {
      setCart(cart.map(item => 
        (item.id === itemId && item.date === date)
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleRemoveItem = (itemId, date) => {
    setCart(cart.filter(item => !(item.id === itemId && item.date === date)));
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
    // Dietary filters
    const dietaryMatch = 
      (!Object.values(filters).some(f => f)) ||
      (filters.glutenFree && item.isGlutenFree) ||
      (filters.lactoseFree && item.isLactoseFree) ||
      (filters.vegan && item.isVegan) ||
      (filters.vegetarian && item.isVegetarian) ||
      (filters.organic && item.isOrganic) ||
      (filters.keto && item.isKeto) ||
      (filters.lowCarb && item.isLowCarb);

    // Food type filters
    const typeMatch = 
      (!filters.snacks && !filters.appetizers && !filters.mainCourse && !filters.desserts && !filters.beverages && !filters.salads && !filters.soups) ||
      (filters.snacks && item.category === 'Snacks') ||
      (filters.appetizers && item.category === 'Appetizers') ||
      (filters.mainCourse && item.category === 'Main Course') ||
      (filters.desserts && item.category === 'Desserts') ||
      (filters.beverages && item.category === 'Beverages') ||
      (filters.salads && item.category === 'Salads') ||
      (filters.soups && item.category === 'Soups');

    // Cuisine filters
    const cuisineMatch = 
      (!filters.italian && !filters.asian && !filters.american && !filters.mexican && !filters.indian && !filters.mediterranean && !filters.french && !filters.thai && !filters.chinese && !filters.japanese && !filters.middle_eastern) ||
      (filters.italian && item.cuisine?.includes('Italian')) ||
      (filters.asian && item.cuisine?.includes('Asian')) ||
      (filters.american && item.cuisine?.includes('American')) ||
      (filters.mexican && item.cuisine?.includes('Mexican')) ||
      (filters.indian && item.cuisine?.includes('Indian')) ||
      (filters.mediterranean && item.cuisine?.includes('Mediterranean')) ||
      (filters.french && item.cuisine?.includes('French')) ||
      (filters.thai && item.cuisine?.includes('Thai')) ||
      (filters.chinese && item.cuisine?.includes('Chinese')) ||
      (filters.japanese && item.cuisine?.includes('Japanese')) ||
      (filters.middle_eastern && item.cuisine?.includes('Middle Eastern'));

    // Price filters
    const priceMatch = 
      (!filters.budget && !filters.midRange && !filters.premium) ||
      (filters.budget && item.price <= 100) ||
      (filters.midRange && item.price > 100 && item.price <= 200) ||
      (filters.premium && item.price > 200);

    // Search match
    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return dietaryMatch && typeMatch && cuisineMatch && priceMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
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
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        {!selectedCluster ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Select Your Delivery Zone in <span className="text-orange-600">{location}</span>
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
        ) : !selectedRestaurant ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Choose a Restaurant in <span className="text-orange-600">{selectedCluster.name}</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover amazing restaurants in your area. Fresh food, fast delivery, and great taste guaranteed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={handleRestaurantSelect}
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
            {/* Restaurant Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedRestaurant.imageUrl}
                    alt={selectedRestaurant.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRestaurant.name}</h2>
                    <p className="text-gray-600">{selectedRestaurant.address}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center text-yellow-500">
                        <span className="mr-1">★</span>
                        {selectedRestaurant.rating}
                      </span>
                      <span className="text-gray-500">25-35 min</span>
                      <span className="text-green-600">Free delivery</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowCalendarOrder(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Plan Weekly Order</span>
                  </button>
                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    Change Restaurant
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Filters Section with Toggle */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100">
              {/* Search and Filter Toggle Header */}
              <div className="flex flex-wrap gap-4 items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2 flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search dishes or restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 border border-orange-100 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {filteredFoodItems.length} of {foodItems.length} items
                  </span>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      showFilters 
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Collapsible Filter Categories */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* Dietary Preferences */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">🥗</span>
                          Dietary Preferences
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['glutenFree', 'lactoseFree', 'vegan', 'vegetarian', 'organic', 'keto', 'lowCarb'].map(filter => (
                            <motion.button
                              key={filter}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleFilter(filter)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                filters[filter]
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                  : 'bg-white/50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Food Categories */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">🍽️</span>
                          Food Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['snacks', 'appetizers', 'mainCourse', 'desserts', 'beverages', 'salads', 'soups'].map(filter => (
                            <motion.button
                              key={filter}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleFilter(filter)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                filters[filter]
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                  : 'bg-white/50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Cuisines */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">🌍</span>
                          Cuisines
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['italian', 'asian', 'american', 'mexican', 'indian', 'mediterranean', 'french', 'thai', 'chinese', 'japanese', 'middle_eastern'].map(filter => (
                            <motion.button
                              key={filter}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleFilter(filter)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                filters[filter]
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                  : 'bg-white/50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {filter.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">💰</span>
                          Price Range
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          { [
                            { key: 'budget', label: 'Budget (Under 100 DKK)' },
                            { key: 'midRange', label: 'Mid-range (100-200 DKK)' },
                            { key: 'premium', label: 'Premium (Above 200 DKK)' }
                          ].map(filter => (
                            <motion.button
                              key={filter.key}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleFilter(filter.key)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                filters[filter.key]
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                                  : 'bg-white/50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {filter.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Clear All Filters */}
                      {Object.values(filters).some(f => f) && (
                        <div className="pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setFilters(prev => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}))}
                            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Clear all filters</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Menu ({filteredFoodItems.length} items)
                </h3>
                <div className="text-sm text-gray-600">
                  {Object.values(filters).some(f => f) && `Filtered from ${foodItems.length} items`}
                </div>
              </div>
              
              {filteredFoodItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFoodItems.map(food => (
                    <FoodCard 
                      key={food.id}
                      food={food}
                      onAddToCart={handleAddToCart}
                      onClick={(item) => setSelectedMenuItem(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Modals */}
      <FoodItemModal
        item={selectedMenuItem}
        isOpen={!!selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCart={handleAddToCart}
      />
      
      {showCart && (
        <CartModal 
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onProceedToPay={handleProceedToPay}
        />
      )}
      
      {showCalendarOrder && (
        <CalendarOrder 
          foodItems={foodItems}
          onClose={() => setShowCalendarOrder(false)}
          onAddToCart={handleAddToCart}
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

// Enhanced food items generator with 20+ items per restaurant
const generateMockFoodItems = (restaurant) => {
  const foodCategories = {
    'Bella Italia Ristorante': [
      // Main Courses (8 items)
      { name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format', price: 165, category: 'Main Course', cuisine: ['Italian'] },
      { name: 'Pasta Carbonara', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&auto=format', price: 145, category: 'Main Course', cuisine: ['Italian'] },
      { name: 'Lasagna Bolognese', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&auto=format', price: 175, category: 'Main Course', cuisine: ['Italian'] },
      { name: 'Seafood Risotto', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&auto=format', price: 195, category: 'Main Course', cuisine: ['Italian'] },
      { name: 'Chicken Parmigiana', image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop&auto=format', price: 185, category: 'Main Course', cuisine: ['Italian'] },
      { name: 'Quattro Stagioni Pizza', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop&auto=format', price: 175, category: 'Main Course', cuisine: ['Italian'] },
      { name: 'Gnocchi Sorrentina', image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop&auto=format', price: 155, category: 'Main Course', cuisine: ['Italian'] },
      { name: 'Osso Buco', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format', price: 225, category: 'Main Course', cuisine: ['Italian'] },
      
      // Appetizers (5 items)
      { name: 'Bruschetta', image: 'https://images.unsplash.com/photo-1572441712966-931d1f3fa936?w=400&h=300&fit=crop&auto=format', price: 55, category: 'Appetizers', cuisine: ['Italian'] },
      { name: 'Antipasto Platter', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Appetizers', cuisine: ['Italian'] },
      { name: 'Arancini', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Appetizers', cuisine: ['Italian'] },
      { name: 'Caprese Salad', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop&auto=format', price: 75, category: 'Appetizers', cuisine: ['Italian'] },
      { name: 'Calamari Fritti', image: 'https://images.unsplash.com/photo-1559847844-d681b5935328?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Appetizers', cuisine: ['Italian'] },
      
      // Salads (3 items)
      { name: 'Caesar Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Salads', cuisine: ['Italian'] },
      { name: 'Arugula & Parmesan', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Salads', cuisine: ['Italian'] },
      { name: 'Mediterranean Salad', image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=400&h=300&fit=crop&auto=format', price: 105, category: 'Salads', cuisine: ['Italian'] },
      
      // Soups (2 items)
      { name: 'Minestrone Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Soups', cuisine: ['Italian'] },
      { name: 'Tomato Basil Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&auto=format', price: 55, category: 'Soups', cuisine: ['Italian'] },
      
      // Desserts (4 items)
      { name: 'Tiramisu', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Desserts', cuisine: ['Italian'] },
      { name: 'Panna Cotta', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format', price: 75, category: 'Desserts', cuisine: ['Italian'] },
      { name: 'Cannoli', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Desserts', cuisine: ['Italian'] },
      { name: 'Gelato Selection', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&auto=format', price: 45, category: 'Desserts', cuisine: ['Italian'] },
      
      // Beverages (3 items)
      { name: 'Italian Wine', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&auto=format', price: 125, category: 'Beverages', cuisine: ['Italian'] },
      { name: 'Espresso', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&auto=format', price: 25, category: 'Beverages', cuisine: ['Italian'] },
      { name: 'Limoncello', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&auto=format', price: 45, category: 'Beverages', cuisine: ['Italian'] }
    ],
    
    'Copenhagen Grill House': [
      // Main Courses (10 items)
      { name: 'Ribeye Steak', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format', price: 285, category: 'Main Course', cuisine: ['American'] },
      { name: 'BBQ Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format', price: 165, category: 'Main Course', cuisine: ['American'] },
      { name: 'Grilled Salmon', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&auto=format', price: 225, category: 'Main Course', cuisine: ['American'] },
      { name: 'BBQ Ribs', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format', price: 245, category: 'Main Course', cuisine: ['American'] },
      { name: 'Grilled Chicken', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&auto=format', price: 185, category: 'Main Course', cuisine: ['American'] },
      { name: 'T-Bone Steak', image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=400&h=300&fit=crop&auto=format', price: 295, category: 'Main Course', cuisine: ['American'] },
      { name: 'Pulled Pork Sandwich', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format', price: 145, category: 'Main Course', cuisine: ['American'] },
      { name: 'Grilled Pork Chops', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop&auto=format', price: 195, category: 'Main Course', cuisine: ['American'] },
      { name: 'Fish & Chips', image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop&auto=format', price: 155, category: 'Main Course', cuisine: ['American'] },
      { name: 'Smoked Brisket', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format', price: 235, category: 'Main Course', cuisine: ['American'] },
      
      // Appetizers (5 items)
      { name: 'Loaded Nachos', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Appetizers', cuisine: ['American'] },
      { name: 'Buffalo Wings', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Appetizers', cuisine: ['American'] },
      { name: 'Onion Rings', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&auto=format', price: 55, category: 'Appetizers', cuisine: ['American'] },
      { name: 'Mozzarella Sticks', image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Appetizers', cuisine: ['American'] },
      { name: 'Potato Skins', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop&auto=format', price: 75, category: 'Appetizers', cuisine: ['American'] },
      
      // Salads (3 items)
      { name: 'Coleslaw', image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=400&h=300&fit=crop&auto=format', price: 45, category: 'Salads', cuisine: ['American'] },
      { name: 'Garden Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Salads', cuisine: ['American'] },
      { name: 'BBQ Chicken Salad', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format', price: 125, category: 'Salads', cuisine: ['American'] },
      
      // Desserts (4 items)
      { name: 'Chocolate Brownie', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&auto=format', price: 75, category: 'Desserts', cuisine: ['American'] },
      { name: 'Apple Pie', image: 'https://images.unsplash.com/photo-1535920527002-b35e96722a64?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Desserts', cuisine: ['American'] },
      { name: 'Cheesecake', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Desserts', cuisine: ['American'] },
      { name: 'Ice Cream Sundae', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Desserts', cuisine: ['American'] },
      
      // Beverages (3 items)
      { name: 'Craft Beer', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Beverages', cuisine: ['American'] },
      { name: 'Milkshake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop&auto=format', price: 55, category: 'Beverages', cuisine: ['American'] },
      { name: 'Iced Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format', price: 35, category: 'Beverages', cuisine: ['American'] }
    ],
    
    'Nordic Fusion Kitchen': [
      // Main Courses (8 items)
      { name: 'Pan-Seared Cod', image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6d3?w=400&h=300&fit=crop&auto=format', price: 235, category: 'Main Course', cuisine: ['Nordic'] },
      { name: 'Arctic Char', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format', price: 265, category: 'Main Course', cuisine: ['Nordic'] },
      { name: 'Venison Medallions', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format', price: 285, category: 'Main Course', cuisine: ['Nordic'] },
      { name: 'Smoked Trout', image: 'https://images.unsplash.com/photo-1559847844-d681b5935328?w=400&h=300&fit=crop&auto=format', price: 195, category: 'Main Course', cuisine: ['Nordic'] },
      { name: 'Duck Breast', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&auto=format', price: 245, category: 'Main Course', cuisine: ['Nordic'] },
      { name: 'Lamb Chops', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop&auto=format', price: 275, category: 'Main Course', cuisine: ['Nordic'] },
      { name: 'Sea Bass', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&auto=format', price: 225, category: 'Main Course', cuisine: ['Nordic'] },
      { name: 'Nordic Tasting Menu', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format', price: 395, category: 'Main Course', cuisine: ['Nordic'] },
      
      // Appetizers (4 items)
      { name: 'Reindeer Carpaccio', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&auto=format', price: 185, category: 'Appetizers', cuisine: ['Nordic'] },
      { name: 'Gravlax', image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop&auto=format', price: 165, category: 'Appetizers', cuisine: ['Nordic'] },
      { name: 'Nordic Cheese Board', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&auto=format', price: 145, category: 'Appetizers', cuisine: ['Nordic'] },
      { name: 'Pickled Herring', image: 'https://images.unsplash.com/photo-1559847844-d681b5935328?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Appetizers', cuisine: ['Nordic'] },
      
      // Salads (3 items)
      { name: 'Nordic Salad Bowl', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format', price: 145, category: 'Salads', cuisine: ['Nordic'] },
      { name: 'Seaweed Salad', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Salads', cuisine: ['Nordic'] },
      { name: 'Root Vegetable Salad', image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=400&h=300&fit=crop&auto=format', price: 105, category: 'Salads', cuisine: ['Nordic'] },
      
      // Soups (2 items)
      { name: 'Mushroom Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Soups', cuisine: ['Nordic'] },
      { name: 'Fish Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Soups', cuisine: ['Nordic'] },
      
      // Desserts (3 items)
      { name: 'Berry Compote', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format', price: 75, category: 'Desserts', cuisine: ['Nordic'] },
      { name: 'Nordic Chocolate', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Desserts', cuisine: ['Nordic'] },
      { name: 'Cloudberry Tart', image: 'https://images.unsplash.com/photo-1535920527002-b35e96722a64?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Desserts', cuisine: ['Nordic'] },
      
      // Beverages (5 items)
      { name: 'Aquavit', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Beverages', cuisine: ['Nordic'] },
      { name: 'Nordic Beer', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop&auto=format', price: 55, category: 'Beverages', cuisine: ['Nordic'] },
      { name: 'Elderflower Drink', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format', price: 45, category: 'Beverages', cuisine: ['Nordic'] },
      { name: 'Lingonberry Juice', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop&auto=format', price: 35, category: 'Beverages', cuisine: ['Nordic'] },
      { name: 'Birch Water', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&auto=format', price: 25, category: 'Beverages', cuisine: ['Nordic'] }
    ]
  };

  // Generate default items for other restaurants with 25+ items each
  const defaultItems = [
    { name: 'Chef Special Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format', price: 195, category: 'Main Course', cuisine: ['International'] },
    { name: 'Teriyaki Chicken', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&auto=format', price: 175, category: 'Main Course', cuisine: ['Asian'] },
    { name: 'Fish Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38174c26afe4?w=400&h=300&fit=crop&auto=format', price: 145, category: 'Main Course', cuisine: ['Mexican'] },
    { name: 'Chicken Tikka Masala', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&auto=format', price: 165, category: 'Main Course', cuisine: ['Indian'] },
    { name: 'Pad Thai', image: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop&auto=format', price: 155, category: 'Main Course', cuisine: ['Thai'] },
    { name: 'Sushi Platter', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&auto=format', price: 225, category: 'Main Course', cuisine: ['Japanese'] },
    { name: 'Greek Gyros', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&auto=format', price: 135, category: 'Main Course', cuisine: ['Mediterranean'] },
    { name: 'French Onion Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Soups', cuisine: ['French'] },
    { name: 'House Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format', price: 95, category: 'Salads', cuisine: ['International'] },
    { name: 'Garlic Bread', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop&auto=format', price: 45, category: 'Appetizers', cuisine: ['International'] },
    { name: 'Chicken Wings', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Appetizers', cuisine: ['American'] },
    { name: 'Vegetable Spring Rolls', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Appetizers', cuisine: ['Asian'] },
    { name: 'Hummus & Pita', image: 'https://images.unsplash.com/photo-1571197827925-b99bbe116b1d?w=400&h=300&fit=crop&auto=format', price: 55, category: 'Appetizers', cuisine: ['Mediterranean'] },
    { name: 'Quesadillas', image: 'https://images.unsplash.com/photo-1565299585323-38174c26afe4?w=400&h=300&fit=crop&auto=format', price: 75, category: 'Appetizers', cuisine: ['Mexican'] },
    { name: 'Samosas', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Appetizers', cuisine: ['Indian'] },
    { name: 'Chocolate Cake', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&auto=format', price: 75, category: 'Desserts', cuisine: ['International'] },
    { name: 'Fruit Salad', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&auto=format', price: 55, category: 'Desserts', cuisine: ['International'] },
    { name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&auto=format', price: 45, category: 'Desserts', cuisine: ['International'] },
    { name: 'Coffee', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&auto=format', price: 25, category: 'Beverages', cuisine: ['International'] },
    { name: 'Fresh Orange Juice', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop&auto=format', price: 35, category: 'Beverages', cuisine: ['International'] },
    { name: 'Smoothie Bowl', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop&auto=format', price: 65, category: 'Beverages', cuisine: ['International'] },
    { name: 'Green Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format', price: 25, category: 'Beverages', cuisine: ['Asian'] },
    { name: 'Lemonade', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&auto=format', price: 30, category: 'Beverages', cuisine: ['International'] },
    { name: 'Energy Bowl', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop&auto=format', price: 85, category: 'Salads', cuisine: ['International'] },
    { name: 'Protein Wrap', image: 'https://images.unsplash.com/photo-1565299585323-38174c26afe4?w=400&h=300&fit=crop&auto=format', price: 105, category: 'Main Course', cuisine: ['International'] }
  ];

  const items = foodCategories[restaurant.name] || defaultItems;

  return items.map((item, index) => ({
    id: index + 1,
    name: item.name,
    restaurant: restaurant.name,
    restaurantId: restaurant.id,
    rating: (4.2 + Math.random() * 0.6).toFixed(1),
    isVegetarian: Math.random() > 0.6,
    isVegan: Math.random() > 0.8,
    isGlutenFree: Math.random() > 0.7,
    isLactoseFree: Math.random() > 0.8,
    isOrganic: Math.random() > 0.9,
    isKeto: Math.random() > 0.85,
    isLowCarb: Math.random() > 0.75,
    calories: Math.floor(Math.random() * (600 - 200) + 200),
    prepTime: `${Math.floor(Math.random() * (25 - 15) + 15)}-${Math.floor(Math.random() * (35 - 25) + 25)} min`,
    tags: ['Popular', restaurant.specialties[0]].filter(Boolean),
    price: item.price,
    category: item.category,
    cuisine: item.cuisine,
    description: `Expertly crafted ${item.name.toLowerCase()} featuring the finest ingredients and traditional cooking methods. A signature dish that represents the authentic flavors of our kitchen.`,
    ingredients: ['Fresh herbs', 'Premium ingredients', 'Local produce', 'Special spices'],
    nutritionalInfo: {
      protein: `${Math.floor(Math.random() * 20 + 10)}g`,
      carbs: `${Math.floor(Math.random() * 40 + 20)}g`,
      fat: `${Math.floor(Math.random() * 15 + 5)}g`,
      fiber: `${Math.floor(Math.random() * 8 + 2)}g`
    },
    allergens: Math.random() > 0.5 ? ['Contains gluten', 'Contains dairy'] : ['Gluten-free', 'Dairy-free'],
    imageUrl: item.image,
    popularity: Math.floor(Math.random() * 100),
    comboPrice: Math.random() > 0.7 ? Math.floor(item.price * 4.5) : null,
    comboDescription: Math.random() > 0.7 ? `Family combo for 5 people (Save ${Math.floor(item.price * 0.5)} DKK)` : null
  }));
};

export default RestaurantPage;