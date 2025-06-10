import React, { useState, useEffect } from "react";
import axios from "axios";

const VendorDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    restaurant_id: "",
  });
  const [user, setUser] = useState(null); // Add user state

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/vendor/menu/");
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch menu items");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Mock function to simulate user role fetching
  const fetchUser = () => {
    // Replace this with your actual user fetching logic
    setUser({ id: 1, name: "John Doe", role: "staff" });
  };

  useEffect(() => {
    fetchUser();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Restrict menu addition to staff/employees only
      if (!user || user.role !== "staff") {
        alert("Only staff/employees can add menus.");
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/vendor/menu/",
        formData
      );
      const updatedResponse = await axios.get(
        "http://localhost:8000/vendor/menu/"
      );
      setMenuItems(updatedResponse.data);
      setFormData({
        name: "",
        price: "",
        description: "",
        restaurant_id: "",
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

          {/* Add Menu Item Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="restaurant_id"
                placeholder="Restaurant ID"
                value={formData.restaurant_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add Item
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>

          {/* Menu Items List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-400">
                    Restaurant ID: {item.restaurant_id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
