import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = ({ cart, completeOrder, user }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [qrCodeShown, setQrCodeShown] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [contactInfo, setContactInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 29;
  const total = subtotal + deliveryFee;

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "number") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiry") {
      formattedValue = formatExpiry(value);
    } else if (name === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 3);
    }

    setCardDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!address.trim()) {
      errors.address = "Delivery address is required";
    }

    if (paymentMethod === "credit-card") {
      if (
        !cardDetails.number ||
        cardDetails.number.replace(/\s/g, "").length < 16
      ) {
        errors.cardNumber = "Valid card number is required";
      }
      if (!cardDetails.name.trim()) {
        errors.cardName = "Cardholder name is required";
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        errors.cardExpiry = "Valid expiry date is required";
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        errors.cardCvv = "Valid CVV is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendOtp = () => {
    if (!contactInfo.trim()) {
      setOtpError("Phone number or email is required");
      return;
    }
    setOtpSent(true);
    setOtpError("");
    // Simulate OTP sending
    setTimeout(() => {
      alert("OTP sent to " + contactInfo);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp !== "1234") {
      // Simulate OTP verification
      setOtpError("Invalid OTP");
      return;
    }
    setOtpError("");
    completeOrderAndNavigate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    if (!otpSent) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  const completeOrderAndNavigate = () => {
    completeOrder({
      total,
      address,
      paymentMethod,
      deliveryInstructions,
      cardDetails: paymentMethod === "credit-card" ? cardDetails : null,
      status: "preparing",
      deliveryStatus: [
        {
          id: 1,
          status: "preparing",
          title: "Preparing your order",
          description: "The restaurant is preparing your food",
          icon: "👨‍🍳",
          time: new Date().toLocaleTimeString(),
          active: true,
        },
        {
          id: 2,
          status: "ready",
          title: "Order ready",
          description: "Your order is packed and ready for delivery",
          icon: "📦",
          time: "",
          active: false,
        },
        {
          id: 3,
          status: "on-the-way",
          title: "On the way",
          description: "Your delivery partner is on the way",
          icon: "🚴",
          time: "",
          active: false,
        },
        {
          id: 4,
          status: "delivered",
          title: "Delivered",
          description: "Enjoy your meal!",
          icon: "🎉",
          time: "",
          active: false,
        },
      ],
    });
    setOrderCompleted(true);
    setIsProcessing(false);
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform animate-pulse">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-green-500 text-4xl animate-bounce">✓</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-8">
            Your delicious food is being prepared and will arrive soon.
          </p>
          <button
            onClick={() => navigate("/restaurants")}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
          >
            Track Your Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-600">
            Just a few more steps to enjoy your delicious meal
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Delivery Address */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          1
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Delivery Address
                      </h2>
                    </div>
                    <div className="ml-11">
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full border-2 rounded-xl p-4 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                          formErrors.address
                            ? "border-red-400"
                            : "border-gray-200 focus:border-blue-400"
                        }`}
                        rows="4"
                        placeholder="Enter your complete delivery address with landmarks"
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">
                          2
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Delivery Instructions
                      </h2>
                    </div>
                    <div className="ml-11">
                      <textarea
                        value={deliveryInstructions}
                        onChange={(e) =>
                          setDeliveryInstructions(e.target.value)
                        }
                        className="w-full border-2 border-gray-200 rounded-xl p-4 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400"
                        rows="3"
                        placeholder="Any special instructions? (e.g., Ring the bell, Leave at door)"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          3
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Payment Method
                      </h2>
                    </div>

                    <div className="ml-11 space-y-4">
                      {/* Credit Card Option */}
                      <div
                        className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                          paymentMethod === "credit-card"
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("credit-card")}
                      >
                        <label className="flex items-center space-x-4 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="credit-card"
                            checked={paymentMethod === "credit-card"}
                            onChange={() => setPaymentMethod("credit-card")}
                            className="h-5 w-5 text-blue-600"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">💳</div>
                            <span className="font-medium text-gray-800">
                              Credit/Debit Card
                            </span>
                          </div>
                        </label>
                      </div>

                      {paymentMethod === "credit-card" && (
                        <div className="ml-8 space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                          {/* Card Number */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              name="number"
                              value={cardDetails.number}
                              onChange={handleCardChange}
                              className={`w-full border-2 rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                                formErrors.cardNumber
                                  ? "border-red-400"
                                  : "border-gray-200 focus:border-blue-400"
                              }`}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                            />
                            {formErrors.cardNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.cardNumber}
                              </p>
                            )}
                          </div>

                          {/* Cardholder Name */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={cardDetails.name}
                              onChange={handleCardChange}
                              className={`w-full border-2 rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                                formErrors.cardName
                                  ? "border-red-400"
                                  : "border-gray-200 focus:border-blue-400"
                              }`}
                              placeholder="John Doe"
                            />
                            {formErrors.cardName && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.cardName}
                              </p>
                            )}
                          </div>

                          {/* Expiry and CVV */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                name="expiry"
                                value={cardDetails.expiry}
                                onChange={handleCardChange}
                                className={`w-full border-2 rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                                  formErrors.cardExpiry
                                    ? "border-red-400"
                                    : "border-gray-200 focus:border-blue-400"
                                }`}
                                placeholder="MM/YY"
                                maxLength="5"
                              />
                              {formErrors.cardExpiry && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.cardExpiry}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardChange}
                                className={`w-full border-2 rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                                  formErrors.cardCvv
                                    ? "border-red-400"
                                    : "border-gray-200 focus:border-blue-400"
                                }`}
                                placeholder="123"
                                maxLength="3"
                              />
                              {formErrors.cardCvv && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.cardCvv}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mobile Pay Option */}
                      <div
                        className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                          paymentMethod === "mobile-pay"
                            ? "border-green-400 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("mobile-pay")}
                      >
                        <label className="flex items-center space-x-4 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="mobile-pay"
                            checked={paymentMethod === "mobile-pay"}
                            onChange={() => setPaymentMethod("mobile-pay")}
                            className="h-5 w-5 text-green-600"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">📱</div>
                            <span className="font-medium text-gray-800">
                              MobilePay
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* QR Code Option */}
                      <div
                        className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                          paymentMethod === "qr-code"
                            ? "border-purple-400 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("qr-code")}
                      >
                        <label className="flex items-center space-x-4 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="qr-code"
                            checked={paymentMethod === "qr-code"}
                            onChange={() => setPaymentMethod("qr-code")}
                            className="h-5 w-5 text-purple-600"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">📱</div>
                            <span className="font-medium text-gray-800">
                              Pay with QR Code
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Cash on Delivery Option */}
                      <div
                        className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                          paymentMethod === "cash"
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <label className="flex items-center space-x-4 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={() => setPaymentMethod("cash")}
                            className="h-5 w-5 text-orange-600"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">💵</div>
                            <span className="font-medium text-gray-800">
                              Cash on Delivery
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 font-semibold text-sm">
                          4
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Contact Information
                      </h2>
                    </div>
                    <div className="ml-11">
                      <input
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        className={`w-full border-2 rounded-xl p-4 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-100 ${
                          otpError
                            ? "border-red-400"
                            : "border-gray-200 focus:border-yellow-400"
                        }`}
                        placeholder="Enter phone number or email"
                      />
                      {otpError && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {otpError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* OTP Verification */}
                  {otpSent && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-sm">
                            5
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          OTP Verification
                        </h2>
                      </div>
                      <div className="ml-11">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className={`w-full border-2 rounded-xl p-4 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-100 ${
                            otpError
                              ? "border-red-400"
                              : "border-gray-200 focus:border-red-400"
                          }`}
                          placeholder="Enter OTP"
                        />
                        {otpError && (
                          <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {otpError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-3 border-b border-gray-100"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          DKK {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-orange-200 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>DKK {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>DKK {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-orange-200 pt-3">
                    <span>Total</span>
                    <span>DKK {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className={`w-full mt-8 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-lg"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Place Order – DKK ${total.toFixed(2)}`
                  )}
                </button>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="text-green-500">🔒</div>
                  <span>Secure payment powered by SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {qrCodeShown && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Scan QR Code
              </h2>
              <div className="w-48 h-48 bg-gray-100 mx-auto mb-6 rounded-xl flex items-center justify-center">
                <div className="text-6xl">📱</div>
              </div>
              <p className="text-gray-600 mb-4">
                Scan this QR code with your mobile payment app
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Amount: DKK {total.toFixed(2)}
              </p>
              <div className="mt-6 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-gray-600">
                  Waiting for payment...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
