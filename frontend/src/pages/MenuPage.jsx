import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import FoodCard from "../components/foodcart";

const MenuPage = ({ cart, setCart }) => {
  const location = useLocation();
  const { restaurant } = location.state || {};
  const [menuSections] = useState({
    "Main Course": restaurant.menu.filter(
      (item) => item.category === "Main Course"
    ),
    "Soft Drinks": restaurant.menu.filter(
      (item) => item.category === "Soft Drinks"
    ),
    Juices: restaurant.menu.filter((item) => item.category === "Juices"),
  });

  const handleAddToCart = (foodItem, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === foodItem.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === foodItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...foodItem, quantity }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar location={restaurant.name} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Menu for {restaurant.name}
        </h1>
        {Object.entries(menuSections).map(([section, items]) => (
          <div key={section} className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold">{section}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <FoodCard
                  key={item.id}
                  food={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
