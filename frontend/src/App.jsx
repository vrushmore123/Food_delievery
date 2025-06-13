import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import PaymentPage from "./pages/Paymentpage";
import OtpVerificationPopup from "./components/OtpVerificationPopup";
import RestaurantSelectionPage from "./pages/RestaurantSelectionPage";
import MenuPage from "./pages/MenuPage";
import VendorDashboard from "./components/Dashboard/Vendor";
import RestaurantManagement from "./pages/RestaurantManagement";
import './styles/card-flip.css'; // Import the card flip styles

function App() {
  const navigate = useNavigate();
  // hydrate from localStorage
  const [location, setLocation] = useState(
    () => localStorage.getItem("selectedCity") || ""
  );
  const [cluster, setCluster] = useState(
    () => JSON.parse(localStorage.getItem("selectedCluster")) || null
  );
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("foodAppUser");
    const savedHistory = localStorage.getItem("foodAppOrderHistory");
    const savedDelivery = localStorage.getItem("foodAppActiveDelivery");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
    if (savedDelivery) setActiveDelivery(JSON.parse(savedDelivery));
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem("foodAppOrderHistory", JSON.stringify(orderHistory));
    if (activeDelivery) {
      localStorage.setItem(
        "foodAppActiveDelivery",
        JSON.stringify(activeDelivery)
      );
    }
  }, [orderHistory, activeDelivery]);

  // persist location and cluster changes
  useEffect(() => {
    if (location) localStorage.setItem("selectedCity", location);
  }, [location]);
  useEffect(() => {
    if (cluster)
      localStorage.setItem("selectedCluster", JSON.stringify(cluster));
  }, [cluster]);

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
      deliveryStatus: orderDetails.deliveryStatus,
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

      setActiveDelivery((prev) => ({
        ...prev,
        deliveryStatus: updatedStatus,
      }));

      // Update in history
      setOrderHistory((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, deliveryStatus: updatedStatus } : o
        )
      );
    }, 300000); // 5 minutes

    // Update to "on the way" after 10 minutes
    setTimeout(() => {
      const updatedStatus = [...order.deliveryStatus];
      updatedStatus[2].active = true;
      updatedStatus[2].time = new Date().toLocaleTimeString();
      updatedStatus[1].active = false;

      setActiveDelivery((prev) => ({
        ...prev,
        deliveryStatus: updatedStatus,
      }));

      setOrderHistory((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, deliveryStatus: updatedStatus } : o
        )
      );
    }, 600000); // 10 minutes

    // Update to "delivered" after 15 minutes
    setTimeout(() => {
      const updatedStatus = [...order.deliveryStatus];
      updatedStatus[3].active = true;
      updatedStatus[3].time = new Date().toLocaleTimeString();
      updatedStatus[2].active = false;

      setActiveDelivery((prev) => ({
        ...prev,
        status: "delivered",
        deliveryStatus: updatedStatus,
      }));

      setOrderHistory((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, status: "delivered", deliveryStatus: updatedStatus }
            : o
        )
      );
    }, 900000); // 15 minutes
  };

  const handleOtpVerification = () => {
    setShowOtpPopup(true);
  };

  const closeOtpPopup = () => {
    setShowOtpPopup(false);
  };

  const verifyOtp = () => {
    setOtpVerified(true);
    setShowOtpPopup(false);
    navigate("/payment"); // Redirect to payment page after OTP verification
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage setLocation={setLocation} />} />
        <Route
          path="/restaurants"
          element={
            <RestaurantSelectionPage
              location={location}
              clusters={[
                { id: 1, name: "Nearby (0-2 km)" },
                { id: 2, name: "Medium (2-6 km)" },
                { id: 3, name: "Far (6+ km)" },
              ]}
              setCluster={setCluster}
            />
          }
        />
        <Route
          path="/restaurant/:restaurantId"
          element={
            <RestaurantPage
              location={location}
              cluster={cluster}
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
        <Route path="/adminDashboard" element={<RestaurantManagement />} />
        <Route
          path="/admin/:id"
          element={<VendorDashboard user={user} setUser={setUser} />}
        />
      </Routes>
      {showOtpPopup && (
        <OtpVerificationPopup onClose={closeOtpPopup} onVerify={verifyOtp} />
      )}
    </>
  );
}

export default App;
