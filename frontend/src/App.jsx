import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  const [location, setLocation] = useState(null);
  const [cluster, setCluster] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);

  // Load user data and order history from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('foodAppUser');
    const savedHistory = localStorage.getItem('foodAppOrderHistory');
    const savedDelivery = localStorage.getItem('foodAppActiveDelivery');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
    if (savedDelivery) setActiveDelivery(JSON.parse(savedDelivery));
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('foodAppOrderHistory', JSON.stringify(orderHistory));
    if (activeDelivery) {
      localStorage.setItem('foodAppActiveDelivery', JSON.stringify(activeDelivery));
    }
  }, [orderHistory, activeDelivery]);

  const completeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      total: orderDetails.total,
      address: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod,
      deliveryInstructions: orderDetails.deliveryInstructions,
      status: orderDetails.status,
      deliveryStatus: orderDetails.deliveryStatus
    };
    
    setOrderHistory([...orderHistory, newOrder]);
    setActiveDelivery(newOrder);
    setCart([]);
    
    // Simulate delivery progress
    simulateDeliveryProgress(newOrder);
  };

  const simulateDeliveryProgress = (order) => {
    // Update to "ready" after 5 minutes
    setTimeout(() => {
      const updatedStatus = [...order.deliveryStatus];
      updatedStatus[1].active = true;
      updatedStatus[1].time = new Date().toLocaleTimeString();
      updatedStatus[0].active = false;
      
      setActiveDelivery(prev => ({
        ...prev,
        deliveryStatus: updatedStatus
      }));
      
      // Update in history
      setOrderHistory(prev => 
        prev.map(o => 
          o.id === order.id 
            ? { ...o, deliveryStatus: updatedStatus } 
            : o
        )
      );
    }, 300000); // 5 minutes
    
    // Update to "on the way" after 10 minutes
    setTimeout(() => {
      const updatedStatus = [...order.deliveryStatus];
      updatedStatus[2].active = true;
      updatedStatus[2].time = new Date().toLocaleTimeString();
      updatedStatus[1].active = false;
      
      setActiveDelivery(prev => ({
        ...prev,
        deliveryStatus: updatedStatus
      }));
      
      setOrderHistory(prev => 
        prev.map(o => 
          o.id === order.id 
            ? { ...o, deliveryStatus: updatedStatus } 
            : o
        )
      );
    }, 600000); // 10 minutes
    
    // Update to "delivered" after 15 minutes
    setTimeout(() => {
      const updatedStatus = [...order.deliveryStatus];
      updatedStatus[3].active = true;
      updatedStatus[3].time = new Date().toLocaleTimeString();
      updatedStatus[2].active = false;
      
      setActiveDelivery(prev => ({
        ...prev,
        status: 'delivered',
        deliveryStatus: updatedStatus
      }));
      
      setOrderHistory(prev => 
        prev.map(o => 
          o.id === order.id 
            ? { ...o, status: 'delivered', deliveryStatus: updatedStatus } 
            : o
        )
      );
    }, 900000); // 15 minutes
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage setLocation={setLocation} />} 
      />
      <Route 
        path="/restaurants" 
        element={
          <RestaurantPage 
            location={location} 
            setCluster={setCluster} 
            cart={cart}
            setCart={setCart}
            orderHistory={orderHistory}
            user={user}
            deliveryStatus={activeDelivery?.deliveryStatus || []}
          />
        } 
      />
      <Route 
        path="/payment" 
        element={
          <PaymentPage 
            cart={cart}
            completeOrder={completeOrder}
            user={user}
          />
        } 
      />
    </Routes>
  );
}

export default App;