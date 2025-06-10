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
    glutenFree: false,
    lactoseFree: false,
    vegan: false,
    snacks: false,
    chicken: false,
    beef: false,
    pork: false,
    american: false,
    asian: false,
    drinks: false,
    european: false,
    middleEastern: false,
    mediterranean: false,
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
    // Filter by dietary preferences and cuisines
    const dietaryMatch =
      (!filters.glutenFree && !filters.lactoseFree && !filters.vegan && !filters.snacks && !filters.chicken && !filters.beef && !filters.pork) ||
      (filters.glutenFree && item.isGlutenFree) ||
      (filters.lactoseFree && item.isLactoseFree) ||
      (filters.vegan && item.isVegan) ||
      (filters.snacks && item.tags.includes('Snacks')) ||
      (filters.chicken && item.tags.includes('Chicken')) ||
      (filters.beef && item.tags.includes('Beef')) ||
      (filters.pork && item.tags.includes('Pork'));

    const cuisineMatch =
      (!filters.american && !filters.asian && !filters.drinks && !filters.european && !filters.middleEastern && !filters.mediterranean) ||
      (filters.american && item.tags.includes('American')) ||
      (filters.asian && item.tags.includes('Asian')) ||
      (filters.drinks && item.tags.includes('Drinks')) ||
      (filters.european && item.tags.includes('European')) ||
      (filters.middleEastern && item.tags.includes('Middle Eastern')) ||
      (filters.mediterranean && item.tags.includes('Mediterranean'));

    // Filter by search query
    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase());

    return dietaryMatch && cuisineMatch && searchMatch;
  });

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
  };

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
            {/* Filters Section */}
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
                  {['glutenFree', 'lactoseFree', 'vegan', 'snacks', 'chicken', 'beef', 'pork', 'american', 'asian', 'drinks', 'european', 'middleEastern', 'mediterranean'].map(filter => (
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
              </div>
              
              {/* Categorize items by restaurant */}
              {Object.entries(foodItems.reduce((acc, item) => {
                const restaurant = item.restaurant;
                if (!acc[restaurant]) acc[restaurant] = [];
                acc[restaurant].push(item);
                return acc;
              }, {})).map(([restaurant, items]) => (
                <div key={restaurant} className="space-y-4">
                  <h3 className="text-xl font-semibold">{restaurant}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(food => (
                      <motion.div
                        key={food.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleMenuItemClick(food)}
                      >
                        <FoodCard 
                          food={food}
                          onAddToCart={handleAddToCart}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
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

      {/* Menu Item Popup */}
      {selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with Image */}
            <div className="relative">
              <img 
                src={selectedMenuItem.imageUrl} 
                alt={selectedMenuItem.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center space-x-2">
                  {selectedMenuItem.isVegetarian ? (
                    <div className="w-6 h-6 border-2 border-green-600 rounded-sm flex items-center justify-center bg-white">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-red-600 rounded-sm flex items-center justify-center bg-white">
                      <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                    </div>
                  )}
                  <span className="text-white bg-black/50 px-2 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    ⭐ {selectedMenuItem.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title and Price */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {selectedMenuItem.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                    {selectedMenuItem.restaurant}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedMenuItem.price} DKK
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedMenuItem.prepTime} • {selectedMenuItem.calories} cal
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedMenuItem.description}
                </p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMenuItem.ingredients?.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-sm rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nutritional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Nutritional Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {selectedMenuItem.nutritionalInfo && Object.entries(selectedMenuItem.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                      <div className="font-bold text-gray-800 dark:text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dietary Information & Allergens */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Dietary Information</h3>
                  <div className="space-y-2">
                    {selectedMenuItem.isVegetarian && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Vegetarian
                      </div>
                    )}
                    {selectedMenuItem.isVegan && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Vegan
                      </div>
                    )}
                    {selectedMenuItem.isGlutenFree && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Gluten Free
                      </div>
                    )}
                    {selectedMenuItem.isLactoseFree && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Lactose Free
                      </div>
                    )}
                    {selectedMenuItem.isOrganic && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Organic
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Allergen Information</h3>
                  <div className="space-y-2">
                    {selectedMenuItem.allergens?.map((allergen, index) => (
                      <div key={index} className="flex items-center text-yellow-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        {allergen}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedMenuItem, 1);
                    setSelectedMenuItem(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Add to Cart • {selectedMenuItem.price} DKK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

  const detailedDescriptions = [
    'Authentic Italian Margherita pizza with fresh mozzarella, San Marzano tomatoes, fresh basil leaves, and extra virgin olive oil on a crispy wood-fired crust. Made with traditional Italian techniques for an authentic taste experience.',
    'Plant-based burger patty made from black beans, quinoa, and mushrooms, topped with avocado, lettuce, tomato, and vegan mayo on a whole grain bun. Served with sweet potato fries and a side of organic mixed greens.',
    'Tender chicken pieces marinated in yogurt and aromatic spices including garam masala, turmeric, and cardamom. Grilled to perfection and served with basmati rice, mint chutney, and fresh naan bread.',
    'Creamy pasta dish featuring fettuccine noodles tossed in a rich Alfredo sauce made with butter, heavy cream, and freshly grated Parmesan cheese. Garnished with black pepper and fresh parsley.',
    'Fresh Atlantic salmon fillet grilled to perfection, served over a bed of mixed greens, cherry tomatoes, cucumber, red onion, and avocado. Dressed with lemon vinaigrette and topped with toasted seeds.',
    'Colorful medley of fresh seasonal vegetables including bell peppers, broccoli, snap peas, carrots, and mushrooms stir-fried in sesame oil with garlic, ginger, and soy sauce. Served over jasmine rice.',
    'Rich and creamy New York style cheesecake with a graham cracker crust, topped with fresh berry compote and a drizzle of vanilla sauce. Made with premium cream cheese and Madagascar vanilla.',
    'Decadent French chocolate mousse made with Belgian dark chocolate, whipped to airy perfection and topped with fresh whipped cream and dark chocolate shavings. A true indulgence for chocolate lovers.',
    'Mediterranean-style wrap filled with homemade falafel balls, fresh hummus, tabbouleh, cucumber, tomatoes, and tahini sauce in a warm pita bread. Served with pickled vegetables and yogurt sauce.'
  ];

  const ingredients = [
    ['Mozzarella cheese', 'San Marzano tomatoes', 'Fresh basil', 'Pizza dough', 'Olive oil'],
    ['Black bean patty', 'Avocado', 'Lettuce', 'Tomato', 'Whole grain bun', 'Vegan mayo'],
    ['Chicken breast', 'Yogurt', 'Garam masala', 'Turmeric', 'Basmati rice', 'Naan bread'],
    ['Fettuccine pasta', 'Heavy cream', 'Parmesan cheese', 'Butter', 'Black pepper'],
    ['Atlantic salmon', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Avocado', 'Lemon'],
    ['Bell peppers', 'Broccoli', 'Snap peas', 'Carrots', 'Mushrooms', 'Sesame oil', 'Jasmine rice'],
    ['Cream cheese', 'Graham crackers', 'Mixed berries', 'Vanilla extract', 'Sugar'],
    ['Belgian chocolate', 'Heavy cream', 'Eggs', 'Sugar', 'Vanilla extract'],
    ['Chickpeas', 'Hummus', 'Cucumber', 'Tomatoes', 'Pita bread', 'Tahini sauce']
  ];

  const nutritionalInfo = [
    { protein: '14g', carbs: '35g', fat: '12g', fiber: '3g', sodium: '850mg' },
    { protein: '18g', carbs: '45g', fat: '15g', fiber: '12g', sodium: '420mg' },
    { protein: '28g', carbs: '42g', fat: '8g', fiber: '2g', sodium: '980mg' },
    { protein: '15g', carbs: '55g', fat: '22g', fiber: '2g', sodium: '750mg' },
    { protein: '32g', carbs: '12g', fat: '18g', fiber: '8g', sodium: '340mg' },
    { protein: '8g', carbs: '48g', fat: '6g', fiber: '9g', sodium: '620mg' },
    { protein: '8g', carbs: '32g', fat: '28g', fiber: '1g', sodium: '280mg' },
    { protein: '6g', carbs: '24g', fat: '18g', fiber: '3g', sodium: '85mg' },
    { protein: '12g', carbs: '38g', fat: '14g', fiber: '8g', sodium: '590mg' }
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const isVeg = Math.random() > 0.5;
    const isVegan = isVeg && Math.random() > 0.7;
    const basePrice = Math.floor(Math.random() * (238 - 78 + 1)) + 78;
    const comboPrice = Math.floor(basePrice * 0.9 * 5);
    
    return {
      id: i + 1,
      name: foodNames[i % foodNames.length],
      restaurant: restaurants[i % restaurants.length].name,
      restaurantId: restaurants[i % restaurants.length].id,
      rating: restaurants[i % restaurants.length].rating,
      isVegetarian: isVeg,
      isVegan: isVegan,
      isGlutenFree: Math.random() > 0.7,
      isLactoseFree: Math.random() > 0.6,
      isOrganic: Math.random() > 0.8,
      calories: Math.floor(Math.random() * (500 - 150) + 150),
      prepTime: `${Math.floor(Math.random() * (30 - 10) + 10)} min`,
      tags: [
        isVeg ? 'Vegetarian' : 'Non-Vegetarian',
        isVegan ? 'Vegan' : '',
        Math.random() > 0.7 ? 'Gluten-Free' : '',
        Math.random() > 0.7 ? 'Lactose-Free' : '',
        Math.random() > 0.8 ? 'Snacks' : '',
        Math.random() > 0.8 ? 'European' : '',
        Math.random() > 0.9 ? 'Asian' : '',
      ].filter(Boolean),
      price: basePrice,
      comboPrice: comboPrice,
      comboDescription: `Combo for 5 people (Save ${basePrice * 5 - comboPrice} DKK)`,
      description: detailedDescriptions[i % detailedDescriptions.length],
      shortDescription: `Delicious ${foodNames[i % foodNames.length]} made with fresh ingredients and authentic spices.`,
      ingredients: ingredients[i % ingredients.length],
      nutritionalInfo: nutritionalInfo[i % nutritionalInfo.length],
      allergens: Math.random() > 0.5 ? ['Contains gluten', 'Contains dairy'] : ['Nut-free', 'Dairy-free'],
      imageUrl: randomImageUrls[i % randomImageUrls.length],
      popularity: Math.floor(Math.random() * 100),
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