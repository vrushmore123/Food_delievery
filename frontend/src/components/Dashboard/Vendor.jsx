import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VendorDashboard = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    restaurant_id: "",
  });
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState({
    Italian: false,
    Pizza: false,
    Pasta: false,
    Barbecue: false,
    Steaks: false,
    Burgers: false,
    Chinese: false,
    Japanese: false,
    Thai: false,
    Mediterranean: false,
    Seafood: false,
    Salads: false,
    Desserts: false,
    Cakes: false,
    IceCream: false,
  });
  const [location, setLocation] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch available restaurants
    const fetchRestaurants = async () => {
      try {
        // Simulated data - replace with actual API call
        setRestaurants([
          { id: 1, name: "Bistro Delight", address: "123 Main St" },
          { id: 2, name: "Grill House", address: "456 Oak Ave" },
          { id: 3, name: "Asian Fusion", address: "789 Elm Blvd" },
        ]);
      } catch (error) {
        setError("Failed to fetch restaurants");
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Set the selected restaurant based on URL param
    const restaurant = restaurants.find((r) => r.id === parseInt(id));
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setLoading(false);
    }
  }, [id, restaurants]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const mockMenuItems = [
          {
            id: 1,
            name: "Margherita Pizza",
            price: 89.99,
            description: "Fresh tomatoes, mozzarella, basil",
            restaurant_id: parseInt(id),
            categories: ["Italian", "Pizza"],
          },
          {
            id: 2,
            name: "Pasta Carbonara",
            price: 79.99,
            description: "Creamy sauce with bacon and parmesan",
            restaurant_id: parseInt(id),
            categories: ["Italian", "Pasta"],
          },
        ];
        setMenuItems(mockMenuItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to fetch menu items");
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuItems();
    }
  }, [id]);

  const fetchUser = () => {
    setUser({ id: 1, name: "John Doe", role: "staff" });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // Simulate fetching location
    setLocation("123 Main Street, City Center");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "restaurant_id"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setCategories((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // When submitting the form, use the selected restaurant's ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user || user.role !== "staff") {
        alert("Only staff/employees can add menus.");
        return;
      }
      if (!selectedRestaurant) {
        alert("Please select a restaurant first.");
        return;
      }
      const categoryList = Object.keys(categories).filter(
        (key) => categories[key]
      );

      const response = await axios.post("http://localhost:8000/vendor/menu/", {
        ...formData,
        restaurant_id: selectedRestaurant.id,
        location,
        categories: categoryList,
      });

      // Refresh menu items
      const updatedResponse = await axios.get(
        `http://localhost:8000/vendor/menu/?restaurant_id=${selectedRestaurant.id}`
      );
      setMenuItems(updatedResponse.data);

      // Reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        restaurant_id: selectedRestaurant.id,
      });
      setCategories({
        Italian: false,
        Pizza: false,
        Pasta: false,
        Barbecue: false,
        Steaks: false,
        Burgers: false,
        Chinese: false,
        Japanese: false,
        Thai: false,
        Mediterranean: false,
        Seafood: false,
        Salads: false,
        Desserts: false,
        Cakes: false,
        IceCream: false,
      });
      setError("");
    } catch (error) {
      setError("Failed to add menu item");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
          <h1 className="text-3xl font-bold mb-8 text-green-800 flex items-center">
            <svg
              className="w-8 h-8 mr-3 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Vendor Dashboard
          </h1>

          {/* Restaurant Selection */}
          {!selectedRestaurant ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-green-700">
                Select a Restaurant
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-green-100 cursor-pointer transition-all hover:bg-green-50"
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <h3 className="text-xl font-semibold text-green-700">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{restaurant.address}</p>
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-green-700">
                    {selectedRestaurant.name}
                  </h2>
                  <p className="text-gray-600">{selectedRestaurant.address}</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200"
                  >
                    Change Restaurant
                  </button>

                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center"
                  >
                    {showAddForm ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Close Form
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Menu Item
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rest of the dashboard content */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Add Menu Item Form - Hidden by default, shown when button clicked */}
                {showAddForm && (
                  <div className="lg:col-span-2 bg-green-50 p-6 rounded-xl shadow-md border border-green-100">
                    <h2 className="text-2xl font-semibold mb-6 text-green-700 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add New Menu Item
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">
                          Item Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="e.g., Vegetable Pasta"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border-2 border-green-200 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">
                          Price (DKK)
                        </label>
                        <input
                          type="number"
                          name="price"
                          placeholder="e.g., 99.00"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full border-2 border-green-200 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          placeholder="Describe your delicious menu item..."
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full border-2 border-green-200 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                          rows="3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">
                          Restaurant ID
                        </label>
                        <input
                          type="number"
                          name="restaurant_id"
                          placeholder="Restaurant identification number"
                          value={formData.restaurant_id}
                          onChange={handleChange}
                          className="w-full border-2 border-green-200 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
                          required
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-700">
                          Categories
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(categories).map((category) => (
                            <label
                              key={category}
                              className="flex items-center space-x-2 p-2 hover:bg-green-100 rounded-md transition-colors"
                            >
                              <input
                                type="checkbox"
                                name={category}
                                checked={categories[category]}
                                onChange={handleCategoryChange}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 rounded"
                              />
                              <span className="text-gray-700">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-green-700">
                          Location
                        </h3>
                        <input
                          type="text"
                          value={location}
                          readOnly
                          className="w-full border-2 border-green-200 rounded-lg p-3 bg-green-50 text-gray-600"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Menu Item
                      </button>
                      {error && (
                        <p className="text-red-500 bg-red-50 p-3 rounded-lg text-center">
                          {error}
                        </p>
                      )}
                    </form>
                  </div>
                )}

                {/* Menu Items List - Make it full width when form is hidden */}
                <div
                  className={`${
                    showAddForm ? "lg:col-span-3" : "lg:col-span-5"
                  }`}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-green-700 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Your Menu Items
                  </h2>
                  <div
                    className={`grid grid-cols-1 ${
                      showAddForm
                        ? "md:grid-cols-2"
                        : "md:grid-cols-3 lg:grid-cols-4"
                    } gap-6`}
                  >
                    {menuItems.length === 0 ? (
                      <div className="col-span-full bg-green-50 p-8 rounded-lg border border-green-100 text-center text-green-700">
                        <svg
                          className="w-12 h-12 mx-auto text-green-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-lg">
                          No menu items yet. Add your first item to get started!
                        </p>
                      </div>
                    ) : (
                      menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-green-500"
                        >
                          <h3 className="font-semibold text-lg text-green-800">
                            {item.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className="font-bold text-green-600">
                              DKK {item.price.toFixed(2)}
                            </span>
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              ID: {item.restaurant_id}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">
                            {item.description}
                          </p>
                          {item.categories && item.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="px-2 py-1 bg-green-50 text-xs text-green-700 rounded-full border border-green-200"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
