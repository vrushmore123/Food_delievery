// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VendorMenuForm from "./components/Dashboard/Vendor";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import RestaurantMenu from "./pages/RestaurantMenu";
// import Cart from "./pages/Cart";
// import OrderStatus from "./pages/OrderStatus";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendor" element={<VendorMenuForm />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-status" element={<OrderStatus />} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
