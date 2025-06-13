import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RestaurantManagement = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    cuisine_type: "",
    phone: "",
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Replace this with your actual API call
        // For now, using demo data
        setRestaurants([
          {
            id: 1,
            name: "Bistro Delight",
            address: "123 Main Street, City Center",
            description: "Fine dining with a focus on local ingredients",
            cuisine_type: "French, European",
            phone: "+45 12345678",
            rating: 4.5,
          },
          {
            id: 2,
            name: "Grill House",
            address: "456 Elm Street, Downtown",
            description: "Premium steaks and grilled specialties",
            cuisine_type: "American, Steakhouse",
            phone: "+45 23456789",
            rating: 4.7,
          },
          {
            id: 3,
            name: "Asian Fusion",
            address: "789 Maple Avenue, Uptown",
            description: "Blend of various Asian cuisines",
            cuisine_type: "Chinese, Japanese, Thai",
            phone: "+45 34567890",
            rating: 4.3,
          },
        ]);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch restaurants");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call to create restaurant
      // const response = await axios.post('http://localhost:8000/vendor/restaurants/', formData);

      // For demo, just add to the list with a fake ID
      const newRestaurant = {
        ...formData,
        id: restaurants.length + 1,
        rating: 0,
      };

      setRestaurants([...restaurants, newRestaurant]);
      setShowAddForm(false);
      setFormData({
        name: "",
        address: "",
        description: "",
        cuisine_type: "",
        phone: "",
      });
    } catch (error) {
      setError("Failed to add restaurant");
    }
  };

  const navigateToMenu = (restaurant) => {
    // Navigate to Vendor dashboard with the selected restaurant
    navigate(`/admin/${restaurant.id}`, { state: { restaurant } });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl text-red-600 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">
              Restaurant Management
            </h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center"
            >
              {showAddForm ? "Cancel" : "Add Restaurant"}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-100 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-green-700">
                Add New Restaurant
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-green-200 rounded-lg p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-green-200 rounded-lg p-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-green-200 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    name="cuisine_type"
                    value={formData.cuisine_type}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Italian, Chinese, Vegetarian"
                    className="w-full border-2 border-green-200 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border-2 border-green-200 rounded-lg p-3"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md"
                >
                  Add Restaurant
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border-l-4 border-green-500"
              >
                <h3 className="text-xl font-semibold text-green-800">
                  {restaurant.name}
                </h3>
                <div className="flex items-center mt-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(restaurant.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-600 ml-1">
                      ({restaurant.rating.toFixed(1)})
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {restaurant.address}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {restaurant.cuisine_type}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigateToMenu(restaurant)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Manage Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagement;
