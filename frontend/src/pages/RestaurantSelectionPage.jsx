import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ClusterCard from "../components/ClusterCard";

const RestaurantSelectionPage = ({
  location,
  clusters = [
    { id: 1, name: "Nearby (0-2 km)" },
    { id: 2, name: "Medium (2-6 km)" },
    { id: 3, name: "Far (6+ km)" },
  ],
  setCluster,
  restaurants = [
    {
      id: 1,
      name: "Bistro Delight",
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      rating: 4.5,
      address: "123 Main Street, City Center",
      specialties: ["Italian", "Pizza", "Pasta"],
    },
    {
      id: 2,
      name: "Grill House",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      rating: 4.2,
      address: "456 Elm Street, Downtown",
      specialties: ["Barbecue", "Steaks", "Burgers"],
    },
    {
      id: 3,
      name: "Asian Fusion",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      rating: 4.7,
      address: "789 Maple Avenue, Uptown",
      specialties: ["Chinese", "Japanese", "Thai"],
    },
    {
      id: 4,
      name: "Mediterranean Feast",
      imageUrl:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      rating: 4.6,
      address: "321 Oak Street, Suburbs",
      specialties: ["Mediterranean", "Seafood", "Salads"],
    },
    {
      id: 5,
      name: "Sweet Treats",
      imageUrl:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
      rating: 4.8,
      address: "654 Pine Street, City Center",
      specialties: ["Desserts", "Cakes", "Ice Cream"],
    },
  ],
}) => {
  const navigate = useNavigate();
  const [selectedCluster, setSelectedCluster] = useState(null);

  const handleClusterSelect = (cluster) => {
    setSelectedCluster(cluster);
    setCluster(cluster);
  };

  const handleRestaurantSelect = (restaurant) => {
    navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar location={location} />
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
              {clusters.map((cluster) => (
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
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Select a Restaurant in {selectedCluster.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <motion.div
                  key={restaurant.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleRestaurantSelect(restaurants)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-full object-cover shadow-md"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Rating: ⭐ {restaurant.rating}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">Address:</span>{" "}
                    {restaurant.address}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Specialties:</span>{" "}
                    {restaurant.specialties?.join(", ") ||
                      "No specialties available"}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RestaurantSelectionPage;
