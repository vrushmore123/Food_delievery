import { useEffect, useState } from "react";
import { Search, Filter, Star, ShoppingCart, ChevronDown } from "lucide-react";

const mockData = [
  {
    id: 1,
    name: "Margherita Pizza",
    description:
      "Classic pizza with tomato sauce and mozzarella cheese. Made with fresh ingredients and baked in a wood-fired oven.",
    price: 10.99,
    category: "Pizza",
    rating: 4.5,
    calories: 850,
    dietaryInfo: ["Vegetarian"],
    prepTime: "15 mins",
    image: "./pizza.jpeg",
  },
  {
    id: 2,
    name: "Veggie Burger",
    description:
      "Grilled veggie patty with fresh lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun.",
    price: 8.5,
    category: "Burgers",
    rating: 4.2,
    calories: 580,
    dietaryInfo: ["Vegetarian", "Vegan option"],
    prepTime: "10 mins",
    image: "./burger.jpeg",
  },
  {
    id: 3,
    name: "Pasta Alfredo",
    description:
      "Creamy Alfredo pasta topped with parmesan. Served with garlic bread on the side.",
    price: 12.0,
    category: "Pasta",
    rating: 4.7,
    calories: 950,
    dietaryInfo: ["Vegetarian"],
    prepTime: "20 mins",
    image: "./pasta.jpeg",
  },
  {
    id: 4,
    name: "Caesar Salad",
    description:
      "Fresh romaine lettuce with Caesar dressing, croutons, and shaved parmesan cheese.",
    price: 7.99,
    category: "Salads",
    rating: 4.0,
    calories: 320,
    dietaryInfo: ["Gluten-free option"],
    prepTime: "5 mins",
    image: "./salad.jpeg",
  },
];

const categories = [
  "All",
  "Pizza",
  "Burgers",
  "Pasta",
  "Salads",
  "Desserts",
  "Beverages",
];

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("recommended");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Replace with real API call later
    let filteredItems = [...mockData];

    // Apply search filter
    if (searchTerm) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filteredItems = filteredItems.filter(
        (item) => item.category === selectedCategory
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filteredItems.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredItems.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredItems.sort((a, b) => b.rating - a.rating);
        break;
      default: // recommended - no special sorting, default order
        break;
    }

    setMenuItems(filteredItems);
  }, [searchTerm, selectedCategory, sortOption]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
    // In a real app, would include quantity management and localStorage persistence
  };

  // Format price as currency
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Render stars based on rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    }
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-orange-600">
                Delicious Eats
              </h1>
              <p className="text-gray-500">Fresh food delivered to your door</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2">
                <ShoppingCart className="text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/avatar.jpg"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                  }}
                />
                <span className="hidden md:inline text-gray-700">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Search and Filter Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-lg">
              <input
                type="text"
                placeholder="Search for food..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-orange-200 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
            </div>

            {/* Category Pills */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex justify-end mt-4">
            <div className="relative w-48">
              <select
                className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring focus:ring-orange-200 focus:border-orange-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-2.5 text-gray-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </section>

        {/* Results Count */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            {menuItems.length} {menuItems.length === 1 ? "item" : "items"}{" "}
            {selectedCategory !== "All" ? `in ${selectedCategory}` : ""}
          </h2>
        </section>

        {/* Menu Grid */}
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }}
                  />
                  <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {item.prepTime}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <span className="font-semibold text-orange-600">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-1">{renderRating(item.rating)}</div>

                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Dietary Info */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.dietaryInfo.map((info) => (
                      <span
                        key={info}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {info}
                      </span>
                    ))}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {item.calories} cal
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              No items found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSortOption("recommended");
              }}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Delicious Eats</h3>
              <p className="text-gray-400">
                Serving the best food in town since 2020.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Hours</h3>
              <p className="text-gray-400">Monday - Friday: 8am - 10pm</p>
              <p className="text-gray-400">Saturday - Sunday: 9am - 11pm</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-400">123 Main Street</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
              <p className="text-gray-400">Email: info@deliciouseats.com</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 Delicious Eats. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
