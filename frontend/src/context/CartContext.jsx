import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDefaultDeliveryTime } from '../utils/cartUtils';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('foodAppCart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse saved cart:", e);
      }
    }
    return {
      dateGroups: {},
      isRecurring: false,
      recurringFrequency: 'weekly'
    };
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodAppCart', JSON.stringify(cart));
  }, [cart]);
  
  // Add item to cart for a specific date
  const addItemToCart = (date, item, quantity = 1, specialInstructions = "") => {
    const dateKey = date ? new Date(date).toISOString() : new Date().toISOString();
    
    setCart(prevCart => {
      // Create deep copy of cart
      const updatedCart = { ...prevCart };
      
      // If this date doesn't exist yet, initialize it
      if (!updatedCart.dateGroups[dateKey]) {
        updatedCart.dateGroups[dateKey] = {
          date: dateKey,
          items: [],
          deliveryTime: getDefaultDeliveryTime(dateKey),
          isExpanded: true
        };
      }
      
      // Check if item already exists for this date
      const existingItemIndex = updatedCart.dateGroups[dateKey].items.findIndex(
        i => i.id === item.id
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedCart.dateGroups[dateKey].items[existingItemIndex].quantity += quantity;
        
        // Update special instructions if provided
        if (specialInstructions) {
          updatedCart.dateGroups[dateKey].items[existingItemIndex].specialInstructions = specialInstructions;
        }
      } else {
        // Add new item
        updatedCart.dateGroups[dateKey].items.push({
          ...item,
          quantity,
          specialInstructions
        });
      }
      
      return updatedCart;
    });
  };
  
  // Update item quantity
  const updateItemQuantity = (dateKey, itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeItem(dateKey, itemId);
    }
    
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      
      if (!updatedCart.dateGroups[dateKey]) return prevCart;
      
      const itemIndex = updatedCart.dateGroups[dateKey].items.findIndex(
        i => i.id === itemId
      );
      
      if (itemIndex === -1) return prevCart;
      
      updatedCart.dateGroups[dateKey].items[itemIndex].quantity = newQuantity;
      
      return updatedCart;
    });
  };
  
  // Remove item from cart
  const removeItem = (dateKey, itemId) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      
      if (!updatedCart.dateGroups[dateKey]) return prevCart;
      
      updatedCart.dateGroups[dateKey].items = updatedCart.dateGroups[dateKey].items.filter(
        i => i.id !== itemId
      );
      
      // If no more items for this date, remove the date group
      if (updatedCart.dateGroups[dateKey].items.length === 0) {
        delete updatedCart.dateGroups[dateKey];
      }
      
      return updatedCart;
    });
  };
  
  // Remove entire date group
  const removeDateGroup = (dateKey) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      delete updatedCart.dateGroups[dateKey];
      return updatedCart;
    });
  };
  
  // Change delivery time for a date
  const changeDeliveryTime = (dateKey, newTime) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      
      if (!updatedCart.dateGroups[dateKey]) return prevCart;
      
      updatedCart.dateGroups[dateKey].deliveryTime = newTime;
      
      return updatedCart;
    });
  };
  
  // Toggle recurring order
  const toggleRecurring = (isRecurring) => {
    setCart(prevCart => ({
      ...prevCart,
      isRecurring
    }));
  };
  
  // Set recurring frequency
  const setRecurringFrequency = (frequency) => {
    setCart(prevCart => ({
      ...prevCart,
      recurringFrequency: frequency
    }));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart({
      dateGroups: {},
      isRecurring: false,
      recurringFrequency: 'weekly'
    });
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addItemToCart,
      updateItemQuantity,
      removeItem,
      removeDateGroup,
      changeDeliveryTime,
      toggleRecurring,
      setRecurringFrequency,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
